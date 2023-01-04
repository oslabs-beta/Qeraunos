function FreqNode() {
    this.val =  0;
    this.items = new Set();
    this.prev = null;
    this.next = null;
  }
  
  function Node(data, parent) {
    this.data = data;
    this.parent = parent;
  }
  
  function LFUCache() {
    this.bykey = {};
    this.freq_head = new FreqNode();
  }
  
  function getNewNode(val, prev, next) {
    const nn = new FreqNode();
    nn.val = val;
    nn.prev = prev;
    nn.next = next;
    prev.next = nn;
    next.prev = nn;
    return nn;
  }
  
  function deleteNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  
  LFUCache.prototype.get = function(key) {
    const tmp = this.bykey[key];
    if (!tmp) return 'item does not exist in cache';
    const freq = tmp.parent;
    let nextFreq = freq.next;
  
    if (nextFreq === this.freq_head || nextFreq.val !== freq.val + 1) {
      nextFreq = getNewNode(freq.val + 1, freq, nextFreq)
    }
    nextFreq.items.add(key);
    tmp.parent = nextFreq;
  
    // remove existing node
    if (!freq.items.length) deleteNode(freq);
    return tmp.data;
  }
  
  LFUCache.prototype.put = function(key, value) {
    if (key in this.bykey) return "Key already exists in cache";
    let freq = this.freq_head
    console.log(this.freq_head)
    console.log(freq)
    if (freq.val !== 1) {
      freq = getNewNode(1, this.freq_head, freq);
    }
    freq.items.add(key);
    this.bykey[key] = new Node(value, freq);
  }
  
  const myLFU = new LFUCache(5);
  myLFU.put(1, 1);
  myLFU.get(1);
  console.log(myLFU);
  myLFU.put(2, 2);
  myLFU.put(3, 3);
  myLFU.put(4, 4);
  myLFU.put(5, 5);
  myLFU.get(1);
  myLFU.get(1);
  myLFU.get(1);
  myLFU.put(6, 6);
  console.log(myLFU);