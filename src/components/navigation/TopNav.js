import ButtonNav from './ButtonNav'
import './navigation.css'

function TopNav(props) {
  const { state, setState } = props
  let date = new Date(
    state.data.forecasts.sunrisesunset.days[state.marker].dateTime,
  )
  const options = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }
  const dateString = date.toLocaleDateString([], options)
  console.log(state.showNav)
  return (
    <div className="topNav">
      <div className={'topNavLeft' + (state.showNav ? '' : ' hidden')}>
        <ButtonNav state={state} setState={setState} type="back" />
      </div>
      <div className="topNavMid">
        <h4>Golden Beach {state.pageTitle}</h4>
        <p className={state.showDate ? '' : 'hidden'}>{dateString}</p>
      </div>
      <div className={'topNavRight' + (state.showNav ? '' : ' hidden')}>
        <ButtonNav state={state} setState={setState} type="forward" />
      </div>
    </div>
  )
}

export default TopNav
