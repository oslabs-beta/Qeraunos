import * as React from 'react';
import { useRecoilState } from 'recoil';
import { useResponseTime } from '../useResponseTimeState.js';
import axios from 'axios';
import '../stylesheets/styles.scss';

const StarwarsButton = (): JSX.Element => {
  const { responseTime, setResponseTime } = useResponseTime();

  const setTime = async (): Promise<void> => {
    const startTime: number = Date.now();

    const testQueryTime: number | void = await axios({
      url: 'http://localhost:8080/graphql',
      method: 'post',
      data: {
        query: `query { people { _id, name, mass, hair_color, skin_color, eye_color, birth_year, gender, species_id, homeworld_id, height } }`,
      },
    })
      .then(function (response) {
        console.log('response: ', response);
        return Date.now();
      })
      .catch(function (error) {
        console.log(error);
      });

    let newResponseTime: number;
    if (testQueryTime) {
      newResponseTime = testQueryTime - startTime;
    }
    setResponseTime([...responseTime, newResponseTime]);
  };

  return (
    <div>
      <button
        id='btn-main'
        onClick={(e) => {
          setTime();
        }}
      >
        Starwars API
      </button>
    </div>
  );
};

export default StarwarsButton;
