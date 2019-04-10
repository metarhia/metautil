'use strict';

const dataSize = data => (data && data.length ? data.length : 0);

class Cache extends Map {
  constructor() {
    super();
    this.allocated = 0;
  }

  // Add key-value pair to cache
  //   key - <string>, key
  //   val - <any>, associated value
  add(key, val) {
    if (this.has(key)) {
      const prev = this.get(key);
      this.allocated -= dataSize(prev);
    }
    this.allocated += dataSize(val);
    this.set(key, val);
  }

  // Delete cache element
  //   key - <string>, key
  del(key) {
    if (this.has(key)) {
      const val = this.get(key);
      this.allocated -= dataSize(val);
    }
    this.delete(key);
  }

  // Clear cache elements that start with prefix
  // Signature: prefix[, fn]
  //   prefix - <string>, to compare with beginning of the key
  //   fn - <Function>, (optional)
  //     key - <string>, key
  //     val - <any>, associative value to be called on each key
  clr(prefix, fn) {
    this.forEach((val, key) => {
      if (key.startsWith(prefix)) {
        this.allocated -= dataSize(val);
        this.delete(key);
        if (fn) fn(key, val);
      }
    });
  }
}

// Create Cache, enhanced Map
// Returns: <Cache>
const cache = () => new Cache();

module.exports = {
  cache,
  Cache,
};
