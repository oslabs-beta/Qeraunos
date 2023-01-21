'use strict';
exports.__esModule = true;
var express = require('express');
var path = require('path');
var schema = require('./schema/schema');
var Qeraunos = require('./controllers/qeraunos-client').Qeraunos;
var app = express();
var PORT = 3000;
require('dotenv').config();
var qeraunos = new Qeraunos(schema);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/graphql', qeraunos.query, function (req, res) {
  return res.status(200).send(res.locals);
});
// app.use('/graphql', qeraunos.mutations, (req, res) => {
//   return res.status(200).send(res.locals);
// });
// 404 error handler
app.use(function (req, res) {
  console.error('Server.js 404');
  return res.sendStatus(404);
});
//Global error handler
app.use(function (err, req, res, next) {
  var defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  var errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
app.listen(PORT, function () {
  console.log('Server listening on port: '.concat(PORT, '...'));
});
module.exports = app;
