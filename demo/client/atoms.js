import { atom } from 'recoil';

export const responseTimesState = atom({
  key: 'responseTimesState',
  default: [{ cached: '', resTime: 0, lastUncached: 'N/A', lastCached: 'N/A' }],
});

export const responseTimesStateClient = atom({
  key: 'responseTimesStateClient',
  default: [{ cached: '', resTime: 0, lastUncached: 'N/A', lastCached: 'N/A' }],
});
