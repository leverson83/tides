import ButtonNav from './ButtonNav'
import './navigation.css'

function TopNav(props) {
  const { state, setState } = props
  let date = new Date(
    state.data.forecasts.sunrisesunset.days[state.marker].dateTime,
  )
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const dateString = date.toLocaleDateString([], options)

  return (
    <div className="topNav">
      <div className="topNavLeft">
        <ButtonNav state={state} setState={setState} type="back" />
      </div>
      <div className="topNavMid">
        <h4>Golden Beach Forecast</h4>
        <p>{dateString}</p>
      </div>
      <div className="topNavRight">
        <ButtonNav state={state} setState={setState} type="forward" />
      </div>
    </div>
  )
}

export default TopNav
