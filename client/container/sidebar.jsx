import React from 'react';
import StarwarsButton from '../components/StarwarsButton';
import '../stylesheets/styles.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <p>sidebar</p>
      <StarwarsButton />
    </div>
  );
};

export default Sidebar;
