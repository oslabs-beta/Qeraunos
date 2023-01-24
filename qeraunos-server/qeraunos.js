'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
var QeraunosCache = require('../src/qeraunos-server');
var _a = require('graphql'),
  parse = _a.parse,
  graphql = _a.graphql;
var redis = require('redis');
// builds qeraunos middleware and binds functions
function Qeraunos(schema, redisHost, redisPort, redisPwd) {
  var _this = this;
  this.schema = schema;
  this.query = this.query.bind(this);
  this.client = redis.createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
    password: redisPwd,
  });
  this.redisHost = redisHost;
  this.redisPort = redisPort;
  this.redisPwd = redisPwd;
  this.hasRedis = false;
  (function () {
    if (_this.redisHost && _this.redisPort) {
      _this.client.connect().then(function () {
        _this.hasRedis = true;
      });
    }
  })();
}
Qeraunos.prototype.setSize = function (capacity) {
  if (capacity === void 0) {
    capacity = 1000;
  }
  this.qeraunosCache = new QeraunosCache(capacity);
};
// // GraphQL Parser to traverse AST and gather all info to create unique key for cache
var graphqlParser = function (schema, body) {
  // this keeps a dictionary of all the fields in users schema as key and has its corresponding type as a value
  // should return {singular: Type, multiple: [Type]}
  var queryId;
  var key;
  var fieldToType = {};
  for (var key_1 in schema._mutationType._fields) {
    fieldToType[key_1] = schema._mutationType._fields[key_1].type;
  }
  for (var key_2 in schema._queryType._fields) {
    fieldToType[key_2] = schema._queryType._fields[key_2].type;
  }
  // Parse through AST to get Operation type (query or mutation). This will dictate which controller it goes through
  var AST = parse(body);
  var parsed = parse(body).definitions[0];
  var operation = parsed.operation;
  // this will remove spaces and reference to mutation in body str
  body = body.replace(/query|mutation|\s/g, '');
  //this will clean up the body so that only the id is in the arg
  if (operation === 'mutation') {
    var id = body.split('(')[1].split(',')[0];
    // need to refactor this
    body = [body.split('(')[0], '('.concat(id, ')'), body.split(')')[1]].join(
      ''
    );
  }
  // grabs the field that the query is using. e.g people
  var field = parsed.selectionSet.selections[0].name.value; // string
  // finds the correct type based on the field type pair
  var type = fieldToType[field].toString();
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
  return { key: key, operation: operation };
};
var keyParser = function (key) {
  // split key into its useful strings
  var searchArr = key.split('.');
  // this string holds the type of the graphql query
  var searchType = searchArr[0];
  // this string combines the type and the id to search the cache keys with
  var searchKey = searchArr[0] + '.' + searchArr[1];
  // this part of the string holds the actual graph ql query itself
  var graphqlQuery = searchArr[searchArr.length - 1];
  return {
    searchType: searchType,
    searchKey: searchKey,
    graphqlQuery: graphqlQuery,
  };
};
Qeraunos.prototype.query = function (req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var _a,
      key,
      operation,
      data,
      _b,
      searchType_1,
      searchKey_1,
      dataType,
      dataKeys,
      totalKeys,
      i,
      graphqlQuery,
      updatedData,
      _c,
      searchType,
      searchKey,
      _d,
      _e,
      _f,
      _i,
      keys,
      graphqlQuery,
      updatedData,
      received,
      data,
      err_1;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          (_a = graphqlParser(this.schema, req.body.query)),
            (key = _a.key),
            (operation = _a.operation);
          _g.label = 1;
        case 1:
          _g.trys.push([1, 19, , 20]);
          if (!(operation === 'mutation')) return [3 /*break*/, 14];
          return [
            4 /*yield*/,
            graphql({
              schema: this.schema,
              source: req.body.query,
            }),
          ];
        case 2:
          data = _g.sent();
          res.locals.graphql = data;
          res.locals.response = 'UNCACHED';
          if (!this.hasRedis) return [3 /*break*/, 9];
          (_b = keyParser(key)),
            (searchType_1 = _b.searchType),
            (searchKey_1 = _b.searchKey);
          return [
            4 /*yield*/,
            this.client.scan(0, 'MATCH', '['.concat(searchType_1, ']')),
          ];
        case 3:
          dataType = _g.sent();
          return [
            4 /*yield*/,
            this.client.scan(0, 'MATCH', ''.concat(searchKey_1)),
          ];
        case 4:
          dataKeys = _g.sent();
          totalKeys = dataType.keys.concat(dataKeys.keys);
          i = 0;
          _g.label = 5;
        case 5:
          if (!(i < totalKeys.length)) return [3 /*break*/, 8];
          graphqlQuery = keyParser(totalKeys[i]).graphqlQuery;
          return [
            4 /*yield*/,
            graphql({
              schema: this.schema,
              source: graphqlQuery,
            }),
          ];
        case 6:
          updatedData = _g.sent();
          this.client.set(''.concat(totalKeys[i]), JSON.stringify(updatedData));
          _g.label = 7;
        case 7:
          i++;
          return [3 /*break*/, 5];
        case 8:
          return [2 /*return*/, next()];
        case 9:
          (_c = keyParser(key)),
            (searchType = _c.searchType),
            (searchKey = _c.searchKey);
          _d = this.qeraunosCache.keys;
          _e = [];
          for (_f in _d) _e.push(_f);
          _i = 0;
          _g.label = 10;
        case 10:
          if (!(_i < _e.length)) return [3 /*break*/, 13];
          _f = _e[_i];
          if (!(_f in _d)) return [3 /*break*/, 12];
          keys = _f;
          graphqlQuery = keyParser(keys).graphqlQuery;
          if (
            !(
              keys.includes(searchKey) ||
              keys.includes('['.concat(searchType, ']'))
            )
          )
            return [3 /*break*/, 12];
          return [
            4 /*yield*/,
            graphql({
              schema: this.schema,
              source: graphqlQuery,
            }),
          ];
        case 11:
          updatedData = _g.sent();
          this.qeraunosCache.set(keys, updatedData);
          _g.label = 12;
        case 12:
          _i++;
          return [3 /*break*/, 10];
        case 13:
          return [2 /*return*/, next()];
        case 14:
          if (!this.hasRedis) return [3 /*break*/, 16];
          return [4 /*yield*/, this.client.get(key)];
        case 15:
          received = _g.sent();
          if (received) {
            res.locals.graphql = JSON.parse(received);
            res.locals.response = 'Cached';
            return [2 /*return*/, next()];
          }
          _g.label = 16;
        case 16:
          // check whether key exists in cache, if so return value from cache.
          // if not, send a graphQL query
          if (this.qeraunosCache.keys[key]) {
            res.locals.graphql = this.qeraunosCache.get(key);
            res.locals.response = 'Cached';
            return [2 /*return*/, next()];
          }
          return [
            4 /*yield*/,
            graphql({
              schema: this.schema,
              source: req.body.query,
            }),
          ];
        case 17:
          data = _g.sent();
          res.locals.graphql = data;
          res.locals.response = 'Uncached';
          // check if using redis or custom cache and set accordingly
          if (this.hasRedis) {
            this.client.set(''.concat(key), JSON.stringify(data));
          } else {
            this.qeraunosCache.set(key, data);
          }
          return [2 /*return*/, next()];
        case 18:
          return [3 /*break*/, 20];
        case 19:
          err_1 = _g.sent();
          return [
            2 /*return*/,
            next({
              log: 'Express error handler caught unknown middleware error in qeraunos controller',
              message: { err: 'An error occurred in qeraunos controller' },
            }),
          ];
        case 20:
          return [2 /*return*/];
      }
    });
  });
};
module.exports = Qeraunos;
