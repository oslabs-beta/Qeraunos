//importing structures
import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

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
  const [showNav, setShowNav] = useState(false);

  let navigate = useNavigate();

  const enterSite = () => {
    if (showNav === false) {
      setShowNav(true);
      useNavigate('/demo');
    }
  };

  const showNavBar = () => {
    if (showNav !== false) {
      return <Navbar />;
    }
  };

  return (
    <RecoilRoot>
      <div>
        {/* <Navbar /> */}

        {showNavBar()}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home enterSite={enterSite} />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/team" element={<Team />} />
            <Route path="/installation" element={<Installation />} />
          </Routes>
        </div>
      </div>
    </RecoilRoot>
  );
};

export default App;
