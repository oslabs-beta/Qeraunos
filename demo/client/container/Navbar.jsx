import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ReactComponent as Logo } from '../resources/qeraunos-logo.svg';

function Navbar(props) {
  const { enterSite } = props;
  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/" onClick={() => enterSite()}>
          <Logo className="logo" />
        </Link>
      </div>
      <div>
        <ul>
          <li>
            <NavLink to="/about" activeClassName="active" value="About">
              About
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to="/demo" value="Demo">
              Demo Server
            </NavLink>
          </li>
          <li>
            <NavLink
              activeClassName="active"
              to="/demo-client"
              value="DemoClient"
            >
              Demo Client
            </NavLink>
          </li>
          <li>
            <NavLink to="/team" activeClassName="active" value="team">
              Team
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
