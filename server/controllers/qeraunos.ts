const LfuCache = require('../../caching/LFU-caching2');
const schema = require('../schema/schema');
const { graphql } = require('graphql');
import { Request, Response, NextFunction, RequestHandler } from 'express';

function Qeraunos(schema: unknown) {
  this.schema = schema;
}

const newLfu = new LfuCache(100);

Qeraunos.prototype.query = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // create unique id key from query string
    const key = keyConverter(req.body.query);
    // check whether key exists in cache, if so return value from cache.
    // if not, send a graphQL query using client query
    if (newLfu.get(key)) {
      console.log('in cache');
      res.locals.graphql = newLfu.get(key);
      return next();
    } else {
      console.log('in graphql');
      const data = await graphql({
        schema,
        source: req.body.query,
      });
      res.locals.graphql = data;
      newLfu.set(key, data);
      return next();
    }
  } catch (err) {
    return next({
      log: 'Express error handler caught unknown middleware error in qeraunos controller',
      message: { err: 'An error occurred in qeraunos controller' },
    });
  }
};

// converts query from client into a unique key by removing extraneous symbols into a single string
const keyConverter = (query: unknown) => {
  return JSON.stringify(query).replace(/[\{\},\s]/g, '');
};

module.exports = { Qeraunos };
