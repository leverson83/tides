import '../components/navigation/nav-layout.css'
import Dashboard from '../components/dashboard/dashboard'
import TopNav from '../components/navigation/TopNav'
import SideNav from '../components/navigation/SideNav'

function PageHome(props) {
  const { state, setState, refresh, embedded } = props
  return (
    <div className={'content ' + (embedded ? 'embedded' : '')}>
      <div className="app-2 main-nav">
        <TopNav state={state} setState={setState} />
      </div>
      <div className="app-3 main-nav">
        <div>.</div>
      </div>
      <div className="app-4 main-nav">
        <Dashboard state={state} setState={setState} />
      </div>
    </div>
  )
}

export default PageHome
