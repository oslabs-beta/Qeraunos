import React, { useState } from 'react';
import { useResponseTimesClient } from '../../CustomHooks/useResponseTimeStateClient';

function ResultsClient() {
  const { responseTimesClient, setResponseTimesClient } =
    useResponseTimesClient();
  const uncached =
    responseTimesClient[responseTimesClient.length - 1].lastUncached;
  const cached = responseTimesClient[responseTimesClient.length - 1].lastCached;

  let count = 0;
  const totalCache = responseTimesClient.length - 1;
  responseTimesClient.forEach((obj) => {
    if (obj.cached === 'Cached') {
      count++;
    }
  });
  const cacheMiss = totalCache - count;
  const hitRate = Math.floor((count / totalCache) * 100);

  return (
    <div className='wrap-container'>
      <h2>Results</h2>
      {uncached !== 'N/A' && <p>Uncached response: {uncached} ms</p>}
      {uncached === 'N/A' && <p>Uncached response: {uncached}</p>}
      {cached !== 'N/A' && <p>Cached response: {cached} ms</p>}
      {cached === 'N/A' && <p>Cached response: {cached}</p>}
      <h3> Cache Statistics</h3>
      <p>Cache Hits: {`${count}`}</p>
      <p>Cache Miss: {`${cacheMiss}`}</p>
      <p>Hit Rate: {`${hitRate}%`}</p>
    </div>
  );
}

export default ResultsClient;
