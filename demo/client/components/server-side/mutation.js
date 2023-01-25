import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mutation = () => {
  const [queryString, setQueryString] = useState('');
  const [previewString, setPreviewString] = useState('');
  const [previewResult, setPreviewResult] = useState('PENDING PREVIEW');
  const [queryResult, setQueryResult] = useState('PENDING MUTATION');
  const [_id, set_id] = useState('ID');
  const [property, setProperty] = useState('PROPERTY');
  const [input, setInput] = useState('INPUT');

  useEffect(() => {
    const mutationString = `mutation { updatePerson (${_id}, ${property}:"${input}"){ _id, name, mass, hair_color}}`;
    const pString = `{person (${_id}){_id, name, mass, hair_color}}`;
    setPreviewString(pString);
    setQueryString(mutationString);
  }, [_id, property, input]);

  const setMutation = async () => {
    console.log('queryString', queryString);
    const previewData = await axios({
      url: 'http://qeraunos.com/graphql',
      method: 'post',
      data: {
        query: previewString,
      },
    })
      .then(function (response) {
        console.log('RESPONSE', response);
        setPreviewResult(
          JSON.stringify(response.data.graphql.data.person, null, 2)
        );
        console.log('PREVIEW RESULTS: ', previewResult);

        return previewResult;
      })
      .catch(function (error) {
        console.log(error);
      });

    const mutateData = await axios({
      url: 'http://qeraunos.com/graphql',
      method: 'post',
      data: {
        query: queryString,
      },
    })
      .then(function (response) {
        console.log('RESPONSE', response);
        setQueryResult(
          JSON.stringify(response.data.graphql.data.updatePerson, null, 2)
        );
        console.log('MUTATION RESULTS: ', queryResult);

        return queryResult;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <p>Mutations</p>
      <div className="queryVisualizer">
        <pre>{queryString}</pre>
      </div>
      <div className="dropdown-op">
        <div className="dropdown">
          <select
            name="name"
            id="name"
            onChange={(e) => set_id(e.target.value)}
          >
            <option value="" disabled selected>
              Select a name
            </option>
            <option value="id: 89">TEST89</option>
            <option value="id: 1">Luke Skywalker</option>
            <option value="id: 2">C-3PO</option>
            <option value="id: 3">R2-D2</option>
          </select>
        </div>
        <div className="dropdown">
          <select
            name="edit"
            id="edit"
            onChange={(e) => setProperty(e.target.value)}
          >
            <option value="" disabled selected>
              Property to Mutate
            </option>
            <option value="name">Name</option>
            <option value="mass">Mass</option>
            <option value="hair_color">Hair Color</option>
          </select>
        </div>
        <div className="dropdown">
          <input
            type="text"
            id="input"
            name="input"
            placeholder="Input Change"
            onChange={(e) => setInput(e.target.value)}
          ></input>
        </div>
      </div>

      <button
        id="cb-button"
        onClick={(e) => {
          setMutation();
        }}
      >
        Run Mutation
      </button>

      <div className="mutation-container">
        <p>Before Mutation:</p>
        <pre className="nameResult">{previewResult}</pre>
      </div>
      <div>
        <p>After Mutation:</p>
        <pre className="nameResult">{queryResult}</pre>
      </div>
    </div>
  );
};

export default Mutation;
