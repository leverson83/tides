import moment from 'moment'
import './tiles.css'

function TideTile(props) {
  let dateTime = moment(props.data.dateTime)

  let time = dateTime.format('LT')

  return (
    <div className={props.name}>
      <div className="tile-inner">
        <p>
          <span className="material-symbols-outlined tile-icon">
            {props.data.type == 'high'
              ? 'vertical_align_top'
              : 'vertical_align_bottom'}
          </span>
        </p>
        <h4>{time}</h4>
        <p>
          {props.data.type.charAt(0).toUpperCase() + props.data.type.slice(1)}
        </p>
        <small>{props.data.height}m</small>
      </div>
    </div>
  )
}

export default TideTile
