import React, { useState } from 'react';
import { useResponseTime } from '../../CustomHooks/useResponseTimeState.js';

function Results() {
  const { responseTime } = useResponseTime();
  const uncached = responseTime[responseTime.length - 1].lastUncached;
  const cached = responseTime[responseTime.length - 1].lastCached;

  //logic for doughnut graph
  let count = 0;
  const totalCache = responseTime.length - 1;
  responseTime.forEach((obj) => {
    if (obj.cached === 'Cached') {
      count++;
    }
  });
  const cacheMiss = totalCache - count;
  const hitRate = Math.floor((count / totalCache) * 100);

  return (
    <div className='wrap-container'>
      <h2>Result Details</h2>
      <h3>Response Time Metrics</h3>
      {uncached !== 'N/A' && <p>Uncached response: {uncached} ms</p>}
      {uncached === 'N/A' && <p>Uncached response: {uncached}</p>}
      {cached !== 'N/A' && <p>Cached response: {cached} ms</p>}
      {cached === 'N/A' && <p>Cached response: {cached}</p>}
      <h3>Cache Statistics</h3>
      <p>Cache Hits: {`${count}`}</p>
      <p>Cache Miss: {`${cacheMiss}`}</p>
      <p>Hit Rate: {`${hitRate}%`}</p>
    </div>
  );
}

export default Results;
