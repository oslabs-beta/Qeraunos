"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var CachingAlgo = require('../../caching/caching-algo');
// const schema = require('../schema/schema');
var _a = require('graphql'), parse = _a.parse, visit = _a.visit, graphql = _a.graphql;
var query = require('express').query;
var redis = require('redis');
// builds qeraunos middleware and binds functions
function Qeraunos(schema, redisHost, redisPort, redisPwd) {
    var _this = this;
    this.schema = schema;
    this.query = this.query.bind(this);
    this.client = redis.createClient({
        socket: {
            host: redisHost,
            port: redisPort
        },
        password: redisPwd
    });
    this.redisHost = redisHost;
    this.redisPort = redisPort;
    this.redisPwd = redisPwd;
    this.hasRedis = false;
    (function () {
        if (_this.redisHost && _this.redisPort && _this.redisPwd) {
            _this.client.connect().then(function () {
                _this.hasRedis = true;
                console.log('Using Redis cache');
            });
        }
        else {
            console.log('Using standard Qeraunos cache');
        }
    })();
}
// Qeraunos.prototype.createRedisClient = function(){
//   client : redis.createClient({
//    socket: {
//        host: this.redisHost,
//        port: this.redisPort
//    },
//    password: this.redisPwd
// });
// client.on('error', err => {
//    console.log('Error ' + err);
// });
// }
// client.on('error', err => {
//     console.log('Error ' + err);
// });
var newCache = new CachingAlgo(100);
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
    // console.log('===================TOP OF AST============', AST);
    var parsed = parse(body).definitions[0];
    // const visitor = (node, level, curr = 0) => {
    //   if (level === curr) return;
    //   console.log(`LEVEL ${curr} NODE:`, print(node));
    //   console.log('CURRENT NODE', node);
    //   console.log('NEXT NODE', node.selectionSet);
    //   return visitor(node.selectionSet, level, ++curr);
    // };
    // console.log('===========PRINTED AST==========', print(parsed.selectionSet));
    // console.log('============PARSE==========', parsed);
    var operation = parsed.operation;
    // this will remove spaces and reference to mutation in body str
    body = body.replace(/query|mutation|\s/g, '');
    //this will clean up the body so that only the id is in the arg
    if (operation === 'mutation') {
        var id = body.split('(')[1].split(',')[0];
        body = [body.split('(')[0], "(".concat(id, ")"), body.split(')')[1]].join('');
    }
    // console.log('PARSED: ', parsed);
    // grabs the field that the query is using. e.g people
    var field = parsed.selectionSet.selections[0].name.value; // string
    // console.log('FIELD: ', field);
    // finds the correct type based on the field type pair
    // console.log('FIELD', fieldToType[field]);
    var type = fieldToType[field].toString();
    // console.log('TYPE: ', type);
    // grabs all the parameters in the query search and stores in an array.
    // *** THIS MAY NOT BE NEEDED IF USING BODY AS A UNIQUER ***
    // const parametersArr:[] =
    //   parsed.selectionSet.selections[0].selectionSet.selections;
    // console.log('PARAMETERS ARR: ', parametersArr);
    // let parameters: any[] = [];
    // parametersArr.forEach((elem:any) => {
    //   parameters.push(elem.name.value);
    // });
    // console.log('PARAMETERS: ', parameters);
    // joins the array into a singular string to use as part of the key
    // const parameterStr:string = parameters.join('');
    //  ********* */
    // console.log('PARAMETERS STR: ', parameters);
    // checks if type if there are any arguments. this first one checks for an id if its first
    // if there is an argument of id, then it uses that inside the key along with type and parameters, if not, it just uses type and parameter
    for (var field_1 in fieldToType) {
        if (body.includes(field_1)) {
            body = body.replace(field_1, type);
        }
    }
    if (!parsed.selectionSet.selections[0].arguments[0]) {
        key = type + '.' + body;
    }
    else {
        // may need to loop through arguments to find _id or id then grab the value
        // possible that user may not set id and select based on other parameters
        queryId = parsed.selectionSet.selections[0].arguments[0].value.value;
        // console.log('QUERYID: ', queryId);
        key = type + '.' + queryId + '.' + body;
    }
    // console.log('QUERYKEY: ', key);
    return { key: key, operation: operation };
};
Qeraunos.prototype.query = function (
// if (this.redisHost){
//   //implementing cache using redis
// }
req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, key, operation, searchArr, searchType, searchKey, graphqlQuery, data, _b, _c, _d, _i, keys, updatedData, data, err_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = graphqlParser(this.schema, req.body.query), key = _a.key, operation = _a.operation;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 11, , 12]);
                    if (this.hasRedis) {
                        console.log('THis is this.client', this.client);
                        console.log('this is this.redisHost', this.redisHost);
                        console.log('this is this.hasRedis', this.hasRedis);
                        console.log('redis condition met');
                    }
                    if (!(operation === 'mutation')) return [3 /*break*/, 7];
                    searchArr = key.split('.');
                    searchType = searchArr[0];
                    searchKey = searchArr[0] + '.' + searchArr[1];
                    graphqlQuery = searchArr[2];
                    return [4 /*yield*/, graphql({
                            schema: this.schema,
                            source: req.body.query
                        })];
                case 2:
                    data = _e.sent();
                    res.locals.graphql = data;
                    res.locals.response = 'UNCACHED';
                    _b = newCache.keys;
                    _c = [];
                    for (_d in _b)
                        _c.push(_d);
                    _i = 0;
                    _e.label = 3;
                case 3:
                    if (!(_i < _c.length)) return [3 /*break*/, 6];
                    _d = _c[_i];
                    if (!(_d in _b)) return [3 /*break*/, 5];
                    keys = _d;
                    if (!(keys.includes(searchKey) || keys.includes("[".concat(searchType, "]")))) return [3 /*break*/, 5];
                    return [4 /*yield*/, graphql({
                            schema: this.schema,
                            source: graphqlQuery
                        })];
                case 4:
                    updatedData = _e.sent();
                    newCache.set(keys, updatedData);
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // set new mutation in cache
                    // do we need to do this?
                    console.log('============DATA===========', data);
                    // newCache.set(key, data);
                    // console.log('NEW CACHE OBJ IN MUTATION', newCache.keys);
                    return [2 /*return*/, next()];
                case 7:
                    if (!newCache.keys[key]) return [3 /*break*/, 8];
                    res.locals.graphql = newCache.get(key);
                    res.locals.response = 'Cached';
                    console.log('OLD CACHE OBJ IN QUERY', newCache.keys[key].value.data);
                    return [2 /*return*/, next()];
                case 8: return [4 /*yield*/, graphql({
                        schema: this.schema,
                        source: req.body.query
                    })];
                case 9:
                    data = _e.sent();
                    res.locals.graphql = data;
                    res.locals.response = 'Uncached';
                    newCache.set(key, data);
                    console.log('NEW CACHE OBJ IN QUERY', newCache.keys);
                    return [2 /*return*/, next()];
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_1 = _e.sent();
                    return [2 /*return*/, next({
                            log: 'Express error handler caught unknown middleware error in qeraunos controller',
                            message: { err: 'An error occurred in qeraunos controller' }
                        })];
                case 12: return [2 /*return*/];
            }
        });
    });
};
module.exports = { Qeraunos: Qeraunos };
