const LfuCache = require('../../caching/LFU-caching2');
// const schema = require('../schema/schema');
const { graphql } = require('graphql');

// builds qeraunos middleware
function Qeraunos(schema) {
  this.schema = schema;
  this.query = this.query.bind(this);
  this.mutation = this.mutation.bind(this);
}

//THIS IS HARDCODED --> DO WE WANT TO GIVE USER THE OPTION TO SET CAPACITY?
const newLfu = new LfuCache(3);

Qeraunos.prototype.query = async function (req, res, next) {
  // console.log('schema', this.schema);
  // console.log('req', req.body);
  if (req.body.query.includes('mutation')) {
    console.log('in query method, has mutation');
    return next();
  }
  try {
    console.log('This is query');
    console.log('this is req.body.query', req.body.query);
    // create unique id key from query string
    const key = JSON.stringify(req.body.query);
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
  if (!req.body.query.includes('mutation')) {
    console.log('in mutation method, does not have mutation');
    return next();
  }
  const key = JSON.stringify(req.body.query);
  console.log(req.body.query);
  console.log('mutation key', key);
  const data = await graphql({
    schema: this.schema,
    source: req.body.query,
  });
  res.locals.graphql = data;
  res.locals.response = 'UNCACHED';

  // slices key from mutation to extract keyword to lookup related keys in cache
  // keyword = key.split('{')[1];
  // loops through cache for any keys that have keyword from mutation
  // for (const keys in newLfu.keys) {
  //   if (keys.includes(keyword)) {
  //     await graphql({
  //       schema: this.schema,
  //       source: keys,
  //     });
  //   }
  // }
  // newLfu.set(key, data);
  return next();
};

// converts query from client into a unique key by removing extraneous symbols into a single string
// const keyConverter = (query) => {
//   return JSON.stringify(query).replace(/[\{\},\s_]/g, '');
// };

module.exports = { Qeraunos };
