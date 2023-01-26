import React from 'react';
import SidebarClient from '../container/SidebarClient';
import DataVisualizer2 from '../container/DataVisualizerClient';

function DemoClient() {
  return (
    <div className='main-display'>
      <div className='demo-header'>
        <h1> Demo client side caching</h1>
      </div>
      <div className='main'>
        <SidebarClient />
        <DataVisualizer2 />
      </div>
    </div>
  );
}

export default DemoClient;
