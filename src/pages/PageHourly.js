import '../components/navigation/nav-layout.css'
import Hourly from '../components/dashboard/Hourly'
import TopNav from '../components/navigation/TopNav'
import SideNav from '../components/navigation/SideNav'

function PageHourly(props) {
  const { state, setState, refresh, embedded } = props

  let forecasts = state.data.forecasts

  return (
    <div className={'content ' + (embedded ? 'embedded' : '')}>
      <div className="app-1 main-nav">
        <TopNav state={state} setState={setState} />
      </div>
      <div className="app-2 main-nav">
        <Hourly state={state} setState={setState} forecasts={forecasts} />
      </div>
    </div>
  )
}

export default PageHourly
