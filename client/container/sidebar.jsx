import React from 'react';
import StarwarsButton from '../components/StarwarsButton';
import Checkbox from '../components/checkbox';
import Mutation from '../components/mutation';
import '../stylesheets/styles.scss';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <StarwarsButton />
      <Checkbox />
      <Mutation />
    </div>
  );
};

export default Sidebar;
