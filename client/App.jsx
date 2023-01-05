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
import DataVisualizer from './container/DataVisualizer.jsx';
import whiteLogo from './resources/logo-white.png';
import blueLogo from './resources/logo-blue.png';

const App = () => {
  return (
    <RecoilRoot>
      <div>
        <img src={whiteLogo} alt="Qeraunos Logo" className="logo" />
      </div>
      <div className="main-display">
        <Sidebar />
        <DataVisualizer />
      </div>
    </RecoilRoot>
  );
};

export default App;
