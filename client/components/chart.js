import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useResponseTime } from '../useResponseTimeState.js';

function LineChart() {
  const labels = [];
  const { responseTime } = useResponseTime();
  for (let i = 0; i < responseTime.length; i++) {
    if (i === 0) {
      labels.push('');
    } else if (i === 1) {
      labels.push('Uncached');
    } else {
      labels.push('Cached');
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
  return <Line data={chartResData} />;
}

export default LineChart;
