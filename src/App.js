import './App.css'
import Dashboard from './components/dashboard/dashboard'
import TopNav from './components/navigation/TopNav'
import SideNav from './components/navigation/SideNav'
import Loader from './components/loader/Loader'
import WindyMap from './components/map/WindyMap'
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const key = 'YTFlM2ExMWM1N2ZkMGRiMzM2NmMyYW'
const proxy = 'https://gentle-reef-68268.herokuapp.com'
const endpoint = 'https://api.willyweather.com.au/v2'
const goldenBeach = '6871'
const requestType = `tides,wind,sunrisesunset,uv,weather,rainfall,rainfallprobability`
const period = 7
const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1
const date = today.getDate()
const todayDate = `${year}-${month}-${date}`

let fullURL = `${proxy}/${endpoint}/${key}/locations/${goldenBeach}/weather.json?forecasts=${requestType}&days=${period}&startDate=${todayDate}`
//console.log(fullURL)

function App() {
  const [state, setState] = useState({
    data: null,
    marker: 0,
    days: 7,
    pageTitle: 'Forecast',
    showDate: true,
    showNav: true,
  })

  useEffect(() => {
    fetch(fullURL)
      .then((response) => response.json())
      .then((data) => {
        setState({ ...state, data })
      })
      .catch((error) => console.error(error))
  }, [])

  const handleRefresh = () => {
    fetch(fullURL)
      .then((response) => response.json())
      .then((data) => {
        setState({ ...state, data })
      })
      .catch((error) => console.error(error))
  }

  if (!state.data) {
    return (
      <div className="loadMain">
        <Loader />
      </div>
    )
  }

  console.log(state.data.forecasts)

  return (
    <BrowserRouter>
      <div className="app">
        <div className="app-1 main-nav">
          <div className="refresh-icon" onClick={handleRefresh}>
            <span className="material-symbols-outlined">cycle</span>
          </div>
        </div>
        <div className="app-2 main-nav">
          <TopNav state={state} setState={setState} />
        </div>
        <div className="app-3 main-nav">
          <SideNav state={state} setState={setState} />
        </div>
        <div className="app-4 main-nav">
          <Routes>
            <Route
              path="/"
              element={<Dashboard state={state} setState={setState} />}
            ></Route>
            <Route
              path="/wind"
              element={<WindyMap state={state} setState={setState} />}
            ></Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
