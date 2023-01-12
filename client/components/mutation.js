import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mutation = () => {
  const [queryString, setQueryString] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [_id, set_id] = useState('ID');
  const [property, setProperty] = useState('PROPERTY');
  const [input, setInput] = useState('INPUT');

  useEffect(() => {
    const string = `{ mutation { person (${_id}, ${property}:"${input}"){ name mass hair_color}}}`;
    setQueryString(string);
  }, [_id, property, input]);

  const setMutation = async () => {
    console.log('queryString', queryString);

    await axios({
      url: 'http://localhost:8080/graphql',
      method: 'post',
      body: {
        query: queryString,
      },
    })
      .then(function (response) {
        console.log('RESPONSE', response);
        setQueryResult(
          JSON.stringify(response.data.graphql.data.people, null, 2)
        );

        return queryResult;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <p>Mutations</p>
      <div>
        <pre>{queryString}</pre>
      </div>
      <select name='name' id='name' onChange={(e) => set_id(e.target.value)}>
        <option value='' disabled selected>
          Select a name
        </option>
        <option value='id:89'>TEST 89</option>
        {/* <option value='id: 1'>Luke Skywalker</option>
        <option value='id: 2'>C-3PO</option>
        <option value='id: 3'>R2-D2</option> */}
      </select>
      <select
        name='edit'
        id='edit'
        onChange={(e) => setProperty(e.target.value)}
      >
        <option value='' disabled selected>
          Property to Mutate
        </option>
        <option value='name'>Name</option>
        <option value='mass'>Mass</option>
        <option value='hair_color'>Hair Color</option>
      </select>
      <input
        type='text'
        id='input'
        name='input'
        onChange={(e) => setInput(e.target.value)}
      ></input>

      <button
        id='cb-button'
        onClick={(e) => {
          setMutation();
        }}
      >
        Run Mutation
      </button>

      <pre className='nameResult'>Insert Name Here</pre>
    </div>
  );
};

export default Mutation;
