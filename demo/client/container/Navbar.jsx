import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ReactComponent as Logo } from '../resources/qeraunos-logo.svg';

function Navbar(props) {
  const { enterSite } = props;
  return (
    <nav className='nav'>
      <div className='nav-logo'>
        <Link to='/' onClick={() => enterSite()}>
          <Logo className='logo' />
        </Link>
      </div>
      <div>
        <ul>
          <li>
            <NavLink
              to='/about'
              value='About'
              style={({ active }) => (active ? active : undefined)}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/demo'
              value='Demo'
              style={({ active }) => (active ? active : undefined)}
            >
              Demo Server
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/demo-client'
              value='DemoClient'
              style={({ active }) => (active ? active : undefined)}
            >
              Demo Client
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/team'
              value='team'
              style={({ active }) => (active ? active : undefined)}
            >
              Team
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
