import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import moment from 'moment'
import { CategoryScale, LinearScale } from 'chart.js'

const RainChanceChart = (props) => {
  let rainArray = []
  let timesArray = []
  console.log(props)
  if (props.data && props.data.length > 0) {
    rainArray = props.data.slice(5, 24).map((obj) => obj.probability)
    timesArray = props.data
      .slice(4, 20)
      .map((obj) => moment(obj.dateTime).format('h:mm'))
  }

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
        label: 'Rain Chance',
        data: rainArray,
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
        tension: 0.5,
      },
    ],
  }

  React.useEffect(() => {
    Chart.register(CategoryScale, LinearScale)
  }, [])

  return (
    <div className="chartWrapper">
      <p className="chartTitle">Rain Chance</p>
      <Line data={data} options={options} />
    </div>
  )
}

export default RainChanceChart
