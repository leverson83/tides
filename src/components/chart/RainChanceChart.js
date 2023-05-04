import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'

const RainChanceChart = (props) => {
  let UVArray = []
  let timesArray = []

  if (props.data && props.data.length > 0) {
    UVArray = props.data.map((obj) => obj.index)
    timesArray = props.data.map((obj) => {
      const dateTime = new Date(obj.dateTime)
      const options = {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      }
      const timeString = dateTime.toLocaleTimeString('en-AU', options)

      return timeString.replace('am', '').replace('pm', '')
    })
  }

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
        label: 'Rain Chance',
        data: UVArray,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: (context) =>
          context.dataset.data[context.dataIndex] > 2
            ? 'red'
            : 'rgb(75, 192, 192)',
        borderColor: (context) =>
          context.dataset.data[context.dataIndex] > 2
            ? 'red'
            : 'rgb(75, 192, 192)',
        tension: 0.4,
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

export default RainChanceChart
