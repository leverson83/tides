import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'
import moment from 'moment'

const UVChart = (props) => {
  let UVArray = []
  let timesArray = []

  if (props.data && props.data.length > 0) {
    UVArray = props.data.map((obj) => obj.index)
    timesArray = props.data.map((obj) => {
      const dateTime = moment(obj.dateTime)
      return dateTime.format('h:mm')
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
        label: 'UV Index',
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

export default UVChart
