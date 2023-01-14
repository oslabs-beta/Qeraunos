import React, { useEffect, useState } from 'react';
import { useResponseTime } from '../useResponseTimeState';
import { Doughnut } from 'react-chartjs-2';
import '../stylesheets/styles.scss';

const Metrics = () => {
  const { responseTime } = useResponseTime();

  useEffect(() => {
    console.log('responseTime length in Metrics', responseTime.length);
  }, [responseTime]);
  let count = 0;
  const totalCache = responseTime.length - 1;
  responseTime.forEach((obj) => {
    if (obj.cached === 'Cached') {
      count++;
    }
  });
  console.log('count', count);
  console.log('totalCache', totalCache);
  console.log('response time', responseTime);
  const cacheMiss = totalCache - count;
  const hitRate = Math.floor((count / totalCache) * 100);
  console.log('This is hitRate:', hitRate);

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
        cutout: '75%',
      },
    ],
  };

  return (
    <div className='metrics-container'>
      <div className='hit-rate'>{hitRate}</div>
      <Doughnut data={doughnutData} width={100} height={100} />
    </div>
  );
};

export default Metrics;
