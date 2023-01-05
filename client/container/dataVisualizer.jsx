import React from 'react';

import '../stylesheets/styles.scss';

import LineChart from '../components/chart';
import { useResponseTime } from '../useResponseTimeState.js';

const DataVisualizer = () => {
  const labels = [];
  const { responseTime } = useResponseTime();
  for (let i = 0; i < responseTime.length; i++) {
    if (i > 0) {
      labels.push('Cached');
    } else {
      labels.push('Uncached');
    }
  }

  const chartResData = {
    labels: labels,
    datasets: [
      {
        label: 'Response Time',
        data: responseTime,
      },
    ],
  };

  return (
    <div className='dataVisualizer'>
      <p>data</p>
      <LineChart chartData={chartResData} />
    </div>
  );
};

export default DataVisualizer;
