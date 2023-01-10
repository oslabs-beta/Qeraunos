import React from 'react';
import StarwarsButton from '../components/StarwarsButton';
import Checkbox from '../components/checkbox';
import '../stylesheets/styles.scss';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <StarwarsButton />
      <Checkbox />
    </div>
  );
};

export default Sidebar;
