import React from 'react';
import sidebar from './container/sidebar.jsx';
import dataVisualizer from './container/dataVisualizer.jsx';

const App = () => {
  return (
    <div>
      <p>Qeraunos</p>
      <div className='main-display'>
        <sidebar className='sidebar' />
        <dataVisualizer className='dataVisualizer' />
      </div>
    </div>
  );
};

export default App;
