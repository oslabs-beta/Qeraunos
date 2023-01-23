type DLLType = {
  freqCount: number;
  head: NodeType | null;
  tail: NodeType | null;
};
type NodeType = {
  next: NodeType | null;
  prev: NodeType | null;
  key: string;
  value: object;
  freqCount: number;
};

function serverNode(this: any, key: string, value: object) {
  this.next = null;
  this.prev = null;
  this.key = key;
  this.value = value;
  this.freqCount = 1;
}

function serverDLL(freqCount: number) {
  // stores frequency count to reference the correct key in frequency hashmap within LfuCache
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
const QeraunosServer = function (capacity: number) {
  this.keys = {};
  this.frequency = {};
  this.capacity = capacity;
  this.minFrequency = 0;
  this.size = 0;
};

// this function removes the tail of the DLL which is also the least recently used node
//This is the LRU aspect of the LFU/LRU cache
QeraunosServer.prototype.removeAtTail = function (DLL: DLLType): NodeType {
  // delete the tail node from hashtable
  const deleted = this.keys[DLL.tail.key];
  delete this.keys[DLL.tail.key];
  // delete from linked list
  // if there is only one node in list
  if (DLL.head == DLL.tail) {
    DLL.head = null;
    DLL.tail = null;
    // if there are more than 1 node, set tail to previous and its next to null to delete
  } else {
    DLL.tail = DLL.tail.prev;
    DLL.tail.next = null;
  }
  this.size--;
  return deleted;
};

//If (key, value) doesn't exist in the cache, use this method to insert into cache
// creates a frequency list if not already existing and inserts a new node into it
QeraunosServer.prototype.addNode = function (key: string, value: object): void {
  let node: NodeType = new (serverNode as any)(key, value);
  // place node into hashtable
  this.keys[key] = node;
  // check if frequency of 1 exists already, if not, create a new list with freq of 1
  if (!this.frequency[1]) this.frequency[1] = new (serverDLL as any)(1);
  // insert the new into the freq list using helper function
  this.insertAtHead(node, this.frequency[1]);
  this.minFrequency = 1;
  this.size++;
};

// inserts a new node at the head
//freqList is needed so that we keep track of where this node is within this.frequency hashtable
QeraunosServer.prototype.insertAtHead = function (
  newNode: NodeType,
  freqList: DLLType
): void {
  let head: NodeType = freqList.head;
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
QeraunosServer.prototype.updateNode = function (node: NodeType): void {
  let freq: number = node.freqCount;
  node.freqCount = freq + 1;
  // removes node from frequency list using helper function
  this.removeNode(node, this.frequency[freq]);
  //After removing node from list above, checks the list to see if it's empty, if it is, we set the minFrequency to the next frequency
  if (this.minFrequency == freq && this.frequency[freq].head == null)
    this.minFrequency = node.freqCount;
  // if the frequency at the nodes freqCount does not exist in the hash table, set the freq hashtable with a new linked list at that freqCount
  if (!this.frequency[node.freqCount])
    this.frequency[node.freqCount] = new (serverDLL as any)(node.freqCount);
  // resets node so that it doesn't reference previous list
  node.next = null;
  node.prev = null;
  // inserts reset node into freq hashtable at its freqCount
  this.insertAtHead(node, this.frequency[node.freqCount]);
};

// removes node from linked freq list
QeraunosServer.prototype.removeNode = function (
  newNode: NodeType,
  freqList: DLLType
): void {
  let prev: NodeType = newNode.prev;
  let next: NodeType = newNode.next;
  if (prev) prev.next = next;
  if (next) next.prev = prev;
  // check if newNode is either at the head or tail, and set the head or tail of freq list accordingly
  if (newNode == freqList.head) freqList.head = next;
  if (newNode == freqList.tail) freqList.tail = prev;
};

// O(1) get function to get node from key
QeraunosServer.prototype.get = function (key: string): object {
  if (!this.keys[key]) return undefined;
  // get, update, return the nodes value
  let node: NodeType = this.keys[key];
  //updates node --> see comments for method above
  this.updateNode(node);
  return node.value;
};

// O(1) set function to set new node
QeraunosServer.prototype.set = function (
  key: string,
  value: object
): NodeType | void {
  // check if node is already in hashtable
  if (this.keys[key]) {
    let node: NodeType = this.keys[key];
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
    let leastFreqNode: NodeType = this.frequency[this.minFrequency];
    //this keeps track of the removed node and returns it
    const removed: NodeType = this.removeAtTail(leastFreqNode);
    // after removing the tail to make room, add the new node
    this.addNode(key, value);
    return removed;
  }
};

module.exports = QeraunosServer;
