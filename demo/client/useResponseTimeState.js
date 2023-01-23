import { useRecoilState } from 'recoil';
import { responseTimesState } from './atoms.js';

export const useResponseTime = () => {
  const [responseTime, setResponseTime] = useRecoilState(responseTimesState);

  return { responseTime, setResponseTime };
};
