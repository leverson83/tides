import './Dashboard.css'
import '../navigation/nav-layout.css'
import HourlyTile from '../tile/HourlyTile'
import React, { useEffect } from 'react'

function Hourly(props) {
  const { state, setState } = props
  let forecasts = state.data.forecasts
  let rainProb =
    forecasts.rainfallprobability?.days[state.marker]?.entries || {}
  let wind = forecasts.wind?.days[state.marker]?.entries || []
  let hourlyRating = props.solunarArray[state.marker].hourlyRating

  const rainProbPadded = []
  for (let i = 0; i < rainProb.length; i++) {
    const value = rainProb[i]
    rainProbPadded.push(value, value, value)
  }

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
                  rain={rainProbPadded[index]}
                  index={index}
                  rating={hourlyRating[index]}
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
