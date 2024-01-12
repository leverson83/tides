import React, { useEffect, useState } from 'react'

const TidePage = ({ state }) => {
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
      console.log(result)
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

  return (
    <div>
      <h2>Tide Page</h2>
      {dailyData.map((dayData) => (
        <div key={dayData.day} style={{ color: 'white', marginBottom: '20px' }}>
          <h3>{dayData.day}</h3>
          <ul>
            {dayData.entries.map((entry) => (
              <li
                key={`${dayData.day}-${entry.time}`}
                style={{ color: 'white', marginBottom: '8px' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    backgroundColor: tideTypeColors[entry.tideType],
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                >
                  {tideIndicators[entry.tideType]}
                </span>
                {entry.time}:{' '}
                {entry.percentage !== undefined && `[${entry.percentage}%] `}
                {entry.height} meters ({entry.tideType})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Define colors for each tide type
const tideTypeColors = {
  rising: 'green',
  falling: 'red',
}

// Define icons for each tide type
const tideIndicators = {
  rising: 'keyboard_double_arrow_up',
  falling: 'keyboard_double_arrow_down',
}

export default TidePage
