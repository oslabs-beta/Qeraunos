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

//importing components
import Demo from './pages/Demo';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Team from './pages/Team';
import Navbar from './container/Navbar';
import Installation from './pages/Installation';

// const QeraunosLfuCache = function (capacity) {
//   this.keys = {};
//   this.frequency = {};
//   this.capacity = capacity;
//   this.minFrequency = 0;
//   this.size = 0;
// };

const App = () => {
  const [showNav, setShowNav] = useState(false);
  // localforage.setItem('qeraunos', 'HELLO WORLD');

  //setting our initial empty cache first thing when you log in.
  // const cache = new LfuCache(5);
  // localforage.setItem('LfuCache', cache);
  // // console.log(cache);

  // cache.flow(
  //   '{people { _id name mass hair_color}}',
  //   'http://localhost:8080/graphql'
  // );
  // cache.set(2, 8);
  // cache.set(3, 10000);
  // console.log(`EXPECTING 7========`, cache.get(1));

  const enterSite = () => {
    if (showNav === false) {
      setShowNav(true);
      useNavigate('/demo');
    } else {
      setShowNav(false);
    }
  };

  const showNavBar = () => {
    if (showNav !== false) {
      return <Navbar enterSite={enterSite} />;
    }
  };

  return (
    <RecoilRoot>
      <div>
        {/* <Navbar /> */}

        {showNavBar()}
        <div className='container'>
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  enterSite={enterSite}
                  showNav={showNav}
                  setShowNav={setShowNav}
                />
              }
            />
            <Route path='/demo' element={<Demo />} />
            <Route path='/team' element={<Team />} />
            <Route path='/installation' element={<Installation />} />
          </Routes>
        </div>
      </div>
    </RecoilRoot>
  );
};

export default App;
