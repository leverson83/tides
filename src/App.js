import './App.css'
import Loader from './components/loader/Loader'
import PageHome from './pages/PageHome'
import PageMap from './pages/PageMap'
import PageHourly from './pages/PageHourly'
import TidePage from './pages/TidePage'
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
    solunarArray: [],
    isLoading: true,
    rainProb: [],
    tidesPadded: [],
  })

  useEffect(() => {
    fetchWeatherData()
    fetchSolunarData()
  }, [])

  const fetchSolunarData = async () => {
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
        hour: '+10',
      })
    }

    try {
      const solunarRequests = coordinates.map((coord) => {
        const { lat, lon, date, hour } = coord
        const url = `https://api.solunar.org/solunar/${lat},${lon},${date},${hour}`

        return fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then((data) => ({ ...data, date }))
          .catch((error) => {
            console.error(
              `There was a problem with the fetch operation for date ${date}:`,
              error,
            )
            return null
          })
      })

      const solunarArray = await Promise.all(solunarRequests)

      setState((prevState) => ({
        ...prevState,
        solunarArray: solunarArray.filter((data) => data !== null),
        isLoading: false,
      }))
    } catch (error) {
      console.error('One or more Solunar requests failed:', error)
    }
  }

  useEffect(() => {}, [state.solunarArray])

  const handleRefresh = () => {
    fetchWeatherData()
    fetchSolunarData()
  }

  const fetchWeatherData = () => {
    fetch(fullURL)
      .then((response) => response.json())
      .then((data) => {
        let rainProb = data?.forecasts?.rainfallprobability?.days
        const rainProbPadded = []

        if (rainProb) {
          for (let i = 0; i < rainProb.length; i++) {
            const dayEntry = rainProb[i]
            const dayEntries = dayEntry.entries
            const paddedEntries = []

            for (let j = 0; j < dayEntries.length; j++) {
              const value = dayEntries[j].probability
              paddedEntries.push(
                { dateTime: dayEntries[j].dateTime, probability: value },
                { dateTime: dayEntries[j].dateTime, probability: value },
                { dateTime: dayEntries[j].dateTime, probability: value },
              )
            }

            rainProbPadded.push({
              dateTime: dayEntry.dateTime,
              entries: paddedEntries,
            })
          }
        }

        let tideData = []
        const interpolateHourlyTideHeights = () => {
          const result = []

          const tidesData = data.forecasts.tides

          tidesData.days.forEach((dayData) => {
            const entries = dayData.entries

            const dailyEntries = []

            const sortedHeights = entries
              .map((entry) => entry.height)
              .sort((a, b) => a - b)
            const lowHigh = {
              low: sortedHeights.slice(0, 2),
              high: sortedHeights.slice(-2),
            }

            for (let i = 0; i < entries.length - 1; i++) {
              const entry1 = entries[i]
              const entry2 = entries[i + 1]

              const time1 = new Date(entry1.dateTime)
              const time2 = new Date(entry2.dateTime)

              const tideHeight1 = entry1.height
              const tideHeight2 = entry2.height

              let currentTime = new Date(time1)
              currentTime.setMinutes(0)

              while (currentTime < time2) {
                const interpolatedHeight = linearInterpolation(
                  time1,
                  tideHeight1,
                  time2,
                  tideHeight2,
                  currentTime,
                )
                const tideType = getTideType(interpolatedHeight, tideHeight2)
                const percentage = calculatePercentage(
                  interpolatedHeight,
                  lowHigh.low,
                  lowHigh.high,
                )

                dailyEntries.push({
                  time: currentTime.getHours(),
                  minutes: currentTime.getMinutes(),
                  height: Math.round(interpolatedHeight * 100) / 100,
                  tideType,
                  percentage,
                })
                currentTime.setHours(currentTime.getHours() + 1)
              }
            }

            const interpolatedEntries = removeDuplicateEntries(dailyEntries)

            result.push({
              day: formatDay(dayData.dateTime),
              entries: interpolatedEntries,
            })
          })

          tideData = result
        }

        const linearInterpolation = (t1, h1, t2, h2, targetTime) => {
          const timeDiff = (targetTime - t1) / (t2 - t1)
          return h1 + (h2 - h1) * timeDiff
        }

        const getTideType = (height, nextHeight) => {
          if (height < nextHeight) {
            return 'rising'
          } else {
            return 'falling'
          }
        }

        const calculatePercentage = (height, lowValues, highValues) => {
          const lowValue = Math.min(...lowValues)
          const highValue = Math.max(...highValues)
          let percentage = ((height - lowValue) / (highValue - lowValue)) * 100
          percentage = Math.max(0, Math.min(100, percentage))
          percentage = Math.round(percentage * 10) / 10

          return percentage
        }

        const removeDuplicateEntries = (entries) => {
          const uniqueEntries = []
          const seenTimes = new Set()

          entries.forEach((entry) => {
            const key = `${entry.time}:${entry.minutes}`

            if (!seenTimes.has(key)) {
              uniqueEntries.push(entry)
              seenTimes.add(key)
            }
          })

          return uniqueEntries
        }

        const formatDay = (dateString) => {
          const options = { weekday: 'long', month: 'long', day: 'numeric' }
          const date = new Date(dateString)
          return date.toLocaleDateString('en-US', options)
        }

        if (data && data.forecasts) {
          interpolateHourlyTideHeights()
          setState((prevState) => ({
            ...prevState,
            data: data,
            isLoading: false,
            rainProb: rainProbPadded,
            tidesPadded: tideData,
          }))
        } else {
          console.error('Error: Weather data or forecasts are missing.')
        }
      })
      .catch((error) => console.error(error))
  }

  if (
    state.isLoading ||
    !state.data ||
    !state.data.forecasts ||
    state.solunarArray.length < 7
  ) {
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
          />
          <Route
            path="/wind"
            element={
              <PageMap state={state} setState={setState} embedded={false} />
            }
          />
          <Route
            path="/embedded/home"
            element={
              <PageHome state={state} setState={setState} embedded={true} />
            }
          />
          <Route
            path="/embedded/wind"
            element={
              <PageMap state={state} setState={setState} embedded={true} />
            }
          />
          <Route
            path="/hourly"
            element={
              <PageHourly state={state} setState={setState} embedded={false} />
            }
          />
          <Route
            path="/tides"
            element={
              <TidePage state={state} setState={setState} embedded={false} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
