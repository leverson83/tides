import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale, LinearScale } from 'chart.js'
import moment from 'moment'

const SolunarChart = (props) => {
  const data = Object.values(props.data || {}).map((value) => value)
  const timesArray = Object.keys(props.data || {}).map((hour) =>
    moment(hour, 'H').format('HH:mm'),
  )
  const lineArray = new Array(timesArray.length).fill(2)

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

  const chartData = {
    datasets: [
      {
        label: 'Bite chance',
        data: data,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: (context) =>
          context.dataset.data[context.dataIndex] < 20
            ? 'red'
            : 'rgb(75, 192, 192)',
        borderColor: (context) =>
          context.dataset.data[context.dataIndex] < 20
            ? 'red'
            : 'rgb(75, 192, 192)',
        tension: 0.4,
      },
      {
        label: 'Index 2',
        data: lineArray,
        fill: true,
        borderWidth: 1,
        borderDash: [5, 5],
        borderColor: 'rgb(102, 102, 102)',
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  }

  React.useEffect(() => {
    Chart.register(CategoryScale, LinearScale)
  }, [])

  return (
    <div className="chartWrapper">
      <p className="chartTitle">Bite Times</p>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default SolunarChart
