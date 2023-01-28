import React from 'react';
import Checkbox2 from '../components/client-side/checkbox2';
import '../stylesheets/styles.scss';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <h1>Starwars API</h1>
      <Checkbox2 />
    </div>
  );
};

export default Sidebar;
