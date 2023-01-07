"use strict";
exports.__esModule = true;
var React = require("react");
var recoil_1 = require("recoil");
require("./stylesheets/styles.scss");
var Sidebar_1 = require("./container/Sidebar");
var DataVisualizer_1 = require("./container/DataVisualizer");
// import whiteLogo from './resources/logo-white.png';
// import blueLogo from './resources/logo-blue.png';
var App = function () {
    return (<recoil_1.RecoilRoot>
      <div>
        {/* <img src={whiteLogo} alt='Qeraunos Logo' className='logo' /> */}
      </div>
      <div className='main-display'>
        <Sidebar_1["default"] />
        <DataVisualizer_1["default"] />
      </div>
    </recoil_1.RecoilRoot>);
};
exports["default"] = App;
