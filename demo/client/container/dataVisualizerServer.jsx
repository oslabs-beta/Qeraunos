import React from 'react';

import '../stylesheets/styles.scss';

// import LineChart from '../components/server-side/server-side/chart';
import LineChart from '../components/server-side/chart';
import Results from '../components/server-side/results';
import Metrics from '../components/server-side/metrics';

const DataVisualizer = () => {
  return (
    <div className="dataVisualizer">
      <LineChart />
      <Results />
      <Metrics />
    </div>
  );
};

export default DataVisualizer;
