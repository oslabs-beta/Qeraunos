const { Pool } = require('pg');
// create a new pool here using the connection string above
const pool = new Pool({
  connectionString:
    'postgres://hfupnoff:aVwC3zy9Ue2kTYAKAFJAzH9T1wt-6kWU@heffalump.db.elephantsql.com/hfupnoff',
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
