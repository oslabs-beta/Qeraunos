const LfuCache = require('../caching/LFU-caching2');

describe('LFU caching test', () => {
  let newLFU;

  beforeEach((done) => {
    newLFU = new LfuCache(3);
    done();
  });

  it('sets a new node within the cache', () => {
    // const newLFU = new LfuCache(3);
    newLFU.set(1, 1);
    expect([newLFU.keys[1].key, newLFU.keys[1].value]).toEqual([1, 1]);
  });

  it('gets the correct value at the key', () => {
    newLFU.set(2, 2);
    newLFU.get(2);
    expect(newLFU.keys[2].value).toEqual(2);
  });

  it('it removes the least frequently used value when capacity is full', () => {
    for (let i = 0; i < 3; i++) {
      newLFU.set(i, i);
      if (i === 0) continue;
      newLFU.set(i, i);
    }
    const deleteNode = newLFU.set(3, 3);
    expect(deleteNode.value).toBe(0);
  });

  it('it removes the tail out of the least frequently used linked list when capacity is full', () => {
    for (let i = 1; i < 4; i++) {
      newLFU.set(i, i);
      if (i < 3) continue;
      newLFU.set(i, i);
    }
    const deleteNode = newLFU.set(4, 4);
    expect(deleteNode.value).toBe(1);
  });
});
