import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import Sidebar from './container/Sidebar.jsx';
import DataVisualizer from './container/dataVisualizer.jsx';

const App = () => {
  return (
    <RecoilRoot>
      <p>Qeraunos</p>
      <div className="main-display">
        <Sidebar className="sidebar" />
        <DataVisualizer className="dataVisualizer" />
      </div>
    </RecoilRoot>
  );
};

export default App;
