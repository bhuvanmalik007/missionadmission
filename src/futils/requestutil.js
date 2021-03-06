function parseJSON (response) {
  return response.json()
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  error.status = response.status
  throw error
}

export const withAuthentication = state => (promise, args, method, body) => promise(args, {
  method,
  headers: {
    'Content-Type': 'application/json',
    // 'User':state.core.profile.identities[0].user_id,
    'Authorization': 'Bearer ' + state.core.idToken
  },
  body
})

export const withCatch = store => promise => promise.catch(e => console.log(e.response.status))

export default function request (url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
}
