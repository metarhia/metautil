'use strict';

const storage = Symbol('storage');

class Pool {
  constructor(factory = null) {
    this.factory = factory;
    this[storage] = [];
  }

  put(value) {
    this[storage].push(value);
  }

  get() {
    if (this[storage].length === 0) {
      return typeof this.factory === 'function' ? this.factory() : null;
    }
    return this[storage].pop();
  }
}

module.exports = { Pool };
