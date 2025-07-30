import './tiles.css'
import moment from 'moment'

function SunTile(props) {
  let dateTime = moment(props.time)

  let time = dateTime.format('LT')

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
