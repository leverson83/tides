import ButtonNav from './ButtonNav'
import './navigation.css'
import moment from 'moment'

function TopNav(props) {
  const { state, setState } = props
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
    </div>
  )
}

export default TopNav
