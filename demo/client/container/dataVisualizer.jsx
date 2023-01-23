import React from 'react';

import '../stylesheets/styles.scss';

import LineChart from '../components/chart';
import Results from '../components/results';
import Metrics from '../components/metrics';

const DataVisualizer = () => {
  return (
    <div className='dataVisualizer'>
      <LineChart />
      <Results />
      <Metrics />
    </div>
  );
};

export default DataVisualizer;
