import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'
import moment from 'moment'

const WindChart = (props) => {
  // Register Chart.js components - must be called before any early returns
  React.useEffect(() => {
    Chart.register(CategoryScale, LinearScale)
  }, [])

  // Add safety checks for data
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) {
    return (
      <div className="chartWrapper">
        <p className="chartTitle">Wind Speed</p>
        <p>No wind data available</p>
      </div>
    )
  }

  const speedsArray = props.data.slice(5, 24).map((obj) => obj.speed)
  const lineArray = props.data.slice(5, 24).map(() => 15)
  const timesArray = props.data
    .slice(4, 20)
    .map((obj) => moment(obj.dateTime).format('h:mm'))

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
        label: 'Wind speed',
        data: speedsArray,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: (context) =>
          context.dataset.data[context.dataIndex] > 15
            ? 'red'
            : 'rgb(75, 192, 192)',
        borderColor: (context) =>
          context.dataset.data[context.dataIndex] > 15
            ? 'red'
            : 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: '15km',
        data: lineArray,
        fill: false,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: 'rgb(102, 102, 102)',
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="chartWrapper">
      <p className="chartTitle">Wind Speed</p>
      <Line data={data} options={options} />
    </div>
  )
}

export default WindChart
