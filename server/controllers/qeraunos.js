const LfuCache = require('../../caching/LFU-caching2');
// const schema = require('../schema/schema');
const { parse, visit, print, graphql } = require('graphql');
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
  const AST = parse(body);
  console.log('===================TOP OF AST============', AST);
  const parsed = parse(body).definitions[0];
  // const visitor = (node, level, curr = 0) => {
  //   if (level === curr) return;
  //   console.log(`LEVEL ${curr} NODE:`, print(node));
  //   console.log('CURRENT NODE', node);
  //   console.log('NEXT NODE', node.selectionSet);

  //   return visitor(node.selectionSet, level, ++curr);
  // };

  console.log('===========PRINTED AST==========', print(parsed.selectionSet));
  console.log('============PARSE==========', parsed);
  const operation = parsed.operation;
  // this will remove spaces and reference to mutation in body str
  body = body.replace(/query|mutation|\s/g, '');
  //this will clean up the body so that only the id is in the arg
  if (operation === 'mutation') {
    const id = body.split('(')[1].split(',')[0];
    body = [body.split('(')[0], `(${id})`, body.split(')')[1]].join('');
  }

  // console.log('PARSED: ', parsed);
  // grabs the field that the query is using. e.g people
  const field = parsed.selectionSet.selections[0].name.value; // string
  // console.log('FIELD: ', field);
  // finds the correct type based on the field type pair
  console.log('FIELD', fieldToType[field]);
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
  for (const field in fieldToType) {
    if (body.includes(field)) {
      body = body.replace(field, type);
    }
  }
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
  return { key, operation };
};

Qeraunos.prototype.query = async function (req, res, next) {
  const { key, operation } = graphqlParser(this.schema, req.body.query);
  console.log('==========KEY==========', key);
  // check if its a mutation, if it is, pass over function to mutation

  try {
    if (operation === 'mutation') {
      console.log(' has mutation, pass over to mutation');
      console.log('in mutation');
      // // need to loop through cache and check any key with type and id
      // split key into its useful strings
      const searchArr = key.split('.');
      // this string holds the type of the graphql query
      const searchType = searchArr[0];
      // this string combines the type and the id to search the cache keys with
      const searchKey = searchArr[0] + '.' + searchArr[1];
      // this part of the string holds the actual graph ql query itself
      const graphqlQuery = searchArr[2];
      console.log('==========UPPERCUT==========');
      console.log(newLfu.keys);
      const data = await graphql({
        schema: this.schema,
        source: req.body.query,
      });
      res.locals.graphql = data;
      res.locals.response = 'UNCACHED';

      // loop through cache and check to see if mutated data point is referenced in any of the keys
      // if so, manually update that key with a new graphql query.
      // also check for any multiple types held in brackets and update those as well since they will hold
      // the individual data point in its value
      for (const keys in newLfu.keys) {
        console.log('mutation searchKey: ', searchKey);
        console.log('mutation key in cache: ', key);
        console.log('mutation key: ', key);
        if (keys.includes(searchKey) || keys.includes(`[${searchType}]`)) {
          console.log('==========HIT==========');
          console.log('searchkey: ', searchKey);
          console.log('searchType: ', `[${searchType}]`);
          const updatedData = await graphql({
            schema: this.schema,
            source: graphqlQuery,
          });
          newLfu.set(keys, updatedData);
        }
      }
      // set new mutation in cache
      // do we need to do this?
      console.log('============DATA===========', data);
      newLfu.set(key, data);
      console.log('NEW CACHE OBJ IN MUTATION', newLfu.keys);
      return next();
    } else {
      console.log('In query');
      // check whether key exists in cache, if so return value from cache.
      // if not, send a graphQL query
      if (newLfu.keys[key]) {
        res.locals.graphql = newLfu.get(key);
        res.locals.response = 'Cached';
        console.log('OLD CACHE OBJ IN QUERY', newLfu.keys[key].value.data);
        return next();
      } else {
        const data = await graphql({
          schema: this.schema,
          source: req.body.query,
        });
        res.locals.graphql = data;
        res.locals.response = 'Uncached';
        newLfu.set(key, data);
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

module.exports = { Qeraunos };
