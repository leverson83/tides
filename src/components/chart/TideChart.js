import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'

const TideChart = (props) => {
  const tidesArray = props.data.map((obj) => obj.height)
  const timesArray = props.data.map((obj) => {
    const dateTime = new Date(obj.dateTime)
    const options = {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    }
    return dateTime.toLocaleTimeString('en-AU', options)
  })

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: timesArray,
      },
      y: {
        beginAtZero: false,
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
