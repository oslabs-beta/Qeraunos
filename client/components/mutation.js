import React, { useState } from 'react';

const Mutation = () => {
  const [string, setString] = useState('');
  const [selected, setSelected] = useState('');

  const handleClick = () => {
    console.log(selected);
  };

  return (
    <div>
      <p>Mutations</p>
      <select
        name='name'
        id='name'
        onChange={(e) => {
          setSelected(e.target.value);
        }}
      >
        <option value='' disabled selected>
          Select a name
        </option>
        <option value='Luke Skywalker'>Luke Skywalker</option>
      </select>
      <button
        onClick={() => {
          handleClick;
        }}
      >
        Query
      </button>
      <pre className='nameResult'>Insert Name Here</pre>
    </div>
  );
};

export default Mutation;
