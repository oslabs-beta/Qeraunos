import React from 'react';
import { useResponseTime } from '../useResponseTimeState.js';

function Results() {
  const { responseTime } = useResponseTime();
  const uncached = responseTime[1] ? responseTime[1] : 'N/A';
  const cached =
    responseTime.length > 2 ? responseTime[responseTime.length - 1] : 'N/A';

  return (
    <div>
      <h2>Results</h2>
      {uncached !== 'N/A' && <p>Uncached response: {uncached} ms</p>}
      {uncached == 'N/A' && <p>Uncached response: {uncached}</p>}
      {cached !== 'N/A' && <p>Cached response: {cached} ms</p>}
      {cached == 'N/A' && <p>Cached response: {cached}</p>}
    </div>
  );
}

export default Results;
