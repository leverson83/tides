import moment from 'moment'

function SkipToDay(props) {
  const { state, setState, index } = props
  const date = moment(state.data.forecasts.sunrisesunset.days[index].dateTime)
  const dateString = date.format('ddd')

  function handleButtonClick() {
    console.log('handleButtonClick called')
    setState({ ...state, marker: index })
  }

  const containerClassName =
    'skipToDay' + (index === state.marker ? ' active' : '')

  return (
    <div className={containerClassName} onClick={handleButtonClick}>
      {dateString}
    </div>
  )
}

export default SkipToDay
