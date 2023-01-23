"use strict";
exports.__esModule = true;
var express = require('express');
var path = require('path');
var schema = require('./schema/schema');
var Qeraunos = require('@qeraunos/server').Qeraunos;
var app = express();
var PORT = 3000;
require('dotenv').config();
var redis = require('redis');
var expressGraphQL = require('express-graphql').graphqlHTTP;
//pass in graphQL schema (mandatory) as well as Redis acct info (optional if you want to use Redis)
// const qeraunos = new Qeraunos(schema, '127.0.0.1', '6379');
var qeraunos = new Qeraunos(schema);
qeraunos.setSize(100);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../client')));
app.use('/graphql', qeraunos.query, function (req, res) {
    return res.status(200).send(res.locals);
});
app.use('/graphql-front', 
//Queranos.checkCache --> if found return res.status(200).send(res.data)
//if not found --> explicitly call from DB and cache from there
expressGraphQL({
    schema: schema,
    graphiql: true
}));
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
        message: { err: 'An error occurred' }
    };
    var errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});
app.listen(PORT, function () {
    console.log("Server listening on port: ".concat(PORT, "..."));
});
module.exports = app;
