import './Dashboard.css'
import Tile from '../tile/Tile'
import SunTile from '../tile/SunTile'
import TempTile from '../tile/TempTile'
import RainTile from '../tile/RainTile'

function Dashboard(props) {
  const { state, setState } = props
  let tides = state.data.forecasts.tides.days[state.marker].entries
  let sun = state.data.forecasts.sunrisesunset.days[state.marker].entries[0]
  let temp = state.data.forecasts.weather.days[state.marker].entries[0]
  let rain = state.data.forecasts.rainfall.days[state.marker].entries[0]
  //console.log(rain)
  return (
    <div className="dashboard">
      <SunTile time={sun.riseDateTime} type="Sunrise" />
      <TempTile min={temp.min} max={temp.max} />
      <RainTile prob={rain.probability} />
      <SunTile time={sun.setDateTime} type="Sunset" />

      {tides.map((item, i) => (
        <Tile name={'tile tide-' + i} key={'tides' + i} data={item} />
      ))}

      {tides.length < 4 ? <div className="tile tile-4">&nbsp</div> : ''}
    </div>
  )
}

export default Dashboard
