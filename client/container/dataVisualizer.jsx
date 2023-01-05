import React from 'react';

import '../stylesheets/styles.scss';

import LineChart from '../components/chart';

const DataVisualizer = () => {
  return (
    <div className='dataVisualizer'>
      <LineChart />
    </div>
  );
};

export default DataVisualizer;
