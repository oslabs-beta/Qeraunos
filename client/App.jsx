import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import './stylesheets/styles.scss';
import Sidebar from './container/Sidebar.jsx';
import DataVisualizer from './container/dataVisualizer.jsx';
import whiteLogo from './resources/logo-white.png';

const App = () => {
  return (
    <RecoilRoot>
      <div>
        <img src={whiteLogo} alt="Qeraunos Logo" className="logo" />
      </div>
      <div className="main-display">
        <Sidebar className="sidebar" />
        <DataVisualizer className="dataVisualizer" />
      </div>
    </RecoilRoot>
  );
};

export default App;
