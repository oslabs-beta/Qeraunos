const express = require('express');
import { Request, Response, NextFunction } from 'express';
const path = require('path');
const schema = require('./schema/schema');
//made custom reset qeraunos so that our server would reset every hour for demo purposes. 
const Qeraunos = require('./qeraunos.js');
const app = express();
const PORT = 3000;
require('dotenv').config();
const expressGraphQL = require('express-graphql').graphqlHTTP;

type ServerError = {
  log: string;
  status?: number;
  message: { [err: string]: string };
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../client')));

//pass in graphQL schema (mandatory) as well as Redis acct info (optional if you want to use Redis)
// const qeraunos = new Qeraunos(schema, '127.0.0.1', '6379');
let qeraunos = new Qeraunos(schema);
qeraunos.setSize(100);

// setInterval(() => {
//   qeraunos = new Qeraunos(schema); 
//   qeraunos.setSize(100)
//   console.log("this is hitting every 10 seconds")
//   console.log('This is new qeraunos instance', qeraunos.qeraunosCache)
// }, 10*1000)

app.use('/graphql', qeraunos.query, (req: Request, res: Response) => {
  return res.status(200).send(res.locals);
});

app.use(
  '/graphql-front',
  //Queranos.checkCache --> if found return res.status(200).send(res.data)
  //if not found --> explicitly call from DB and cache from there
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

// // deletes cache and spins up a new instance
// app.use('/clearCache', qeraunos.query, (req: Request, res: Response) => {

// });

// 404 error handler
app.use((req: Request, res: Response) => {
  console.error('Server.js 404');
  return res.sendStatus(404);
});

//Global error handler
app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj: ServerError = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
