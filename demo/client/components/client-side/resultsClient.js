import React, { useState } from 'react';
import { useResponseTimesClient } from '../../CustomHooks/useResponseTimeStateClient';

function ResultsClient() {
  const { responseTimesClient, setResponseTimesClient } =
    useResponseTimesClient();
  const uncached =
    responseTimesClient[responseTimesClient.length - 1].lastUncached;
  const cached = responseTimesClient[responseTimesClient.length - 1].lastCached;

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

export default ResultsClient;
