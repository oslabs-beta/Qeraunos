function LfuNode(key, value) {
  this.next = null;
  this.prev = null;
  this.key = key;
  this.value = value;
  this.freqCount = 1;
}

function LfuDLL(freqCount) {
  this.freqCount = freqCount;
  this.head = null;
  this.tail = null;
}

const LfuCache = function (capacity) {
  this.keys = {};
  this.frequency = {};
  this.capacity = capacity;
  this.minFrequency = 0;
  this.size = 0;
};

LfuCache.prototype.removeAtTail = function (node) {
  // delete from hashtable
  delete this.keys[node.tail.key];
  // delete from linked list
  // if there is only one node in list
  if (node.head == node.tail) {
    node.head = null;
    node.tail = null;
    // if there are more than 1 node, set tail to previous and its next to null to delete
  } else {
    node.tail = node.tail.prev;
    node.tail.next = null;
  }
  this.size--;
};

// creates a frequency list if not already existing and inserts a new node into it
LfuCache.prototype.addNode = function (key, value) {
  let node = new LfuNode(key, value);
  // place node into hashtable
  this.keys[key] = node;
  // check if frequency of 1 exists already, if not, create a new list with freq of 1
  if (!this.frequency[1]) this.frequency[1] = new LfuDLL(1);
  // insert the new into the freq list using helper function
  this.insertAtHead(node, this.frequency[1]);
  this.minFrequency = 1;
  this.size++;
};

// inserts a new node at the head
LfuCache.prototype.insertAtHead = function (newNode, freqList) {
  let head = freqList.head;
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

// updates node when get or set is used
LfuCache.prototype.updateNode = function (node) {
  let freq = node.freqCount;
  node.freqCount = freq + 1;
  // removes node from frequency list using helper function
  this.removeNode(node, this.frequency[freq]);
  // if the minimum frequency is equal to the frequency of the node AND the hashtable does not have a node at that frequency,
  // set the min frequency to the nodes freqCount
  if (this.minFrequency == freq && this.frequency[freq].head == null)
    this.minFrequency = node.freqCount;
  // if the frequency at the nodes freqCount does not exist in the hash table, set the freq hashtable with a new linked list at that freqCount
  if (!this.frequency[node.freqCount])
    this.frequency[node.freqCount] = new LfuDLL(node.freqCount);
  // resets node
  node.next = null;
  node.prev = null;
  // inserts reset node into freq hashtable at its freqCount
  this.insertAtHead(node, this.frequency[node.freqCount]);
};

// removes node from linked freq list
LfuCache.prototype.removeNode = function (newNode, freqList) {
  let prev = newNode.prev;
  let next = newNode.next;
  if (prev) prev.next = next;
  if (next) next.prev = prev;
  // check if newNode is either at the head or tail, and set the head or tail of freq list accordingly
  if (newNode == freqList.head) freqList.head = next;
  if (newNode == freqList.tail) freqList.tail = prev;
};

// O(1) get function to get node from key
LfuCache.prototype.get = function (key) {
  if (!this.keys[key]) return undefined;
  // get, update, return the nodes freqCount
  let node = this.keys[key];
  this.updateNode(node);
  return node.value;
};

// O(1) set function to set new node
LfuCache.prototype.set = function (key, value) {
  // check if node is already in hashtable
  if (this.keys[key]) {
    let node = this.keys[key];
    node.value = value;
    this.updateNode(node);
  } else if (this.size < this.capacity) {
    // check if current size of hashtable is less than the capacity constraint and insert a new node
    this.addNode(key, value);
  } else if (this.capacity > 0) {
    // otherwise if size is greater than or equal to capacity, and capacity is greater than 0,
    // remove the least frequently occurring data from the tail, which will also be the least recently used one
    let leastFreqNode = this.frequency[this.minFrequency];
    this.removeAtTail(leastFreqNode);
    // after removing the tail to make room, add the new node
    this.addNode(key, value);
  }
};

module.exports = LfuCache;
