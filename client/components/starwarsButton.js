import React from 'react';
import { useRecoilState } from 'recoil';
import { useResponseTime } from '../useResponseTimeState.js';
import axios from 'axios';
import '../stylesheets/styles.scss';

const StarwarsButton = () => {
  // const { responseTime, setResponseTime } = useResponseTime();

  // const setTime = async () => {
  //   const startTime = Date.now();

  //   const testQueryTime = await axios({
  //     url: 'http://localhost:8080/graphql',
  //     method: 'post',
  //     data: {
  //       query: `query { people { _id, name, mass, hair_color, skin_color, eye_color, birth_year, gender, species_id, homeworld_id, height } }`,
  //     },
  //   })
  //     .then(function (response) {
  //       console.log('response: ', response);
  //       return Date.now();
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });

  //   console.log(testQueryTime);
  //   const newResponseTime = testQueryTime - startTime;
  //   console.log(newResponseTime);
  //   setResponseTime([...responseTime, newResponseTime]);
  //   console.log(responseTime);
  // };

  return (
    <div>
      <button
        id='btn-main'
        // onClick={(e) => {
        //   setTime();
        // }}
      >
        Starwars API
      </button>
    </div>
  );
};

export default StarwarsButton;
