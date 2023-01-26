import React, { useEffect, useState } from 'react';
import { useResponseTime } from '../../CustomHooks/useResponseTimeState';
import { Doughnut } from 'react-chartjs-2';
import '../../stylesheets/styles.scss';

const Metrics = () => {
  const { responseTime } = useResponseTime();
  let count = 0;
  const totalCache = responseTime.length - 1;
  responseTime.forEach((obj) => {
    if (obj.cached === 'Cached') {
      count++;
    }
  });
  const cacheMiss = totalCache - count;
  const hitRate = Math.floor((count / totalCache) * 100);

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // creates data for doughnut for chartjs
  const doughnutData = {
    labels: ['Cache Hit', 'Cache Miss'],
    datasets: [
      {
        label: 'Cache Hit Rate',
        data: [count, cacheMiss],
        backgroundColor: ['rgba(8,175,100)', 'rgba(204, 41, 54)'],
        hoverOffset: 4,
        circumference: 180,
        rotation: -90,
        cutout: '85%',
      },
    ],
  };

  return (
    <div className='wrap-container'>
      <h2>Hit/Miss Rate Chart</h2>
      <div>
        <Doughnut className='doughnut' data={doughnutData} options={options} />
      </div>
    </div>
  );
};

export default Metrics;
