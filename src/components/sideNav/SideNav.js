import './SideNav.css'
import SideNavItem from './SideNavItem'

function SideNav(props) {
  const { state, setState } = props

  return (
    <div className="sideNav">
      <SideNavItem icon="dashboard" linkTo="/" />
      <SideNavItem icon="air" linkTo="/wind" />
      <SideNavItem icon="brightness_7" linkTo="/wind" />
      <SideNavItem icon="videocam" linkTo="/wind" />
    </div>
  )
}

export default SideNav
