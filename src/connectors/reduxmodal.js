import React from 'react'
import { Modal } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { pick } from 'ramda' //eslint-disable-line
import { connect } from 'react-redux'
import AddList from '../connectors/addlist'
import SelectList from '../connectors/addwordlistselect'
import ListSettings from '../connectors/listsettings'
import SlideShow from '../connectors/slideshow'
import TestListSelect from '../connectors/testListSelect'
import styled, { keyframes } from 'styled-components'

const fade = keyframes `
  from {
    transform : translateY(10%);
    opacity : 0;
  }
  to {
    transform : translateY(0%);
    opacity : 1;
  }
`
const Animatedmodal = styled(Modal)`
  animation: ${fade} 0.5s;
`

const modalContentMapper = {
  ADD_LIST: <AddList />,
  SELECT_LIST: <SelectList />,
  LIST_SETTINGS: <ListSettings />,
  SLIDESHOW: <SlideShow />,
  TEST_LIST_SELECT: <TestListSelect />
}

const ReduxModal = ({ visibility, header, content, showModal, size }) =>
  <Animatedmodal
    open={visibility}
    size={size}
    header={header}
    content={modalContentMapper[content]}
    // closeIcon='close'
    onClose={showModal}
  />

ReduxModal.propTypes = {
  visibility: PropTypes.bool,
  content: PropTypes.string,
  header: PropTypes.string,
  showModal: PropTypes.func,
  size: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  showModal: () => dispatch({ type: 'SHOW_MODAL' })
})

const mapStateToProps = state => ({
  ...pick(['visibility', 'content', 'header'], state.reduxModal)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReduxModal)
