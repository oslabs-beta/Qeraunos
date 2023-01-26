import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useResponseTimesClient } from '../../CustomHooks/useResponseTimeStateClient.js';

function LineChart2() {
  const labels = [];
  const { responseTimesClient, setResponseTimesClient } =
    useResponseTimesClient();
  for (let i = 0; i < responseTimesClient.length; i++) {
    if (i === 0) {
      labels.push('');
    } else {
      labels.push(responseTimesClient[i].cached);
    }
  }
  const times = responseTimesClient.map((e) => {
    return e.resTime;
  });

  const chartResData = {
    labels: labels,
    datasets: [
      {
        label: 'Response Time',
        data: times,
        backgroundColor: 'rgba(255, 255, 255)',
        borderColor: 'rgb(75, 48, 232)',
        borderWidth: 1,
        bodyColor: 'rgb(75, 48, 232)',
      },
    ],
  };
  return (
    <div className='wrap-container'>
      <h2>Response Time Graph</h2>
      <Line data={chartResData} width={600} height={200} />
    </div>
  );
}

export default LineChart2;
