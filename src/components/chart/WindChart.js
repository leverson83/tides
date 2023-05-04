import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'
import moment from 'moment'

const WindChart = (props) => {
  const speedsArray = props.data.slice(5, 24).map((obj) => obj.speed)
  const timesArray = props.data
    .slice(5, 21)
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
        borderJoinStyle: (context) =>
          context.dataset.data[context.dataIndex] > 15 ? 'round' : 'miter',
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
