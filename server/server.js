const path = require('path');
const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const app = express();
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const PORT = 3000;

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType(),
// });

// app.use(
//   '/graphql',
//   expressGraphQL({
//     schema,
//     graphiql: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.resolve(__dirname)));

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
