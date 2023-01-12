import React from 'react';

// import whiteLogoSVG from '../resources/Qeraunos-Logo.svg';
// import { ReactComponent as Logo } from '../resources/Qeraunos-Logo.svg';

function Home(props) {
  const { enterSite } = props;

  return (
    <div className="home">
      <div className="home-logo">
        {/* <img src={whiteLogoSVG} alt="Qeraunos Logo" className="logo" /> */}
        {/* <whiteLogoSVG /> */}
        {/* <Logo fill="white" /> */}
        <h1>HOME</h1>
        <button
          onClick={(e) => {
            enterSite();
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

export default Home;
