import React from 'react';
import Sidebar from '../container/Sidebar';
import DataVisualizer from '../container/DataVisualizer';

function Demo() {
  return (
    <div className="main-display">
      <Sidebar />
      <DataVisualizer />
    </div>
  );
}

export default Demo;
