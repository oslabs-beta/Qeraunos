const { LfuCache } = require('../caching/LFU-caching2');

describe('LFU caching test', () => {
  beforeAll((done) => {
    const newLFU = new LfuCache(3);
    done();
  });

  it('sets a new node within the cache', () => {});

  it('gets the correct value at the key', () => {});

  it('it removes the least frequently used value when capacity is full', () => {});

  it('it removes the tail out of the least frequently used linked list when capacity is full', () => {});
});

const myLFU = new LfuCache(3);
myLFU.set(1, 1);
console.log(myLFU);
myLFU.set(2, 2);
console.log(myLFU);
myLFU.get(2);
console.log(myLFU);
myLFU.set(3, 3);
myLFU.get(3);
myLFU.get(3);
console.log(myLFU);
myLFU.set(4, 4);
myLFU.get(4);
myLFU.get(4);
myLFU.get(4);
myLFU.set(5, 5);
myLFU.get(5);
myLFU.get(5);
myLFU.get(5);
myLFU.get(5);
myLFU.set(6, 6);
console.log(myLFU);
console.log(myLFU.get(6));
console.log(myLFU);
