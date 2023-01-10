const LfuCache = require('../../caching/LFU-caching2');
// const schema = require('../schema/schema');
const { graphql } = require('graphql');

// builds qeraunos middleware
function Qeraunos(schema) {
  this.schema = schema;
  this.query = this.query.bind(this);
}

//THIS IS HARDCODED --> DO WE WANT TO GIVE USER THE OPTION TO SET CAPACITY?
const newLfu = new LfuCache(3);

Qeraunos.prototype.query = async function (req, res, next) {
  if (!req.body.query) {
    return next();
  }
  try {
    // create unique id key from query string
    const key = keyConverter(req.body.query);
    // check whether key exists in cache, if so return value from cache.
    // if not, send a graphQL query
    if (newLfu.keys[key]) {
      // console.log('newLfu.keys[key]: ', newLfu.keys[key]);
      // console.log('in cache');
      res.locals.graphql = newLfu.get(key);
      res.locals.response = 'Cached';
      // console.log('THIS.KEYS: ', newLfu.keys);
      return next();
    } else {
      const data = await graphql({
        schema: this.schema,
        source: req.body.query,
      });
      res.locals.graphql = data;
      res.locals.response = 'Uncached';
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

Qeraunos.prototype.mutation = async function (req, res, next) {
  if (!req.body.mutation) return next();
  const key = keyConverter(req.body.mutation);
  const data = await graphql({
    schema: this.schema,
    source: req.body.mutation,
  });
  res.locals.graphql = data;
  res.locals.response = 'Uncached';
  newLfu.set(key, data);
  return next();
};

// converts query from client into a unique key by removing extraneous symbols into a single string
const keyConverter = (query) => {
  return JSON.stringify(query).replace(/[\{\},\s_]/g, '');
};

module.exports = { Qeraunos };
