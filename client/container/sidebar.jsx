import React from 'react';
import StarwarsButton from '../components/StarwarsButton';
import Checkbox from '../components/checkbox2';
import Mutation from '../components/mutation';
import '../stylesheets/styles.scss';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <h1>Starwars API</h1>
      <Checkbox />
      <Mutation />
    </div>
  );
};

export default Sidebar;
