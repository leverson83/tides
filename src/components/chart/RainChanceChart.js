import './Charts.css'
import React from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import moment from 'moment'
import { CategoryScale, LinearScale } from 'chart.js'

const RainChanceChart = (props) => {
  let rainArray = []
  let timesArray = []

  // Add safety checks for data
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) {
    return (
      <div className="chartWrapper">
        <p className="chartTitle">Rain Chance</p>
        <p>No rain data available</p>
      </div>
    )
  }

  const transformedArray = props.data.flatMap((entry) => {
    const dateTime = moment(entry.dateTime)
    return Array.from({ length: 3 }, (_, index) => {
      const incrementedDateTime = dateTime.clone().add(index, 'hours')
      return {
        dateTime: incrementedDateTime.format('YYYY-MM-DD HH:mm:ss'),
        probability: entry.probability,
      }
    })
  })

  const uniqueTransformedArray = Array.from(
    new Set(transformedArray.map((entry) => entry.dateTime)),
    (dateTime) => transformedArray.find((entry) => entry.dateTime === dateTime),
  )

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
          context.dataset.data[context.dataIndex] > 15
            ? 'red'
            : 'rgb(75, 192, 192)',
        borderColor: (context) =>
          context.dataset.data[context.dataIndex] > 15
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
