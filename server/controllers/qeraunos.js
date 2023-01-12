const LfuCache = require('../../caching/LFU-caching2');
// const schema = require('../schema/schema');
const { parse, visit, graphql } = require('graphql');
const { query } = require('express');

// builds qeraunos middleware and binds functions
function Qeraunos(schema) {
  this.schema = schema;
  this.query = this.query.bind(this);
  // this.mutation = this.mutation.bind(this);
}

const newLfu = new LfuCache(100);

// // GraphQL Parser to traverse AST and gather all info to create unique key for cache
const graphqlParser = (schema, body) => {
  // this keeps a dictionary of all the fields in users schema as key and has its corresponding type as a value
  // should return {singular: Type, multiple: [Type]}
  let queryId;
  let key;
  const fieldToType = {};

  for (const key in schema._mutationType._fields) {
    fieldToType[key] = schema._mutationType._fields[key].type;
  }
  for (const key in schema._queryType._fields) {
    fieldToType[key] = schema._queryType._fields[key].type;
  }
  // Parse through AST to get Operation type (query or mutation). This will dictate which controller it goes through
  const parsed = parse(body).definitions[0];
  // console.log('PARSED: ', parsed);
  // grabs the field that the query is using. e.g people
  const field = parsed.selectionSet.selections[0].name.value; // string
  // console.log('FIELD: ', field);
  // finds the correct type based on the field type pair
  const type = fieldToType[field].toString();
  // console.log('TYPE: ', type);
  // grabs all the parameters in the query search and stores in an array.
  // *** THIS MAY NOT BE NEEDED IF USING BODY AS A UNIQUER ***
  const parametersArr =
    parsed.selectionSet.selections[0].selectionSet.selections;
  // console.log('PARAMETERS ARR: ', parametersArr);
  let parameters = [];
  parametersArr.forEach((elem) => {
    parameters.push(elem.name.value);
  });
  // console.log('PARAMETERS: ', parameters);
  // joins the array into a singular string to use as part of the key
  parameters = parameters.join('');
  // console.log('PARAMETERS STR: ', parameters);
  // checks if type if there are any arguments. this first one checks for an id if its first
  // if there is an argument of id, then it uses that inside the key along with type and parameters, if not, it just uses type and parameter
  if (!parsed.selectionSet.selections[0].arguments[0]) {
    key = type + '.' + body;
  } else {
    // may need to loop through arguments to find _id or id then grab the value
    // possible that user may not set id and select based on other parameters
    queryId = parsed.selectionSet.selections[0].arguments[0].value.value;
    // console.log('QUERYID: ', queryId);
    key = type + '.' + queryId + '.' + body;
  }
  console.log('QUERYKEY: ', key);
  return key;
};

Qeraunos.prototype.query = async function (req, res, next) {
  const keyword = graphqlParser(this.schema, req.body.query);
  const operation = parse(req.body.query).definitions[0].operation;
  // check if its a mutation, if it is, pass over function to mutation

  try {
    if (operation === 'mutation') {
      console.log('in query method, has mutation, pass over to mutation');
      // check if query is a mutation type, if not, move on
      if (operation !== 'mutation') {
        console.log('in mutation method, does not have mutation, move on');
        return next();
      }
      console.log('in mutation');
      // // need to loop through cache and check any key with type and id
      // split keyword into its useful strings
      const searchArr = keyword.split('.');
      // this string holds the type of the graphql query
      const searchType = searchArr[0];
      // this string combines the type and the id to search the cache keys with
      const searchKey = searchArr[0] + '.' + searchArr[1];
      // this part of the string holds the actual graph ql query itself
      const graphqlQuery = searchArr[2];
      // loop through cache and check to see if mutated data point is referenced in any of the keys
      // if so, manually update that key with a new graphql query.
      // also check for any multiple types held in brackets and update those as well since they will hold
      // the individual data point in its value
      console.log('==========UPPERCUT==========');
      console.log(newLfu.keys);
      for (const key in newLfu.keys) {
        console.log('mutation searchKey: ', searchKey);
        console.log('mutation key in cache: ', key);
        console.log('mutation keyword: ', keyword);
        if (key.includes(searchKey) || key.includes(`[${searchType}]`)) {
          console.log('==========HIT==========');
          console.log('searchkey: ', searchKey);
          console.log('searchType: ', `[${searchType}]`);
          await graphql({
            schema: this.schema,
            source: graphqlQuery,
          });
        }
      }
      const data = await graphql({
        schema: this.schema,
        source: req.body.query,
      });
      res.locals.graphql = data;
      res.locals.response = 'UNCACHED';
      // set new mutation in cache
      // do we need to do this?
      newLfu.set(keyword, data);
      console.log('NEW CACHE OBJ IN MUTATION', newLfu.keys);
      return next();
    } else {
      console.log('In query');
      // check whether key exists in cache, if so return value from cache.
      // if not, send a graphQL query
      if (newLfu.keys[keyword]) {
        // console.log('newLfu.keys[key]: ', newLfu.keys[key]);
        // console.log('in cache');
        res.locals.graphql = newLfu.get(keyword);
        res.locals.response = 'Cached';
        console.log('OLD CACHE OBJ IN QUERY', newLfu.keys);
        return next();
      } else {
        const data = await graphql({
          schema: this.schema,
          source: req.body.query,
        });
        res.locals.graphql = data;
        // console.log('data', data);
        res.locals.response = 'Uncached';
        newLfu.set(keyword, data);
        console.log('NEW CACHE OBJ IN QUERY', newLfu.keys);
        return next();
      }
    }
  } catch (err) {
    return next({
      log: 'Express error handler caught unknown middleware error in qeraunos controller',
      message: { err: 'An error occurred in qeraunos controller' },
    });
  }
};

// Qeraunos.prototype.mutation = async function (req, res, next) {

// };

// converts query from client into a unique key by removing extraneous symbols into a single string
// const keyConverter = (query) => {
//   return JSON.stringify(query).replace(/[\{\},\s_]/g, '');
// };

module.exports = { Qeraunos };
