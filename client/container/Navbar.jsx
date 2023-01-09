import React from 'react';
import { Link, NavLink, useMatch, useResolvedPath } from 'react-router-dom';
import whiteLogo from '../resources/logo-white.png';

function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link to="/">
          {' '}
          <img src={whiteLogo} alt="Qeraunos Logo" className="logo" />
        </Link>
      </div>
      <div>
        <ul>
          <li>
            <NavLink activeClassName="active" to="/demo" value="Demo">
              Demo
            </NavLink>
          </li>
          <li>
            <NavLink to="/team" activeClassName="active" value="team">
              Team
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/installation"
              activeClassName="active"
              value="installation"
            >
              Installation
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
