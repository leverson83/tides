import WindyMap from '../components/map/WindyMap'
import TopNav from '../components/navigation/TopNav'
import SideNav from '../components/navigation/SideNav'

function PageMap(props) {
  const { state, setState, refresh, embedded } = props
  return (
    <div className={'content ' + (embedded ? 'embedded' : '')}>
      <div className="app-1 main-nav">
        <div className="refresh-icon" onClick={refresh}>
          <span className="material-symbols-outlined">cycle</span>
        </div>
      </div>
      <div className="app-2 main-nav">
        <TopNav state={state} setState={setState} />
      </div>
      <div className="app-3 main-nav">
        <SideNav state={state} setState={setState} />
      </div>
      <div className="app-4 main-nav">
        <WindyMap state={state} setState={setState} />
      </div>
    </div>
  )
}

export default PageMap
