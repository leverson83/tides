import React from 'react'

function DirectionTile(props) {
  console.log(props.data)
  return (
    <div className="col hourlyWrapper">
      <div className="hourlyInner direction">
        <span
          className="material-symbols-outlined"
          style={{ transform: `rotate(${props.data}deg)` }}
        >
          south
        </span>
      </div>
    </div>
  )
}

export default DirectionTile
