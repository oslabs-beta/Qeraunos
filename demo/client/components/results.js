import React, { useState } from 'react';
import { useResponseTime } from '../useResponseTimeState.js';

function Results() {
  const { responseTime } = useResponseTime();
  const uncached = responseTime[responseTime.length - 1].lastUncached;
  const cached = responseTime[responseTime.length - 1].lastCached;

  return (
    <div>
      <h2>Results</h2>
      {uncached !== 'N/A' && <p>Uncached response: {uncached} ms</p>}
      {uncached === 'N/A' && <p>Uncached response: {uncached}</p>}
      {cached !== 'N/A' && <p>Cached response: {cached} ms</p>}
      {cached === 'N/A' && <p>Cached response: {cached}</p>}
    </div>
  );
}

export default Results;
