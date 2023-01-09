const LfuCache = require('../../caching/LFU-caching2');
// const schema = require('../schema/schema');
const { graphql } = require('graphql');

function Qeraunos(schema) {
  this.schema = schema;
  this.query = this.query.bind(this);
}

const newLfu = new LfuCache(3);

Qeraunos.prototype.query = async function (req, res, next) {
  try {
    // create unique id key from query string
    const key = keyConverter(req.body.query);
    // check whether key exists in cache, if so return value from cache.
    // if not, send a graphQL query using client query
    if (newLfu.keys[key]) {
      // console.log('newLfu.keys[key]: ', newLfu.keys[key]);
      // console.log('in cache');
      res.locals.graphql = newLfu.get(key);
      // console.log('THIS.KEYS: ', newLfu.keys);
      return next();
    } else {
      console.log('in graphql');
      const data = await graphql({
        schema: this.schema,
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
const keyConverter = (query) => {
  return JSON.stringify(query).replace(/[\{\},\s]/g, '');
};

module.exports = { Qeraunos };
