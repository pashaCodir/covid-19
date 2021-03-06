import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';

import style from './Chart.module.scss';

const Chart = ({ data: { confirmed, recovered, deaths }, country, dailyData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (dailyData) {
      setData(dailyData);
    }
  }, [dailyData]);

  const lineChart = (
    data.length ?
      <Line
        data={{
          labels: data.map(({ date }) => date),
          datasets: [{
            data: data.map(({ confirmed }) => confirmed),
            label: 'Infected',
            borderColor: '#3333ff',
            fill: true
          }, {
            data: data.map(({ deaths }) => deaths),
            label: 'Deaths',
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            fill: true
          }]
        }}
      /> : null
  );

  const barChart = (
    confirmed ? (
      <Bar
        data={{
          labels: ['Infected', 'Recovered', 'Deaths'],
          datasets: [{
            label: 'People',
            backgroundColor: [
              'rgba(0, 0, 255, .5)',
              'rgba(0, 255, 0, .6)',
              'rgba(255, 0, 0, .9)'
            ],
            data: [confirmed.value, recovered.value, deaths.value]
          }]
        }}
        options={{
          legend: { display: false },
          title: { display: true, text: `Current state in ${country}` }
        }}
      />
    ) : null
  );

  return (
    <div className={style.container}>
      { country ? barChart : lineChart }
    </div>
  )
};

export default Chart;
