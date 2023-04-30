import './Tile.css'

function TempTile(props) {
  return (
    <div className={'tile ' + props.className}>
      <div className="tile-inner">
        <p>
          <span className="material-symbols-outlined tile-icon">
            device_thermostat
          </span>
        </p>
        <h4>
          {props.min} - {props.max} °
        </h4>
        <p>Temperature</p>
      </div>
    </div>
  )
}

export default TempTile
