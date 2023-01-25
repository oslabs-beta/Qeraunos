import React from 'react';
import Sidebar from '../container/Sidebar';
import DataVisualizer from '../container/dataVisualizerServer';

function Demo() {
  return (
    <div className="main-display">
      <div className="demo-header">
        <h1> Demo Server side caching</h1>
      </div>
      <div className="main">
        <Sidebar />
        <DataVisualizer />
      </div>
    </div>
  );
}

export default Demo;
