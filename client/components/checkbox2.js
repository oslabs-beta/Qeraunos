import React, { useEffect, useState } from 'react';
import { useResponseTime } from '../useResponseTimeState.js';
import axios from 'axios';
import '../stylesheets/styles.scss';

//instructions to run client qeraunos caching.
import localforage from 'localforage';

const Checkbox = () => {
  const { responseTime, setResponseTime } = useResponseTime();
  const [queryString, setQueryString] = useState('');
  const [queryResult, setqueryResult] = useState('');
  const [_id, set_id] = useState(true);
  const [name, setName] = useState(true);
  const [mass, setMass] = useState(true);
  const [hair_color, setHair_color] = useState(true);

  useEffect(() => {
    const string = `{people { ${_id ? '_id' : ''}${name ? ' name' : ''}${
      mass ? ' mass' : ''
    }${hair_color ? ' hair_color' : ''}}}`;
    setQueryString(string);
  }, [_id, name, mass, hair_color]);

  const setTime = async () => {
    console.log(queryString);
    const startTime = Date.now();

    //send the query string to qeraunos
    //it will clean the string creating a key
    //it will then check to see if that key exists
    //if it exists send response back
    //if not send to front end to invoke axios
    //in front end
    //it will send query to axios
    //when we get the response back we send that response to qeraunos to set in cache.
    //in qeraunos we reparse the query to a key
    //store the new node
    //create copy of existing cache
    //set new cache

    const queryTimeObj = await axios({
      url: 'http://localhost:8080/graphql',
      method: 'post',
      data: {
        query: queryString,
      },
    })
      .then(function (response) {
        console.log('RESPONSE', response);
        setqueryResult(
          JSON.stringify(response.data.graphql.data.people, null, 2)
        );

        const obj = {
          ...responseTime[responseTime.length - 1],
          cached: response.data.response,
          resTime: Date.now() - startTime,
        };
        if (response.data.response === 'Cached') {
          obj.lastCached = obj.resTime;
        } else {
          obj.lastUncached = obj.resTime;
        }
        return obj;
      })
      .catch(function (error) {
        console.log(error);
      });

    // console.log(testQueryTime);
    // const newResponseTime = testQueryTime - startTime;
    // console.log(newResponseTime);
    setResponseTime([...responseTime, queryTimeObj]);
    // console.log(responseTime);
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
    </div>
  );
};

export default Checkbox;
