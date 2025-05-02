'use strict';

class Record {
  static immutable(fields) {
    return Record.#build(fields, false);
  }

  static mutable(fields) {
    return Record.#build(fields, true);
  }

  static #build(fields, isMutable) {
    class Struct {
      static fields = fields.slice();
      static mutable = isMutable;

      static create(...values) {
        if (fields.length !== values.length) {
          throw new Error('Record arity mismatch');
        }
        const obj = Object.create(null);
        for (let i = 0; i < fields.length; i++) {
          obj[fields[i]] = values[i];
        }
        return isMutable ? Object.seal(obj) : Object.freeze(obj);
      }
    }
    return Struct;
  }

  static update(instance, updates) {
    if (Object.isFrozen(instance)) {
      throw new Error('Cannot mutate immutable Record');
    }
    for (const key of Object.keys(updates)) {
      if (Reflect.has(instance, key)) {
        instance[key] = updates[key];
      }
    }
    return instance;
  }

  static fork(instance, updates) {
    const copy = Object.create(null);
    for (const key of Object.keys(instance)) {
      copy[key] = Reflect.has(updates, key) ? updates[key] : instance[key];
    }
    return Object.isFrozen(instance) ? Object.freeze(copy) : Object.seal(copy);
  }

  static branch(instance, updates) {
    const branched = Object.create(instance);
    for (const key of Object.keys(updates)) {
      Object.defineProperty(branched, key, {
        value: updates[key],
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    return Object.isFrozen(instance)
      ? Object.freeze(branched)
      : Object.seal(branched);
  }
}

module.exports = { Record };
