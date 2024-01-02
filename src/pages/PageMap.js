import '../components/navigation/nav-layout.css'
import WindyMap from '../components/map/WindyMap'
import TopNav from '../components/navigation/TopNav'
import SideNav from '../components/navigation/SideNav'

function PageMap(props) {
  const { state, setState, refresh, embedded } = props
  return (
    <div className={'content ' + (embedded ? 'embedded' : '')}>
      <div className="app-1 main-nav">
        <TopNav state={state} setState={setState} />
      </div>
      <div className="app-2 main-nav">
        <WindyMap state={state} setState={setState} />
      </div>
    </div>
  )
}

export default PageMap
