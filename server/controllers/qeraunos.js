const LfuCache = require('../../caching/LFU-caching2');
// const schema = require('../schema/schema');
const { graphql } = require('graphql');

function Qeraunos(schema) {
  this.schema = schema;
}

Qeraunos.prototype.query = async function (req, res, next) {
  try {
    // create unique id key from query string
    const key = keyConverter(req.body.query);
    console.log('key', key);
    console.log('schema', this.schema);
    // check whether key exists in cache, if so return value from cache.
    // if not, send a graphQL query using client query
    if (LfuCache.get(key)) {
      res.locals.graphql = LfuCache.get(key);
      console.log('reslocals Object', res.locals.graphql);
      return next();
    } else {
      const data = await graphql({
        schema: this.schema,
        source: req.body.query,
      });
      res.locals.graphql = data;
      console.log(data);
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
const keyConverter = (query) => {
  return JSON.stringify(query).replace(/[\{\},\s]/g, '');
};

module.exports = { Qeraunos };
