import { atom } from 'recoil';

// interface ResponseTimeStateType {
//   key: string;
//   default?: number[];
// }
// export interface TodoContent {
//   id: string;
//   title: string;
//   description: string;
// }

export const responseTimesState = atom({
  key: 'responseTimesState',
  default: [0],
});
