import './Dashboard.css'
import '../navigation/nav-layout.css'
import SunTile from '../tile/SunTile'
import TideTile from '../tile/TideTile'
import TempTile from '../tile/TempTile'
import RainTile from '../tile/RainTile'
import WindChart from '../chart/WindChart'
import SolunarChart from '../chart/SolunarChart'
import React, { useEffect } from 'react'

function Dashboard(props) {
  const { state, setState } = props
  let forecasts = state.data.forecasts
  let tides = forecasts.tides?.days[state.marker]?.entries || []
  let sun = forecasts.sunrisesunset?.days[state.marker]?.entries[0] || {}
  let temp = forecasts.weather?.days[state.marker]?.entries[0] || {}
  let rain = forecasts.rainfall?.days[state.marker]?.entries[0] || {}
  let wind = forecasts.wind?.days[state.marker]?.entries || []
  let UV = forecasts.uv?.days[state.marker]?.entries || []
  let hourlyRating = state.solunarArray[state.marker]?.hourlyRating || {}

  useEffect(() => {
    setState({
      ...state,
      pageTitle: 'Dashboard',
      showNav: true,
      showDate: true,
    })
    document.title = `Golden Tides | Dashboard`
  }, [])

  return (
    <div className="dashboard">
      <SunTile className="tile-1" time={sun.riseDateTime} type="Sunrise" />
      <TempTile className="tile-2" min={temp.min} max={temp.max} />
      <RainTile className="tile-3" prob={rain.probability} />
      <SunTile className="tile-4" time={sun.setDateTime} type="Sunset" />
      {tides.map((item, i) => (
        <TideTile name={'tile tide-' + (i + 5)} key={'tides' + i} data={item} />
      ))}

      <div className="tile tile-9">
        <WindChart data={wind} />
      </div>
      <div className="tile tile-10">
        <SolunarChart data={hourlyRating} />
      </div>
    </div>
  )
}

export default Dashboard
