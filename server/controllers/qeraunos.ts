import { Request, Response, NextFunction } from 'express';
const CachingAlgo = require('../../caching/caching-algo');
// const schema = require('../schema/schema');
const { parse, graphql } = require('graphql');
const { query } = require('express');
const redis = require('redis');

// builds qeraunos middleware and binds functions
function Qeraunos(
  schema: any,
  redisHost?: string,
  redisPort?: string,
  redisPwd?: string
) {
  this.schema = schema;
  this.query = this.query.bind(this);
  this.client = redis.createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
    // password: redisPwd,
  });

  this.redisHost = redisHost;
  this.redisPort = redisPort;
  // this.redisPwd = redisPwd;
  this.hasRedis = false;
  (() => {
    // put pwd in conditional as well?
    if (this.redisHost && this.redisPort) {
      this.client.connect().then(() => {
        this.hasRedis = true;
        console.log('Using Redis cache');
      });
    } else {
      console.log('Using standard Qeraunos cache');
    }
  })();
}

const newCache = new CachingAlgo(100);

// // GraphQL Parser to traverse AST and gather all info to create unique key for cache
const graphqlParser = (schema: any, body: string) => {
  // this keeps a dictionary of all the fields in users schema as key and has its corresponding type as a value
  // should return {singular: Type, multiple: [Type]}
  let queryId: string;
  let key: string;
  const fieldToType: { [key: string]: string } = {};

  for (const key in schema._mutationType._fields) {
    fieldToType[key] = schema._mutationType._fields[key].type;
  }
  for (const key in schema._queryType._fields) {
    fieldToType[key] = schema._queryType._fields[key].type;
  }
  // Parse through AST to get Operation type (query or mutation). This will dictate which controller it goes through
  const AST: object = parse(body);
  const parsed: { [key: string]: any } = parse(body).definitions[0];
  const operation: string = parsed.operation;
  // this will remove spaces and reference to mutation in body str
  body = body.replace(/query|mutation|\s/g, '');
  console.log('parser', body);
  //this will clean up the body so that only the id is in the arg
  if (operation === 'mutation') {
    const id: string = body.split('(')[1].split(',')[0];
    // need to refactor this
    body = [body.split('(')[0], `(${id})`, body.split(')')[1]].join('');
  }
  // grabs the field that the query is using. e.g people
  const field: string = parsed.selectionSet.selections[0].name.value; // string
  // finds the correct type based on the field type pair
  const type: string = fieldToType[field].toString();
  // checks if type if there are any arguments. this first one checks for an id if its first
  // if there is an argument of id, then it uses that inside the key along with type and parameters, if not, it just uses type and parameter
  // for (const field in fieldToType) {
  //   if (body.includes(field)) {
  //     body = body.replace(field, type);
  //   }
  // }
  if (!parsed.selectionSet.selections[0].arguments[0]) {
    key = type + '.' + body;
  } else {
    // may need to loop through arguments to find _id or id then grab the value
    // possible that user may not set id and select based on other parameters
    queryId = parsed.selectionSet.selections[0].arguments[0].value.value;
    key = type + '.' + queryId + '.' + body;
  }
  return { key, operation };
};

const keyParser = (key: string) => {
  // split key into its useful strings
  const searchArr: string[] = key.split('.');
  // this string holds the type of the graphql query
  const searchType: string = searchArr[0];
  console.log('searchType', searchType);
  // this string combines the type and the id to search the cache keys with
  const searchKey: string = searchArr[0] + '.' + searchArr[1];
  console.log('searchkey', searchKey);
  // this part of the string holds the actual graph ql query itself
  const graphqlQuery: string = searchArr[searchArr.length - 1];
  console.log('graphqlquery', graphqlQuery);
  return { searchType, searchKey, graphqlQuery };
};

Qeraunos.prototype.query = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { key, operation }: { [key: string]: string } = graphqlParser(
    this.schema,
    req.body.query
  );

  try {
    if (operation === 'mutation') {
      const data: object = await graphql({
        schema: this.schema,
        source: req.body.query,
      });
      res.locals.graphql = data;
      res.locals.response = 'UNCACHED';

      if (this.hasRedis) {
        let { searchType, searchKey } = keyParser(key);
        const dataType = await this.client.scan(0, 'MATCH', `[${searchType}]`);
        const dataKeys = await this.client.scan(0, 'MATCH', `${searchKey}`);
        //combines the two redis queries for single id and multiples into one array
        const totalKeys = dataType.keys.concat(dataKeys.keys);
        console.log('This is data in redis', dataType.keys);
        for (let i = 0; i < totalKeys.length; i++) {
          let { graphqlQuery } = keyParser(totalKeys[i]);
          const updatedData: object = await graphql({
            schema: this.schema,
            source: graphqlQuery,
          });
          this.client.set(`${totalKeys[i]}`, JSON.stringify(updatedData));
        }
        return next();
      }
      // loop through cache and check to see if mutated data point is referenced in any of the keys
      // if so, manually update that key with a new graphql query.
      // also check for any multiple types held in brackets and update those as well since they will hold
      // the individual data point in its value
      const { searchType, searchKey } = keyParser(key);
      for (const keys in newCache.keys) {
        let { graphqlQuery } = keyParser(keys);
        console.log('graphqlQuery before updates', graphqlQuery);
        if (keys.includes(searchKey) || keys.includes(`[${searchType}]`)) {
          const updatedData: object = await graphql({
            schema: this.schema,
            source: graphqlQuery,
          });
          newCache.set(keys, updatedData);
        }
      }
      return next();
      // QUERY CONDITION
    } else {
      if (this.hasRedis) {
        const received = await this.client.get(key);
        if (received) {
          res.locals.graphql = JSON.parse(received);
          res.locals.response = 'Cached';
          return next();
        }
      }
      // check whether key exists in cache, if so return value from cache.
      // if not, send a graphQL query
      if (newCache.keys[key]) {
        res.locals.graphql = newCache.get(key);
        res.locals.response = 'Cached';
        // console.log('OLD CACHE OBJ IN QUERY', newCache.keys[key].value.data);
        return next();
      }
      // send a graphql request if caches were not hit
      const data: any = await graphql({
        schema: this.schema,
        source: req.body.query,
      });
      res.locals.graphql = data;
      res.locals.response = 'Uncached';
      // check if using redis or custom cache and set accordingly
      if (this.hasRedis) {
        console.log('key', key);
        console.log('data', data.data);
        console.log('hit redis cache');
        this.client.set(`${key}`, JSON.stringify(data));
        console.log('set data in redis');
      } else {
        newCache.set(key, data);
      }
      // console.log('NEW CACHE OBJ IN QUERY', newCache.keys);
      return next();
    }
  } catch (err) {
    return next({
      log: 'Express error handler caught unknown middleware error in qeraunos controller',
      message: { err: 'An error occurred in qeraunos controller' },
    });
  }
};

module.exports = { Qeraunos };
