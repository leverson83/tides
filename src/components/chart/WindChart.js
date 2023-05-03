import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'

const WindChart = (props) => {
  const speedsArray = props.data.slice(5, 24).map((obj) => obj.speed)
  const timesArray = props.data
    .slice(5, 21)
    .map((obj) => obj.dateTime.slice(10, 16))

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
  }

  const data = {
    datasets: [
      {
        label: 'Wind speed',
        data: speedsArray,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  React.useEffect(() => {
    Chart.register(CategoryScale, LinearScale)
  }, [])

  return (
    <div className="chartWrapper">
      <Line data={data} options={options} />
    </div>
  )
}

export default WindChart
