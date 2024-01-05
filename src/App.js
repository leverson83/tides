import './App.css'
import Loader from './components/loader/Loader'
import PageHome from './pages/PageHome'
import PageMap from './pages/PageMap'
import PageHourly from './pages/PageHourly'
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

function App() {
  const [state, setState] = useState({
    data: null,
    marker: 0,
    days: 7,
    pageTitle: 'Forecast',
    showDate: true,
    showNav: true,
    ratingGood: 20,
    ratingMedium: 10,
  })

  const [weatherData, setWeatherData] = useState(null)
  const [solunarArray, setSolunarArray] = useState([])

  useEffect(() => {
    fetchWeatherData()
    fetchSolunarData()
  }, [])

  const fetchSolunarData = () => {
    const coordinates = []

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      const dateString = currentDate
        .toISOString()
        .split('T')[0]
        .replace(/-/g, '')

      coordinates.push({
        lat: -26.8114659,
        lon: 153.1288131,
        date: dateString,
        hour: '10',
      })
    }

    const requests = coordinates.map((coord) => {
      const { lat, lon, date, hour } = coord
      const url = `https://api.solunar.org/solunar/${lat},${lon},${date},${hour}`

      return fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          // Merge solunarData with date
          const solunarData = { ...data, date }
          setSolunarArray((prevArray) => [...prevArray, solunarData])
        })
        .catch((error) => {
          console.error(
            `There was a problem with the fetch operation for date ${date}:`,
            error,
          )
        })
    })

    Promise.all(requests)
      .then(() => {})
      .catch((error) => {
        console.error('One or more Solunar requests failed:', error)
      })
  }

  const fetchWeatherData = () => {
    fetch(fullURL)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data)
        setState({ ...state, data })
      })
      .catch((error) => console.error(error))
  }

  const handleRefresh = () => {
    fetchWeatherData()
    fetchSolunarData()
  }

  if (!weatherData || solunarArray.length < 7) {
    return (
      <div className="loadMain">
        <Loader />
      </div>
    )
  }

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
          <Route
            path="/hourly"
            element={
              <PageHourly
                state={state}
                setState={setState}
                embedded={false}
                solunarArray={solunarArray}
              />
            }
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
