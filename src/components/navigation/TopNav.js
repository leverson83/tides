import React, { useState } from 'react'
import moment from 'moment'
import SkipToDay from './SkipToDay'
import SideMenu from './SideMenu'

function TopNav(props) {
  const { state, setState } = props
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const date = moment(
    state.data.forecasts.sunrisesunset.days[state.marker].dateTime,
  )
  const dateString = date.format('dddd, MMMM Do')

  return (
    <div className="topNav">
      <div className="topNavMid">
        <h4>Golden Beach</h4>
        <p className={state.showDate ? '' : 'hidden'}>{dateString}</p>
      </div>
      <div className="topNavRight">
        {state.data.forecasts.sunrisesunset.days.map((item, i) => (
          <SkipToDay
            key={'days' + i}
            state={state}
            setState={setState}
            index={i}
          />
        ))}
        <div className="skipToDay">
          <span className="material-symbols-outlined" onClick={toggleMenu}>
            menu
          </span>
        </div>
      </div>
      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </div>
  )
}

export default TopNav
