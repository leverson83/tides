import React from 'react'
import SideNavItem from './SideNavItem'
import './sideMenu.css'

function SideMenu({ isOpen, toggleMenu }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="sideMenuClose" onClick={toggleMenu}>
        <span className="material-symbols-outlined">left_panel_close</span>
      </button>
      <ul>
        <li>
          <SideNavItem icon="dashboard" linkTo="/" />
        </li>
        <li>
          <SideNavItem icon="cyclone" linkTo="/wind" />
        </li>
        <li>
          <SideNavItem icon="hourglass" linkTo="/hourly" />
        </li>
      </ul>
    </div>
  )
}

export default SideMenu
