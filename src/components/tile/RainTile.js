import './Tile.css'

function RainTile(props) {
  return (
    <div className={'tile ' + props.className}>
      <div className="tile-inner">
        <p>
          <span className="material-symbols-outlined tile-icon">rainy</span>
        </p>
        <h4>{props.prob}%</h4>
        <p>Chance of rain</p>
      </div>
    </div>
  )
}

export default RainTile
