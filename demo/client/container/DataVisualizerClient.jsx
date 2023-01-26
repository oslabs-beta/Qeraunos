import React from 'react';

import '../stylesheets/styles.scss';

import LineChart2 from '../components/client-side/chart2';
import ResultsClient from '../components/client-side/resultsClient';
import MetricsClient from '../components/client-side/metricsClient';

const DataVisualizer2 = () => {
  return (
    <div className="dataVisualizer">
      <div>
        <LineChart2 />
      </div>
      <div className="dataVisualizer-bottom">
        <div className="widget">
          <ResultsClient />
        </div>
        <div className="widget">
          <MetricsClient />
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer2;
