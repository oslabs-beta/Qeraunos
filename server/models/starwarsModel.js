var Pool = require('pg').Pool;
require('dotenv').config();
// create a new pool here using the connection string above
var pool = new Pool({
    connectionString: process.env.PG_URI
});
module.exports = {
    query: function (text, params, callback) {
        console.log('executed query', text);
        return pool.query(text, params, callback);
    }
};
