import * as React from 'react';

import '../stylesheets/styles.scss';

import LineChart from '../components/chart';
import Results from '../components/results';

const DataVisualizer = () => {
  return (
    <div className='dataVisualizer'>
      <LineChart />
      <Results />
    </div>
  );
};

export default DataVisualizer;
