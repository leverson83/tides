import './BasicChart.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'

const RainChart = (props) => {
  const rainsArray = props.data.map((obj) => obj.probability)
  const timesArray = props.data.map((obj) => obj.dateTime.slice(10, 16))

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
  }

  const data = {
    datasets: [
      {
        label: 'Rain chance',
        data: rainsArray,
        fill: false,
        borderColor: 'rgb(0, 184, 170)',
        tension: 0.2,
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

export default RainChart
