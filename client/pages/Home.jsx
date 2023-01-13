import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../resources/qeraunos-logo.svg';

function Home(props) {
  const { showNav, setShowNav } = props;
  let navigate = useNavigate();

  const enterSite = () => {
    if (showNav === false) {
      setShowNav(true);
    }
  };

  return (
    <div className="home">
      <div className="home-inner">
        <Logo />
        <button
          className="home-btn"
          onClick={(e) => {
            enterSite();
            navigate('/demo');
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

export default Home;
