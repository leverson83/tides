import './Dashboard.css'
import '../navigation/nav-layout.css'
import HourlyTile from '../tile/HourlyTile'
import React, { useEffect, useState } from 'react'

function Hourly(props) {
  const { state, setState } = props
  let forecasts = state.data.forecasts
  let rainProb =
    forecasts.rainfallprobability?.days[state.marker]?.entries || {}
  let wind = forecasts.wind?.days[state.marker]?.entries || []
  let hourlyRating = state.solunarArray[state.marker].hourlyRating
  const [dailyData, setDailyData] = useState([])

  useEffect(() => {
    const interpolateHourlyTideHeights = () => {
      const result = []

      const tidesData = state.data.forecasts.tides

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

      setDailyData(result)
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

    interpolateHourlyTideHeights()
  }, [state])

  const rainProbPadded = []
  for (let i = 0; i < rainProb.length; i++) {
    const value = rainProb[i]
    rainProbPadded.push(value, value, value)
  }

  return (
    <div>
      <div className="container-fluid hourly">
        <div className="row">
          {wind.map((item, index) => {
            if (index >= 4 && index <= 19) {
              return (
                <HourlyTile
                  key={`hourly-${index}`}
                  direction={item.direction}
                  speed={item.speed}
                  time={item.dateTime}
                  rain={rainProbPadded[index]}
                  index={index}
                  rating={hourlyRating[index]}
                  tides={dailyData[state.marker]?.entries}
                />
              )
            } else {
              return null
            }
          })}
        </div>
      </div>
    </div>
  )
}

export default Hourly
