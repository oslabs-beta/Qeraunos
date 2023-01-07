"use strict";
exports.__esModule = true;
exports.responseTimesState = void 0;
var recoil_1 = require("recoil");
// interface ResponseTimeStateType {
//   key: string;
//   default?: number[];
// }
// export interface TodoContent {
//   id: string;
//   title: string;
//   description: string;
// }
exports.responseTimesState = (0, recoil_1.atom)({
    key: 'responseTimesState',
    "default": [0]
});
