const path = require('path');
const express = require('express');
import { Request, Response, NextFunction, RequestHandler } from 'express';
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const LfuCache = require('../caching/LFU-caching2');
const { Qeraunos } = require('./controllers/qeraunos');

type ServerError = {
  log: string;
  status?: number;
  message: {
    err: string;
  };
};

const app = express();
const PORT = 3000;
require('dotenv').config();

const qeraunos = new Qeraunos(schema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/graphql', qeraunos.query, (req: Request, res: Response) => {
  return res.status(200).send(res.locals.graphql);
});

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
