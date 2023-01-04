import React from 'react';
import { useRecoilState } from 'recoil';
import { useResponseTime } from '../useResponseTimeState.js';
import axios from 'axios';

const starwarsButton = () => {
  const { responseTime, setResponseTime } = useResponseTime();

  const setTime = async () => {
    const startTime = Date.now();

    const testQueryTime = await axios({
      url: '/graphql',
      method: 'post',
      data: {
        query: `query { people { name } }`,
      },
    })
      .then(function (response) {
        console.log(response);
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
    <div>
      <p>Starwars Button Here</p>
      <button
        onClick={(e) => {
          setTime();
        }}
      >
        Starwars API
      </button>
    </div>
  );
};

export default starwarsButton;