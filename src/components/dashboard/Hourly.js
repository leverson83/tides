import './Dashboard.css'
import '../navigation/nav-layout.css'
import HourlyTile from '../tile/HourlyTile'

function Hourly(props) {
  const { state, setState } = props
  let forecasts = state.data.forecasts
  let rainProb = state.rainProb[state.marker]?.entries || {}
  let wind = forecasts.wind?.days[state.marker]?.entries || []
  let hourlyRating = state.solunarArray[state.marker].hourlyRating
  let tides = state.tidesPadded[state.marker]?.entries || []

  return (
    <div>
      <div className="container-fluid hourly">
        <div className="row">
          {wind.map((item, index) => {
            if (index >= 4 && index <= 19) {
              return (
                <HourlyTile
                  key={`hourly-${index}`}
                  direction={item.direction}
                  speed={item.speed}
                  time={item.dateTime}
                  rain={rainProb[index]}
                  index={index}
                  rating={hourlyRating[index]}
                  tides={tides}
                />
              )
            } else {
              return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default Hourly
