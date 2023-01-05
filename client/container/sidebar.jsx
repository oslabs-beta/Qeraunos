import React from 'react';
import StarwarsButton from '../components/StarwarsButton';
import '../stylesheets/styles.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <StarwarsButton />
    </div>
  );
};

export default Sidebar;
