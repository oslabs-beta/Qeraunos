//importing structure
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

//importing styling and images
import './stylesheets/styles.scss';
import whiteLogo from './resources/logo-white.png';
import blueLogo from './resources/logo-blue.png';

//importing components
import Demo from './pages/Demo';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Team from './pages/Team';
import Navbar from './container/Navbar';
import Installation from './pages/Installation';

const App = () => {
  return (
    <RecoilRoot>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/team" element={<Team />} />
          <Route path="/installation" element={<Installation />} />
        </Routes>
      </div>
    </RecoilRoot>
  );
};

export default App;
