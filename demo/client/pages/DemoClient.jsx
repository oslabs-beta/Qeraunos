import React from 'react';
import SidebarClient from '../container/SidebarClient';
import DataVisualizer2 from '../container/dataVisualizerClient';

function DemoClient() {
  return (
    <div className="main-display">
      <h1> Demo client side caching</h1>
      <div className="main">
        <SidebarClient />
        <DataVisualizer2 />
      </div>
    </div>
  );
}

export default DemoClient;
