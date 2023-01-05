function LfuNode(key, value) {
  this.prev = null;
  this.next = null;
  this.key = key;
  this.value = value;
  this.freqCount = 1;
}

function LfuDLL() {
  this.head = new LfuNode('head', null);
  this.tail = new LfuNode('tail', null);
  this.head.next = this.tail;
  this.tail.prev = this.head;
  this.size = 0;
}

LfuDLL.prototype.insertAtHead = function (node) {
  // set current head as new node's next
  node.next = this.head.next;
  this.head.next.prev = node;

  // set current head as new node
  this.head.next = node;
  node.prev = this.head;

  this.size++;
};

LfuDLL.prototype.removeAtTail = function () {
  // save last node to return
  const oldTail = this.tail.prev;

  // get reference to node we want to remove
  const prev = this.tail.prev;

  prev.prev.next = this.tail;
  this.tail.prev = prev.prev;

  this.size--;
  return oldTail;
};

LfuDLL.prototype.removeNode = function (node) {
  node.prev.next = node.next;
  node.next.prev = node.prev;
  this.size--;
};

function LfuCache(capacity) {
  // stores LfuNodes
  this.keys = {};

  // stores LfuDDL
  this.frequency = {};

  this.capacity = capacity;

  // keeps track of the lowest frequency linked list
  this.minFrequency = 0;

  this.size = 0;
}

LfuCache.prototype.set = function (key, value) {
  let node = this.keys[key];
  // if node doesnt exit in keys, then add it
  if (node === undefined) {
    // create new node and store in keys
    node = new LfuNode(key, value);
    this.keys[key] = node;
    node.data = value;

    // if there is space for the node, add it to the linked list with frequency of 1
    if (this.size !== this.capacity) {
      // if linked list for frequency 1 does not exist then create it
      if (this.frequency[1] === undefined) {
        this.frequency[1] = new LfuDLL();
      }

      // add new node and increment size of frequency 1
      this.frequency[1].insertAtHead(node);
      this.size++;

      // if frequency 1 is full and we need to deleted a node, delete the tail
    } else {
      const oldTail = this.frequency[this.minFrequency].removeAtTail();
      delete this.keys[oldTail.key];

      // if we deleted frequency 1 then add it back before adding new node
      if (this.frequency[1] === undefined) {
        this.frequency[1] = new LfuDLL();
      }
      this.frequency[1].insertAtHead(node);
    }
    this.minFrequency = 1;

    // if the node exists, we need to get it and move it to the new linked list
  } else {
    // save the old frequency of the node and increment and update the data
    const oldFreqCount = node.freqCount;

    node.data = value;
    node.freqCount++;

    // remove node from linked list
    this.frequency[oldFreqCount].removeNode(node);

    // if new list does not exit then create it
    if (this.frequency[node.freqCount] === undefined) {
      this.frequency[node.freqCount] = new LfuDLL();
    }

    // add new node to new linked list with the incremented freqcount
    this.frequency[node.freqCount].insertAtHead(node);

    // if the node we incremented was in the minFrequency list
    // and there is nothing left in the old list, then we know
    // the new minFrequency for any node in any list is the new
    // freq so we can increment that now
    if (
      oldFreqCount == this.minFrequency &&
      Object.keys(this.frequency[oldFreqCount]).size === 0
    ) {
      this.minFrequency++;
    }
  }
};

LfuCache.prototype.get = function (key) {
  const node = this.keys[key];
  if (node === undefined) return null;

  const oldFreqCount = node.freqCount;
  node.freqCount++;

  // remove node from old frequency list and create new one if next one doesnt exist
  // before adding the neow to the next list at the head
  this.frequency[oldFreqCount].removeNode(node);
  if (!this.frequency[node.freqCount]) {
    this.frequency[node.freqCount] = new LfuDLL();
  }

  this.frequency[node.freqCount].insertAtHead(node);

  // if old frequency list is empty then update minfrequency
  if (
    oldFreqCount === this.minFrequency &&
    Object.keys(this.frequency[oldFreqCount]).length === 0
  ) {
    this.minFrequency++;
  }
  return node.data;
};

module.exports = LfuCache;
