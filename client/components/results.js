import React, { useState } from 'react';
import { useResponseTime } from '../useResponseTimeState.js';

function Results() {
  const { responseTime } = useResponseTime();
  const uncached = responseTime[responseTime.length - 1].lastUncached;
  const cached = responseTime[responseTime.length - 1].lastCached;

  console.log('responseTime last el: ', responseTime[responseTime.length - 1]);
  console.log('UNCACHED MS ', uncached);
  console.log('CACHED MS ', cached);

  // if (
  //   responseTime[responseTime.length - 1].lastUncached[0] !== 'N/A'
  // ) {
  //   responseTime[responseTime.length - 1].lastUncached[0] = responseTime[responseTime.length - 1].resTime;
  //   // setUncached(responseTime[responseTime.length - 1].resTime);
  // } else if (
  //   responseTime.length > 1 &&
  //   responseTime[responseTime.length - 1].cached === 'Cached'
  // ) {
  //   cached = responseTime[responseTime.length - 1].resTime;
  // }

  // const cached = responseTime.length > 2 ? responseTime[responseTime.length - 1] : 'N/A';

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
