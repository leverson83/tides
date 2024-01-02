import React, { useEffect, useRef } from 'react'
import './map.css'

function WindyMap(props) {
  const mapWrapperRef = useRef(null)
  const { state, setState, type } = props

  useEffect(() => {
    const iframe = document.querySelector('#windy-map')
    const mapWrapper = mapWrapperRef.current

    setState({ ...state, pageTitle: 'Map', showNav: false, showDate: false })

    if (iframe && mapWrapper) {
      iframe.style.height = `${mapWrapper.offsetHeight}px`
      iframe.style.width = `${mapWrapper.offsetWidth}px`
    }
  }, [])

  return (
    <div className="mapWrapper" ref={mapWrapperRef}>
      <iframe
        id="windy-map"
        src="https://embed.windy.com/embed2.html?lat=-26.840&lon=153.094&detailLat=-37.816&detailLon=144.967&width=650&height=450&zoom=11&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=24&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1&date=2024-02-01"
        frameBorder="0"
      ></iframe>
    </div>
  )
}

export default WindyMap
