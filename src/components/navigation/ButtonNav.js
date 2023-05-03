import './navigation.css'
import React from 'react'

function ButtonNav(props) {
  const { state, setState, type } = props

  function handleButtonClick() {
    if (type == 'forward') {
      if (state.marker < state.days - 1) {
        setState({ ...state, marker: state.marker + 1 })
      } else {
        setState({ ...state, marker: 0 })
      }
    } else {
      if (state.marker > 0) {
        setState({ ...state, marker: state.marker - 1 })
      } else {
        setState({ ...state, marker: state.marker })
      }
    }
  }

  return (
    <div className={'btn-custom '} onClick={handleButtonClick}>
      <div className="btn-inner">{type == 'forward' ? 'Next' : 'Previous'}</div>
    </div>
  )
}

export default ButtonNav
