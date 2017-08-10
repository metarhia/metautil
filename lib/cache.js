'use strict';

const util = require('util');

function Cache() {
  const self = new Map();
  Object.setPrototypeOf(self, Cache.prototype);
  self.allocated = 0;
  return self;
}

util.inherits(Cache, Map);

const dataSize = data => (data && data.length ? data.length : 0);

Cache.prototype.add = function(
  // Add key-value pair to cache
  key, // string, key
  val // value, vaule
) {
  if (this.has(key)) {
    const prev = this.get(key);
    this.allocated -= dataSize(prev);
  }
  this.allocated += dataSize(val);
  this.set(key, val);
};

Cache.prototype.del = function(
  // Delete cache element
  key // string, key
) {
  if (this.has(key)) {
    const val = this.get(key);
    this.allocated -= dataSize(val);
  }
  this.delete(key);
};

Cache.prototype.clr = function(
  // Clear cache elements starts with prefix
  prefix, // string, to compare with key start
  fn // function (optional), `(key, val)` to be called on each key
) {
  this.forEach((val, key) => {
    if (key.startsWith(prefix)) {
      this.allocated -= dataSize(val);
      this.delete(key);
      if (fn) fn(key, val);
    }
  });
};

const cache = (
  // Extend Map interface with:
  // `cache.allocated` - total allocated size
  // `cache.add(key, val)` - add record
  // `cache.del(key)` - delete record
  // `cache.clr(prefix, fn)` - delete all if `key.startsWith(prefix)`
  // Returns: object, cache instance
) => (new Cache());

module.exports = {
  cache,
};
