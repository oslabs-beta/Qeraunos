"use strict";
exports.__esModule = true;
exports.useResponseTime = void 0;
var recoil_1 = require("recoil");
var atoms_1 = require("./atoms");
// interface HookTemplate {
//   responseTime: number[];
//   // [k: string]: number[] | ((state: unknown) => void);
// }
var useResponseTime = function () {
    var _a = (0, recoil_1.useRecoilState)(atoms_1.responseTimesState), responseTime = _a[0], setResponseTime = _a[1];
    return { responseTime: responseTime, setResponseTime: setResponseTime };
};
exports.useResponseTime = useResponseTime;
