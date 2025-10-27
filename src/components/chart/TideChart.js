import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'

const TideChart = (props) => {
  // Add safety checks for data - ensure it's an array
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) {
    return (
      <div className="chartWrapper">
        <p className="chartTitle">Tides</p>
        <p>No tide data available</p>
      </div>
    )
  }

  // Filter data for times between 4 and 19
  const filteredData = props.data.filter(
    (obj) => obj.time >= 4 && obj.time <= 19,
  )

  // Extract relevant information
  const tidesArray = filteredData.map((obj) => obj.height)
  const timesArray = filteredData.map((obj) => {
    const formattedHour = obj.time % 12 || 12
    return `${formattedHour}:00`
  })

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: timesArray,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const data = {
    datasets: [
      {
        label: 'Tide height',
        data: tidesArray,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
      },
    ],
  }

  React.useEffect(() => {
    Chart.register(CategoryScale, LinearScale)
  }, [])

  return (
    <div className="chartWrapper">
      <p className="chartTitle">Tides</p>
      <Line data={data} options={options} />
    </div>
  )
}

export default TideChart
