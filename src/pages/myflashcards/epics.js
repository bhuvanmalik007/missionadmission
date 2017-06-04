import { Observable } from 'rxjs/Observable' //eslint-disable-line
import request, { withAuthentication } from '../../futils/requestutil'
import { reduceToSenseIds } from '../../futils/selectionreducers'
import { DBINTERCEPTOR_API } from '../../constants'

const getRequest = (urlPath, store) => {
  return Observable.from(
    withAuthentication(store.getState())(
      request,
      DBINTERCEPTOR_API + urlPath + store.getState().core.profile.identities[0].user_id,
      'GET'
    )
  )
}

const postRequest = (reqBody, urlPath, store) => {
  return Observable.from(
    withAuthentication(store.getState())(
      request,
      DBINTERCEPTOR_API + urlPath + store.getState().core.profile.identities[0].user_id,
      'POST',
      JSON.stringify(reqBody)
    )
  )
}

const initMapper = (action$, store) =>
  action$.ofType('INIT_STATE')
  .flatMap((action) => ([{ type: 'FETCH_MYFLASHCARDS' }, { type: 'FETCH_LISTS' }]))

const fetchMyFlashcards = (action$, store) =>
  action$.ofType('FETCH_MYFLASHCARDS')
  .mergeMap(action =>
    getRequest('/user/', store)
    .flatMap((payload) => ([{ type: 'INIT_WORDS', payload }, { type: 'SET_CURRENT_LIST', payload: 'all' }]))
    .catch(payload => Observable.of({ type: 'API_ERROR', payload }))
  )

const fetchMyLists = (action$, store) =>
  action$.ofType('FETCH_LISTS')
  .mergeMap(action =>
    getRequest('/lists/', store)
    .map((lists) => ({ type: 'INIT_LISTS', payload: [{ listId: 'all', listName: 'ALL' }, ...lists.data] }))
    .catch(payload => Observable.of({ type: 'API_ERROR', payload }))
  )

const deleteWords = (action$, store) =>
  action$.ofType('DELETE_WORDS')
  .mergeMap(action =>
    postRequest(action.payload.requestObj, action.payload.route, store)
    .map((payload) => ({ type: 'SUCCESS', payload }))
    .catch(payload => Observable.of({ type: 'API_ERROR', payload }))
  )

const deleteFromAll = (action$, store) =>
  action$.ofType('DELETE_FROM_ALL')
  .map((action) => ({ type: 'DELETE_WORDS', payload: { route: '/deleteword/', requestObj: action.payload } }))

const deleteFromList = (action$, store) =>
  action$.ofType('DELETE_FROM_LIST')
  .map((action) => ({ type: 'DELETE_WORDS', payload: { route: '/deletelistwords/', requestObj: action.payload } }))

const fetchMyListWords = (action$, store) =>
  action$.ofType('FETCH_LIST_WORDS')
  .mergeMap(action =>
    postRequest({ listId: action.payload }, '/getlistwords/', store)
    .flatMap((payload) => ([{ type: 'INIT_WORDS', payload }, { type: 'SET_CURRENT_LIST', payload: action.payload }]))
    .catch(payload => Observable.of({ type: 'API_ERROR', payload }))
  )

const createList = (action$, store) =>
  action$.ofType('CREATE_LIST')
  .mergeMap(action =>
    postRequest({ listName: action.payload, wordIds:[] }, '/addlist/', store)
    .map(({ id }) => ({ type: 'ADD_LIST', payload:{ listId: id, listName: action.payload } }))
    .catch(payload => Observable.of({ type: 'API_ERROR' }))
  )

const addWordsToList = (action$, store) =>
  action$.ofType('ADD_WORDS_TO_LIST')
  .mergeMap(action =>
    postRequest({ listId: action.payload,
      wordIds: reduceToSenseIds(store.getState().wordsState.filteredArray) }, '/addlist/', store)
    .map((payload) => ({ type: 'SUCCESS', payload }))
    .catch(payload => Observable.of({ type: 'API_ERROR' }))
  )

const renameList = (action$, store) =>
  action$.ofType('RENAME_LIST')
  .mergeMap(action =>
    postRequest(action.payload, '/renamelist/', store)
    .map((payload) => ({ type: 'SUCCESS', payload }))
    .catch(payload => Observable.of({ type: 'API_ERROR' }))
  )

const deleteList = (action$, store) =>
  action$.ofType('DELETE_LIST')
  .mergeMap(action =>
    postRequest({ listIds: [action.payload] }, '/deletelist/', store)
    .map((payload) => ({ type: 'SUCCESS', payload }))
    .catch(payload => Observable.of({ type: 'API_ERROR' }))
  )

export default [initMapper, fetchMyFlashcards, fetchMyLists, deleteWords,
  fetchMyListWords, createList, addWordsToList,
  renameList, deleteList, deleteFromList, deleteFromAll]
