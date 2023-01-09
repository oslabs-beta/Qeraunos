import React, { useEffect, useState } from 'react';
import { useResponseTime } from '../useResponseTimeState.js';
import axios from 'axios';
import '../stylesheets/styles.scss';

const Checkbox = () => {
  const { responseTime, setResponseTime } = useResponseTime();
  const [queryString, setQueryString] = useState('');
  const [people, setPeople] = useState(true);
  const [_id, set_id] = useState(true);
  const [name, setName] = useState(true);
  const [mass, setMass] = useState(true);
  const [hair_color, setHair_color] = useState(true);

  useEffect(() => {
    const string = `{people { ${_id ? '_id' : ''}${name ? ' name' : ''}${
      mass ? ' mass' : ''
    }${hair_color ? ' hair_color' : ''}}}`;
    setQueryString(string);
  }, [people, _id, name, mass, hair_color]);

  const setTime = async () => {
    console.log(queryString);
    const startTime = Date.now();

    const testQueryTime = await axios({
      url: 'http://localhost:8080/graphql',
      method: 'post',
      data: {
        query: queryString,
      },
    })
      .then(function (response) {
        console.log('response: ', response);
        return Date.now();
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log(testQueryTime);
    const newResponseTime = testQueryTime - startTime;
    console.log(newResponseTime);
    setResponseTime([...responseTime, newResponseTime]);
    console.log(responseTime);
  };

  return (
    <div className='checkboxContainer'>
      <div className='cb-header'>
        <input
          type='checkbox'
          id='people'
          name='people'
          value='people'
          checked={people}
          onChange={() => (people ? setPeople(false) : setPeople(true))}
        />
        <label htmlFor='people'> People</label>
        <br />
        <input
          type='checkbox'
          id='_id'
          name='_id'
          value='_id'
          checked={_id}
          onChange={() => (_id ? set_id(false) : set_id(true))}
        />
        <label htmlFor='_id'> ID</label>
        <input
          type='checkbox'
          id='name'
          name='name'
          value='name'
          checked={name}
          onChange={() => (name ? setName(false) : setName(true))}
        />
        <label htmlFor='name'> Name</label>
        <input
          type='checkbox'
          id='mass'
          name='mass'
          value='mass'
          checked={mass}
          onChange={() => (mass ? setMass(false) : setMass(true))}
        />
        <label htmlFor='mass'> Mass</label>
        <input
          type='checkbox'
          id='hair_color'
          name='hair_color'
          value='hair_color'
          checked={hair_color}
          onChange={() =>
            hair_color ? setHair_color(false) : setHair_color(true)
          }
        />
        <label htmlFor='hair_color'> Hair Color</label>
      </div>
      <button
        id='cb-button'
        onClick={(e) => {
          setTime();
        }}
      >
        Run Query
      </button>
    </div>
  );
};

export default Checkbox;
