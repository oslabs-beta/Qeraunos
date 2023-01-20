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
var LfuCache = function (capacity) {
    this.keys = {};
    this.frequency = {};
    this.capacity = capacity;
    this.minFrequency = 0;
    this.size = 0;
};
LfuCache.prototype.removeAtTail = function (DLL) {
    var deleted = this.keys[DLL.tail.key];
    delete this.keys[DLL.tail.key];
    if (DLL.head == DLL.tail) {
        DLL.head = null;
        DLL.tail = null;
    }
    else {
        DLL.tail = DLL.tail.prev;
        DLL.tail.next = null;
    }
    this.size--;
    return deleted;
};
LfuCache.prototype.addNode = function (key, value) {
    var node = new LfuNode(key, value);
    this.keys[key] = node;
    if (!this.frequency[1])
        this.frequency[1] = new LfuDLL(1);
    this.insertAtHead(node, this.frequency[1]);
    this.minFrequency = 1;
    this.size++;
};
LfuCache.prototype.insertAtHead = function (newNode, freqList) {
    var head = freqList.head;
    if (head === null) {
        freqList.head = newNode;
        freqList.tail = newNode;
        return;
    }
    head.prev = newNode;
    newNode.next = head;
    newNode.prev = null;
    freqList.head = newNode;
};
LfuCache.prototype.updateNode = function (node) {
    var freq = node.freqCount;
    node.freqCount = freq + 1;
    this.removeNode(node, this.frequency[freq]);
    if (this.minFrequency == freq && this.frequency[freq].head == null)
        this.minFrequency = node.freqCount;
    if (!this.frequency[node.freqCount])
        this.frequency[node.freqCount] = new LfuDLL(node.freqCount);
    node.next = null;
    node.prev = null;
    this.insertAtHead(node, this.frequency[node.freqCount]);
};
LfuCache.prototype.removeNode = function (newNode, freqList) {
    var prev = newNode.prev;
    var next = newNode.next;
    if (prev)
        prev.next = next;
    if (next)
        next.prev = prev;
    if (newNode == freqList.head)
        freqList.head = next;
    if (newNode == freqList.tail)
        freqList.tail = prev;
};
LfuCache.prototype.get = function (key) {
    if (!this.keys[key])
        return undefined;
    var node = this.keys[key];
    this.updateNode(node);
    return node.value;
};
LfuCache.prototype.set = function (key, value) {
    if (this.keys[key]) {
        var node = this.keys[key];
        node.value = value;
    }
    else if (this.size < this.capacity) {
        this.addNode(key, value);
    }
    else if (this.size >= this.capacity && this.capacity > 0) {
        var leastFreqNode = this.frequency[this.minFrequency];
        var removed = this.removeAtTail(leastFreqNode);
        this.addNode(key, value);
        return removed;
    }
};
module.exports = LfuCache;
//# sourceMappingURL=caching-algo.js.map