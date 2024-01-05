import React from 'react'

function HourlyTile(props) {
  const dateObject = new Date(props.time)
  const timeString = dateObject.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="col-12 col-sm-6 col-lg-3 hourlyWrapper">
      <div className="directionMarker">
        <div style={{ transform: `rotate(${props.direction}deg)` }}>
          <span className="material-symbols-outlined">south</span>
          <span className="material-symbols-outlined">south</span>
          <span className="material-symbols-outlined">south</span>
          <span className="material-symbols-outlined">south</span>
          <span className="material-symbols-outlined">south</span>
        </div>
        <div className="windSpeed">
          <span
            className="material-symbols-outlined speedo"
            style={{
              color:
                props.speed > 20
                  ? 'red'
                  : props.speed > 15
                  ? 'orange'
                  : 'green',
            }}
          >
            speed
          </span>
          <div
            className="speedValue"
            style={{
              color:
                props.speed > 20
                  ? 'red'
                  : props.speed > 15
                  ? 'orange'
                  : 'green',
            }}
          >
            {props.speed}
          </div>
        </div>
        <div className="hourlyTime">{timeString}</div>
        <div className="rainProb">
          <span
            className="material-symbols-outlined raino"
            style={{
              color:
                props.rain.probability > 50
                  ? 'red'
                  : props.rain.probability > 25
                  ? 'orange'
                  : 'green',
            }}
          >
            weather_mix
          </span>
          <div
            className="rainProbValue"
            style={{
              color:
                props.rain.probability > 50
                  ? 'red'
                  : props.rain.probability > 25
                  ? 'orange'
                  : 'green',
            }}
          >
            {props.rain.probability}%
          </div>
        </div>

        <div className="hourlyRating">
          <span
            className="material-symbols-outlined rato"
            style={{
              color:
                props.rating > 40
                  ? 'green'
                  : props.rating > 20
                  ? 'orange'
                  : 'red',
            }}
          >
            phishing
          </span>
          <div
            className="hourlyRatingValue"
            style={{
              color:
                props.rating > 40
                  ? 'green'
                  : props.rating > 20
                  ? 'orange'
                  : 'red',
            }}
          >
            {props.rating}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HourlyTile
