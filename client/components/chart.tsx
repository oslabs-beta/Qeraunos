import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useResponseTime } from '../useResponseTimeState';

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
    bodyColor?: String;
  }[];
};

function LineChart(): JSX.Element {
  const labels: string[] = [];
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

  const chartResData: ChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Response Time',
        data: responseTime,
        backgroundColor: 'rgba(255, 255, 255)',
        borderColor: 'rgb(75, 48, 232)',
        borderWidth: 1,
        bodyColor: 'rgb(75, 48, 232)',
      },
    ],
  };
  return <Line data={chartResData} width={600} height={200} />;
}

export default LineChart;
