import './App.css'
//import data from './data/weather-api.json'
import Dashboard from './components/dashboard/dashboard'
import TopNav from './components/topNav/TopNav'
import React from 'react'
React.unstable_disableStrictMode = true

function getData() {
  const key = 'YTFlM2ExMWM1N2ZkMGRiMzM2NmMyYW'
  const proxy = 'https://gentle-reef-68268.herokuapp.com'
  const endpoint = 'https://api.willyweather.com.au/v2'
  const goldenBeach = '6871'
  const requestType = `tides,wind,sunrisesunset,uv,weather,rainfall`
  const period = 7
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const date = today.getDate()
  const todayDate = `${year}-${month}-${date}`

  let fullURL = `${proxy}/${endpoint}/${key}/locations/${goldenBeach}/weather.json?forecasts=${requestType}&days=${period}&startDate=${todayDate}`
  //console.log(fullURL)
  function getData() {
    fetch(fullURL)
      .then((response) => response.json())
      .then((data) =>
        localStorage.setItem('weather-data', JSON.stringify(data)),
      )
      .catch((error) => console.error(error))
  }

  //getData()

  //localStorage.setItem('weather-data', JSON.stringify(data))
  return JSON.parse(localStorage.getItem('weather-data'))
}

function App() {
  let forecastArray = getData()
  //console.log(forecastArray)
  const [state, setState] = React.useState({
    data: forecastArray,
    marker: 0,
    days: 7,
  })

  return (
    <div className="app">
      <div className="app-1 main-nav">
        <div className="refresh-icon" onClick={getData}>
          <span className="material-symbols-outlined">cycle</span>
        </div>
      </div>
      <div className="app-2 main-nav">
        <TopNav state={state} setState={setState} />
      </div>
      <div className="app-3 main-nav"> </div>
      <div className="app-4 main-nav">
        <Dashboard state={state} setState={setState} />
      </div>
    </div>
  )
}

export default App
