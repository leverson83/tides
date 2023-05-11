import './App.css'
import Loader from './components/loader/Loader'
import PageHome from './pages/PageHome'
import PageMap from './pages/PageMap'
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
        <Routes>
          <Route
            path="/"
            element={
              <PageHome
                state={state}
                setState={setState}
                refresh={handleRefresh}
                embedded={false}
              />
            }
          ></Route>
          <Route
            path="/wind"
            element={
              <PageMap state={state} setState={setState} embedded={false} />
            }
          ></Route>
          <Route
            path="/embedded/home"
            element={
              <PageHome state={state} setState={setState} embedded={true} />
            }
          ></Route>
          <Route
            path="/embedded/wind"
            element={
              <PageMap state={state} setState={setState} embedded={true} />
            }
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
