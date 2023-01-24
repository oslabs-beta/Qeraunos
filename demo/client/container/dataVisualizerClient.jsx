import React from 'react';

import '../stylesheets/styles.scss';

import LineChart2 from '../components/client-side/chart2';
import ResultsClient from '../components/client-side/resultsClient';
import MetricsClient from '../components/client-side/metricsClient';

const DataVisualizer2 = () => {
  return (
    <div className="dataVisualizer">
      <LineChart2 />
      <ResultsClient />
      <MetricsClient />
    </div>
  );
};

export default DataVisualizer2;
