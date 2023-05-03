import './Dashboard.css'
import SunTile from '../tile/SunTile'
import TempTile from '../tile/TempTile'
import RainTile from '../tile/RainTile'
import WindChart from '../chart/WindChart'
import TideChart from '../chart/TideChart'
import UVChart from '../chart/UVChart'

function Dashboard(props) {
  const { state, setState } = props
  let forecasts = state.data.forecasts
  let tides = forecasts.tides?.days[state.marker]?.entries
  let sun = forecasts.sunrisesunset?.days[state.marker]?.entries[0]
  let temp = forecasts.weather?.days[state.marker]?.entries[0]
  let rain = forecasts.rainfall?.days[state.marker]?.entries[0]
  let wind = forecasts.wind?.days[state.marker]?.entries
  let UV = forecasts.uv.days[state.marker]?.entries

  return (
    <div className="dashboard">
      <SunTile className="tile-1" time={sun.riseDateTime} type="Sunrise" />
      <TempTile className="tile-2" min={temp.min} max={temp.max} />
      <RainTile className="tile-3" prob={rain.probability} />
      <SunTile className="tile-4" time={sun.setDateTime} type="Sunset" />

      <div className="tile tile-5">
        <WindChart data={wind} />
      </div>
      <div className="tile tile-6">
        <TideChart data={tides} />
      </div>

      <div className="tile tile-7">
        {UV.length > 0 ? <UVChart data={UV} /> : null}
      </div>
      <div className="tile tile-8">
        <TideChart data={tides} />
      </div>
    </div>
  )
}

export default Dashboard
