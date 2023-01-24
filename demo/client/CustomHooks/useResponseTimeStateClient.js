import { useRecoilState } from 'recoil';
import { responseTimesStateClient } from '../atoms.js';

export const useResponseTimesClient = () => {
  const [responseTimesClient, setResponseTimesClient] = useRecoilState(
    responseTimesStateClient
  );

  return { responseTimesClient, setResponseTimesClient };
};
