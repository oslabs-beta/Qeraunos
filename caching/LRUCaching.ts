function Node(key, val) {
  this.key = key;
  this.val = val;
  this.next = null;
  this.prev = null;
}

function LinkedList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

LinkedList.push = (key, val) => {
  const node = new Node(key, val);
  if (!this.head) {
    this.head = node;
    this.tail = node;
  } else {
    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
  }
  this.length++;
  return node;
};

LinkedList.remove = (node) => {
  // if only 1 node
  if (!node.prev && !node.next) {
    this.head = null;
    this.tail = null;
  }
  // if node is the head
  else if (!node.prev) {
    this.head = node.next;
    this.head.prev = null;
  }
  // if node is the tail
  else if (!node.next) {
    this.tail = node.prev;
    this.tail.next = null;
    // otherwise insert between
  } else {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  this.length--;
};

function LRUCache(capacity) {
  this.DLL = new LinkedList();
  this.map = {};
  this.capacity = capacity;
}

LRUCache.get = (key) => {
  if (!this.map[key]) return -1;
  const value = this.map[key].val;
  this.DLL.remove(this.map[key]);
  this.map[key] = this.DLL.push(key, value);
  return value;
};

LRUCache.put = (key, value) => {
  if (this.map[key]) this.DLL.remove(this.map[key]);
  this.map[key] = this.DLL.push(key, value);
  if (this.DLL.length > this.capacity) {
    const headKey = this.DLL.head.key;
    delete this.map[headKey];
    this.DLL.remove(this.DLL.head);
  }
};
