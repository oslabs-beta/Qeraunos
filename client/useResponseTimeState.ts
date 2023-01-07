import { useRecoilState } from 'recoil';
import { responseTimesState } from './atoms';

// interface HookTemplate {
//   responseTime: number[];
//   // [k: string]: number[] | ((state: unknown) => void);
// }

export const useResponseTime = () => {
  const [responseTime, setResponseTime] = useRecoilState(responseTimesState);

  return { responseTime, setResponseTime };
};
