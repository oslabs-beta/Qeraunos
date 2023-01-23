import { atom } from 'recoil';

export const responseTimesState = atom({
  key: 'responseTimesState',
  default: [{ cached: '', resTime: 0, lastUncached: 'N/A', lastCached: 'N/A' }],
});
