const path = require('path');
const express = require('express');
const schema = require('./schema/schema');
const { Qeraunos } = require('./controllers/qeraunos');
const app = express();
const PORT = 3000;
require('dotenv').config();

const qeraunos = new Qeraunos(schema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/graphql', qeraunos.query, (req, res) => {
  return res.status(200).send(res.locals);
});

// app.use('/graphql', qeraunos.mutations, (req, res) => {
//   return res.status(200).send(res.locals);
// });

// 404 error handler
app.use((req, res) => {
  console.error('Server.js 404');
  return res.sendStatus(404);
});

//Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
