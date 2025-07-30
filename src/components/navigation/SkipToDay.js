import moment from 'moment'

function SkipToDay(props) {
  const { state, setState, index } = props
  const date = moment(state.data.forecasts.sunrisesunset.days[index].dateTime)
  const dateString = date.format('ddd')
  let forecasts = state.data.forecasts
  let wind = forecasts.wind?.days[props.index]?.entries || []
  let rainProb = forecasts.rainfallprobability?.days[props.index]?.entries || {}

  let morningTotals = {
    wind: 0,
    rain: 0,
    rainRating: 'C',
    windRating: '-',
  }

  let afternoonTotals = {
    wind: 0,
    rain: 0,
    rainRating: 'C',
    windRating: '-',
  }

  const rainProbPadded = []
  for (let i = 0; i < rainProb.length; i++) {
    const value = rainProb[i]
    rainProbPadded.push(value, value, value)
  }

  wind.map((item, index) => {
    if (index >= 4 && index < 12) {
      morningTotals.wind += item.speed
    } else if (index >= 12 && index <= 19) {
      afternoonTotals.wind += item.speed
    }
  })

  rainProbPadded.forEach((item, index) => {
    if (index >= 4 && index < 12) {
      if (item.probability > morningTotals.rain) {
        morningTotals.rain = item.probability
      }
    } else if (index >= 12 && index <= 19) {
      if (item.probability > afternoonTotals.rain) {
        afternoonTotals.rain = item.probability
      }
    }
  })

  morningTotals.wind < 120
    ? (morningTotals.windRating = '++')
    : morningTotals.wind < 160
    ? (morningTotals.windRating = '+')
    : (morningTotals.windRating = '-')

  morningTotals.rain < 25
    ? (morningTotals.rainRating = 'A')
    : morningTotals.rain < 40
    ? (morningTotals.rainRating = 'B')
    : (morningTotals.rainRating = 'C')

  afternoonTotals.wind < 120
    ? (afternoonTotals.windRating = '++')
    : afternoonTotals.wind < 160
    ? (afternoonTotals.windRating = '+')
    : (afternoonTotals.windRating = '-')

  afternoonTotals.rain < 25
    ? (afternoonTotals.rainRating = 'A')
    : afternoonTotals.rain < 40
    ? (afternoonTotals.rainRating = 'B')
    : (afternoonTotals.rainRating = 'C')

  function handleButtonClick() {
    setState({ ...state, marker: index })
  }

  const containerClassName =
    'skipToDay' + (index === state.marker ? ' active' : '')

  return (
    <div className={containerClassName} onClick={handleButtonClick}>
      {dateString}
      <div className="dayRating morning">
        {morningTotals.rainRating}
        {morningTotals.windRating}
      </div>
      <div className="dayRating afternoon">
        {afternoonTotals.rainRating}
        {afternoonTotals.windRating}
      </div>
    </div>
  )
}

export default SkipToDay
