import './tiles.css'

function SunTile(props) {
  let dateTime = new Date(props.time)

  let time = dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className={'tile ' + props.className}>
      <div className="tile-inner">
        <p>
          <span className="material-symbols-outlined tile-icon">
            {props.type == 'Sunrise' ? 'wb_sunny' : 'sleep'}
          </span>
        </p>
        <h4>{time}</h4>
        <p>{props.type}</p>
      </div>
    </div>
  )
}

export default SunTile
