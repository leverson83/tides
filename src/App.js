import './App.css'
import Loader from './components/loader/Loader'
import PageHome from './pages/PageHome'
import PageMap from './pages/PageMap'
import PageHourly from './pages/PageHourly'
import TidePage from './pages/TidePage'
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { API_CONFIG, buildAPIUrl } from './config'

function App() {
  const [state, setState] = useState({
    data: JSON.parse(localStorage.getItem('weather-data')) || null,
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
    const today = new Date()

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
              throw new Error(`Solunar API error: ${response.status} ${response.statusText}`)
            }
            return response.json()
          })
          .then((data) => ({ ...data, date }))
          .catch((error) => {
            console.warn(
              `Solunar API unavailable for date ${date}:`,
              error.message,
            )
            return null
          })
      })

      const solunarArray = await Promise.all(solunarRequests)
      const validSolunarData = solunarArray.filter((data) => data !== null)

      // Update state regardless of Solunar API success/failure
      setState((prevState) => ({
        ...prevState,
        solunarArray: validSolunarData,
        isLoading: false,
      }))

      // Log if Solunar data is completely unavailable
      if (validSolunarData.length === 0) {
        console.warn('Solunar API is currently unavailable. App will continue without solunar data.')
      }
    } catch (error) {
      console.error('Solunar API requests failed:', error)
      // Still update state to stop loading even if Solunar fails
      setState((prevState) => ({
        ...prevState,
        solunarArray: [],
        isLoading: false,
      }))
    }
  }

  useEffect(() => {}, [state.solunarArray])

  const handleRefresh = () => {
    fetchWeatherData()
    fetchSolunarData()
  }

  const fetchWeatherData = () => {
    // Save timestamp
    const timestamp = new Date()
    const formattedTimestamp = timestamp.toLocaleString()
    localStorage.setItem('timestamp', formattedTimestamp)
    
    // Try multiple proxies and direct API call
    const tryAPI = (proxyIndex = 0) => {
      const proxy = API_CONFIG.proxies[proxyIndex]
      const url = buildAPIUrl(proxy)
      
      console.log(`Trying API call ${proxyIndex + 1}/${API_CONFIG.proxies.length}:`, proxy ? `Proxy: ${proxy}` : 'Direct API call')
      console.log('URL:', url)
      
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text().then(text => {
            try {
              return JSON.parse(text)
            } catch (e) {
              throw new Error('Invalid JSON response from proxy')
            }
          })
        })
              .then((data) => {
          if (!data) {
            throw new Error('No data received from API')
          }
          
          if (!data.forecasts) {
            throw new Error('Forecasts property missing from API response')
          }
          
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
            return height < nextHeight ? 'rising' : 'falling'
        }

        const calculatePercentage = (height, lowValues, highValues) => {
            const lowAvg = lowValues.reduce((a, b) => a + b, 0) / lowValues.length
            const highAvg = highValues.reduce((a, b) => a + b, 0) / highValues.length
            const range = highAvg - lowAvg
            return Math.round(((height - lowAvg) / range) * 100)
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
            // Save to localStorage
            localStorage.setItem('weather-data', JSON.stringify(data))
            
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
        .catch((error) => {
          console.error(`API call ${proxyIndex + 1} failed:`, error.message)
          // Try next proxy or fallback
          if (proxyIndex < API_CONFIG.proxies.length - 1) {
            console.log(`Trying next proxy...`)
            tryAPI(proxyIndex + 1)
          } else {
            // All proxies failed, try fallback data
            console.log('All API proxies failed, using fallback data...')
            import('./data/weather-api.json')
              .then((module) => {
                const fallbackData = module.default
                
                if (fallbackData && fallbackData.forecasts) {
                  console.log('Using fallback weather data')
                  setState((prevState) => ({
                    ...prevState,
                    data: fallbackData,
                    isLoading: false,
                    rainProb: [],
                    tidesPadded: [],
                  }))
                } else {
                  console.error('Fallback data is invalid')
                  setState((prevState) => ({
                    ...prevState,
                    isLoading: false,
                  }))
                }
              })
              .catch((importError) => {
                console.error('Failed to load fallback data:', importError)
                setState((prevState) => ({
                  ...prevState,
                  isLoading: false,
                }))
              })
          }
        })
    }
    
    // Start with first proxy
    tryAPI(0)
  }

  if (
    state.isLoading ||
    !state.data ||
    !state.data.forecasts
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
