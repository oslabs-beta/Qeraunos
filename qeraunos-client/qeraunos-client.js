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
var localforage = require('localforage');
var axios = require('axios');
function clientNode(key, value) {
    this.next = null;
    this.prev = null;
    this.key = key;
    this.value = value;
    this.freqCount = 1;
}
function clientDLL(freqCount) {
    // stores frequency count to reference the correct key in frequency hashmap within Qeraunos
    this.freqCount = freqCount;
    this.head = null;
    this.tail = null;
}
// this funciton creates an LFU/LRU caching algo using two hash maps and DLL.
//this.keys is a hash map of the key and data we give it from graphql.
//this.frequency is a hashmap of how many times the node is called
// this.capacity is the total capacity of the cache
// this.size is the current size of the cache
//Search = O(1)
//Setting = O(1)
//Deleteing = O(1)
var Qeraunos = function (capacity) {
    this.keys = {};
    this.frequency = {};
    this.capacity = capacity;
    this.minFrequency = 0;
    this.size = 0;
};
function QeraunosClient(capacity) {
    this.cache = new Qeraunos(capacity);
    localforage.setItem('Qeraunos', this.cache);
}
Qeraunos.prototype.getIDB = function () {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, localforage.getItem('Qeraunos', function (err, value) {
                        if (!value) {
                            return false;
                        }
                        else {
                            _this.keys = value.keys;
                            _this.frequency = value.frequency;
                            _this.capacity = value.capacity;
                            _this.minFrequency = value.minFrequency;
                            _this.size = value.size;
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
Qeraunos.prototype.setIDB = function () {
    return __awaiter(this, void 0, void 0, function () {
        var newCache;
        return __generator(this, function (_a) {
            newCache = {
                keys: this.keys,
                frequency: this.frequency,
                capacity: this.capacity,
                minFrequency: this.minFrequency,
                size: this.size
            };
            localforage.setItem('Qeraunos', this);
            return [2 /*return*/];
        });
    });
};
// this function removes the tail of the DLL which is also the least recently used node
//This is the LRU aspect of the LFU/LRU cache
Qeraunos.prototype.removeAtTail = function (DLL) {
    // delete the tail node from hashtable
    var deleted = this.keys[DLL.tail.key];
    delete this.keys[DLL.tail.key];
    // delete from linked list
    // if there is only one node in list
    if (DLL.head == DLL.tail) {
        DLL.head = null;
        DLL.tail = null;
        // if there are more than 1 node, set tail to previous and its next to null to delete
    }
    else {
        DLL.tail = DLL.tail.prev;
        DLL.tail.next = null;
    }
    this.size--;
    return deleted;
};
//If (key, value) doesn't exist in the cache, use this method to insert into cache
// creates a frequency list if not already existing and inserts a new node into it
Qeraunos.prototype.addNode = function (key, value) {
    var node = new clientNode(key, value);
    // place node into hashtable
    this.keys[key] = node;
    // check if frequency of 1 exists already, if not, create a new list with freq of 1
    if (!this.frequency[1])
        this.frequency[1] = new clientDLL(1);
    // insert the new into the freq list using helper function
    this.insertAtHead(node, this.frequency[1]);
    this.minFrequency = 1;
    this.size++;
};
// inserts a new node at the head
//freqList is needed so that we keep track of where this node is within this.frequency hashtable
Qeraunos.prototype.insertAtHead = function (newNode, freqList) {
    var head = freqList.head;
    // if there are no nodes in freq list, head and tail of list are the new node
    if (head === null) {
        freqList.head = newNode;
        freqList.tail = newNode;
        return;
    }
    // sets newNode at the head by setting current heads prev to point at newNode and newNode to point at heads next
    head.prev = newNode;
    newNode.next = head;
    newNode.prev = null;
    // sets the head of the freq list to the newNode with the new pointers
    freqList.head = newNode;
};
// updates node when get is used and it's in the cache
Qeraunos.prototype.updateNode = function (node) {
    var freq = node.freqCount;
    node.freqCount = freq + 1;
    // removes node from frequency list using helper function
    this.removeNode(node, this.frequency[freq]);
    //After removing node from list above, checks the list to see if it's empty, if it is, we set the minFrequency to the next frequency
    if (this.minFrequency == freq && this.frequency[freq].head == null)
        this.minFrequency = node.freqCount;
    // if the frequency at the nodes freqCount does not exist in the hash table, set the freq hashtable with a new linked list at that freqCount
    if (!this.frequency[node.freqCount])
        this.frequency[node.freqCount] = new clientDLL(node.freqCount);
    // resets node so that it doesn't reference previous list
    node.next = null;
    node.prev = null;
    // inserts reset node into freq hashtable at its freqCount
    this.insertAtHead(node, this.frequency[node.freqCount]);
};
// removes node from linked freq list
Qeraunos.prototype.removeNode = function (newNode, freqList) {
    var prev = newNode.prev;
    var next = newNode.next;
    if (prev)
        prev.next = next;
    if (next)
        next.prev = prev;
    // check if newNode is either at the head or tail, and set the head or tail of freq list accordingly
    if (newNode == freqList.head)
        freqList.head = next;
    if (newNode == freqList.tail)
        freqList.tail = prev;
};
// O(1) get function to get node from key
Qeraunos.prototype.get = function (key) {
    if (!this.keys[key])
        return undefined;
    // get, update, return the nodes value
    var node = this.keys[key];
    //updates node --> see comments for method above
    this.updateNode(node);
    return node.value;
};
// O(1) set function to set new node
Qeraunos.prototype.set = function (key, value) {
    // check if node is already in hashtable
    if (this.keys[key]) {
        var node = this.keys[key];
        // update nodes value to new passed in value
        node.value = value;
        // this.updateNode(node);
    }
    // check if current size of hashtable is less than the capacity constraint and insert a new node
    else if (this.size < this.capacity) {
        this.addNode(key, value);
    }
    // otherwise if size is greater than or equal to capacity, and the input capacity is greater than 0,
    else if (this.size >= this.capacity && this.capacity > 0) {
        // remove the least frequently occurring data from the tail, and if there are multiple in this frequency, remove the least recently used one
        var leastFreqNode = this.frequency[this.minFrequency];
        //this keeps track of the removed node and returns it
        var removed = this.removeAtTail(leastFreqNode);
        // after removing the tail to make room, add the new node
        this.addNode(key, value);
        return removed;
    }
};
//This flow function organizes all of the steps required
QeraunosClient.prototype.query = function (queryString, graphqlEndpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var key, data, queryTimeObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = queryString.replace(/[^A-Z0-9]/gi, '');
                    //this will get a copy of the cache in IDB and set the current object to that copy of the full cache.
                    console.log('Qeraunos:', Qeraunos);
                    this.cache.getIDB();
                    data = this.cache.get(key);
                    if (!!data) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios({
                            url: graphqlEndpoint,
                            method: 'post',
                            data: {
                                query: queryString
                            }
                        })];
                case 1:
                    queryTimeObj = _a.sent();
                    // From that response, we can then set the data in the cache copy.
                    data = queryTimeObj.data.data;
                    this.cache.set(key, data);
                    console.log('CACHE @ set method:', this.cache);
                    //This replaces the updated cache to IDB
                    this.cache.setIDB();
                    console.log('CACHE @ setIDB:', this.cache);
                    //return to the front end the response.
                    return [2 /*return*/, { data: data, response: 'Uncached' }];
                case 2:
                    //will get the value from the cached item and send the response back to the front end.
                    this.cache.setIDB();
                    console.log('CACHED RESPONSE:', this.cache);
                    return [2 /*return*/, { data: data, response: 'Cached' }];
            }
        });
    });
};
module.exports = QeraunosClient;
