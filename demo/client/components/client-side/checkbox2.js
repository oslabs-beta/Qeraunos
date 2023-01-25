import React, { useEffect, useState } from 'react';
import { useResponseTimesClient } from '../../CustomHooks/useResponseTimeStateClient';
import '../../stylesheets/styles.scss';

import qeraunosClient from '@qeraunos/client';

let qeraunos = new qeraunosClient(100);

const Checkbox = () => {
  const { responseTimesClient, setResponseTimesClient } =
    useResponseTimesClient();
  const [queryString, setQueryString] = useState('');
  const [queryResult, setqueryResult] = useState('');
  const [_id, set_id] = useState(true);
  const [name, setName] = useState(true);
  const [mass, setMass] = useState(true);
  const [hair_color, setHair_color] = useState(true);

  useEffect(() => {
    const string = `{people { ${_id ? '_id' : ''},${name ? ' name' : ''},${
      mass ? ' mass' : ''
    },${hair_color ? ' hair_color' : ''}}}`;
    setQueryString(string);
  }, [_id, name, mass, hair_color]);

  const setTime = async () => {
    const startTime = Date.now();

    //send the query string to qeraunos with endpoint

    const queryTimeObj = await qeraunos
      .query(queryString, 'http://localhost:8080/graphql-front')
      .then(function (response) {
        setqueryResult(JSON.stringify(response, null, 2));

        const obj = {
          ...responseTimesClient[responseTimesClient.length - 1],
          cached: response.response,
          resTime: Date.now() - startTime,
        };
        if (response.response === 'Cached') {
          obj.lastCached = obj.resTime;
        } else {
          obj.lastUncached = obj.resTime;
        }
        return obj;
      })
      .catch(function (error) {
        console.log(error);
      });

    setResponseTimesClient([...responseTimesClient, queryTimeObj]);
  };

  return (
    <div className="checkboxContainer">
      <div className="cb-header">
        <h3>Request to 'People'</h3>
        <p>Select the fields you want to query:</p>
        <div className="checkbox">
          <input
            type="checkbox"
            id="_id"
            name="_id"
            value="_id"
            checked={_id}
            onChange={() => (_id ? set_id(false) : set_id(true))}
          />
          <label htmlFor="_id"> ID</label>
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            id="name"
            name="name"
            value="name"
            checked={name}
            onChange={() => (name ? setName(false) : setName(true))}
          />
          <label htmlFor="name"> Name</label>
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            id="mass"
            name="mass"
            value="mass"
            checked={mass}
            onChange={() => (mass ? setMass(false) : setMass(true))}
          />
          <label htmlFor="mass"> Mass</label>
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            id="hair_color"
            name="hair_color"
            value="hair_color"
            checked={hair_color}
            onChange={() =>
              hair_color ? setHair_color(false) : setHair_color(true)
            }
          />
          <label htmlFor="hair_color"> Hair Color</label>
        </div>
      </div>
      <div>
        <pre>{queryString}</pre>
      </div>
      <button
        id="cb-button"
        onClick={(e) => {
          setTime();
        }}
      >
        Run Query
      </button>
      <div>
        <p>Query Results</p>
        <pre className="queryResult"> {queryResult}</pre>
      </div>
      <button
        id="cb-button"
        onClick={(e) => {
          qeraunos = new qeraunosClient(100);
        }}
      >
        Clear Cache
      </button>
    </div>
  );
};

export default Checkbox;
