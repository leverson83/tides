import './Dashboard.css'
import Tile from '../tile/Tile'
import SunTile from '../tile/SunTile'
import TempTile from '../tile/TempTile'
import RainTile from '../tile/RainTile'
import BasicChart from '../chart/BasicChart'
import RainChart from '../chart/RainChart'

function Dashboard(props) {
  const { state, setState } = props
  let forecasts = state.data.forecasts
  let tides = forecasts.tides?.days[state.marker].entries
  let sun = forecasts.sunrisesunset?.days[state.marker].entries[0]
  let temp = forecasts.weather?.days[state.marker].entries[0]
  let rain = forecasts.rainfall?.days[state.marker].entries[0]
  let wind = forecasts.wind?.days[state.marker].entries
  let rainChance = forecasts.rainfallprobability?.days[state.marker].entries

  return (
    <div className="dashboard">
      <SunTile className="tile-1" time={sun.riseDateTime} type="Sunrise" />
      <TempTile className="tile-2" min={temp.min} max={temp.max} />
      <RainTile className="tile-3" prob={rain.probability} />
      <SunTile className="tile-4" time={sun.setDateTime} type="Sunset" />

      {tides.map((item, i) => (
        <Tile name={'tile tide-' + (i + 5)} key={'tides' + i} data={item} />
      ))}

      {tides.length < 4 ? <div className="tile tile-4">&nbsp</div> : ''}
      <div className="tile tile-9">
        <BasicChart data={wind} />
      </div>
      <div className="tile tile-10">
        <RainChart data={rainChance} />
      </div>
    </div>
  )
}

export default Dashboard
