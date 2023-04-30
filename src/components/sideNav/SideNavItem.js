import { Link } from 'react-router-dom'

function SideNavItem(props) {
  return (
    <Link to={props.linkTo}>
      <div className="sideNavItem">
        <span className="material-symbols-outlined">{props.icon}</span>
      </div>
    </Link>
  )
}

export default SideNavItem
