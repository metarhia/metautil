'use strict';

const withClear = (
  cache // mixin to this Map
) => {

  cache.add = cache.set;

  cache.del = cache.delete;

  cache.clr = (
    prefix, // string to compare with key start
    fn // listener function `(key)` on delete key
  ) => {
    let key;
    for (key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key);
        if (fn) fn(key);
      }
    }
  };

};

const withSize = (
  cache // mixin to this Map
) => {

  cache.allocated = 0;

  const dataSize = data => (data && data.length ? data.length : 0);

  cache.add = (key, val) => {
    if (cache.has(key)) {
      const prev = cache.get(key);
      cache.allocated -= dataSize(prev);
    }
    cache.allocated += dataSize(val);
    cache.set(key, val);
  };

  cache.del = (key) => {
    if (cache.has(key)) {
      const val = cache.get(key);
      cache.allocated -= dataSize(val);
    }
  };

  cache.clr = (
    prefix, // string to compare with key start
    fn // function `(key, val)` to be called on each key (optional)
  ) => {
    cache.forEach((val, key) => {
      if (key.startsWith(prefix)) {
        cache.allocated -= dataSize(val);
        cache.delete(key);
        if (fn) fn(key, val);
      }
    });
  };

};

const cache = (
  // Extend Map interface total allocated size: map.allocated
  options // { calcSize }
) => {
  const cache = new Map();
  const calcSize = (options && options.calcSize) || false;

  if (calcSize) withSize(cache);
  else withClear(cache);

  return cache;
};

module.exports = {
  cache
};
