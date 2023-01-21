const express = require('express');
import { Request, Response, NextFunction } from 'express';
const path = require('path');
const schema = require('./schema/schema');
const { Qeraunos } = require('./controllers/qeraunos');
const app = express();
const PORT = 3000;
require('dotenv').config();
const redis = require('redis');
const expressGraphQL = require('express-graphql').graphqlHTTP;

//pass in graphQL schema (mandatory) as well as Redis acct info (optional if you want to use Redis)
// const qeraunos = new Qeraunos(schema, '127.0.0.1', '6379');
const qeraunos = new Qeraunos(schema);

type ServerError = {
  log: string;
  status?: number;
  message: { [err: string]: string };
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../client')));

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
