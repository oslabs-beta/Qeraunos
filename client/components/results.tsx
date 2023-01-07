import * as React from 'react';
import { useResponseTime } from '../useResponseTimeState.js';

function Results(): JSX.Element {
  const { responseTime } = useResponseTime();
  const uncached: string = responseTime[1] ? String(responseTime[1]) : 'N/A';
  const cached: string =
    responseTime.length > 2
      ? String(responseTime[responseTime.length - 1])
      : 'N/A';

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
