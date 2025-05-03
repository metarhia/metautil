'use strict';

class Record {
  static immutable(defaults) {
    return Record.#build(defaults, false);
  }

  static mutable(defaults) {
    return Record.#build(defaults, true);
  }

  static #build(defaults, isMutable) {
    const fields = Object.keys(defaults);
    const defaultValues = Object.create(null);
    for (const key of fields) {
      defaultValues[key] = defaults[key];
    }

    class Struct {
      static fields = fields;
      static defaults = defaultValues;
      static mutable = isMutable;

      static create(data = {}) {
        const obj = Object.create(null);

        for (const key of fields) {
          const base = defaultValues[key];
          const value = key in data ? data[key] : base;

          if (!Record.#sameType(base, value)) {
            const exp = Record.#typeof(base);
            const act = Record.#typeof(value);
            throw new TypeError(
              `Invalid type for "${key}": expected ${exp}, got ${act}`
            );
          }

          obj[key] = value;
        }

        return isMutable ? Object.seal(obj) : Object.freeze(obj);
      }
    }

    return Struct;
  }

  static #typeof(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
  }

  static #sameType(a, b) {
    if (Array.isArray(a)) return Array.isArray(b);
    if (a === null) return b === null;
    return typeof a === typeof b;
  }

  static #validate(instance, updates) {
    for (const key of Object.keys(updates)) {
      if (!Reflect.has(instance, key)) continue;
      const current = instance[key];
      const next = updates[key];
      if (!Record.#sameType(current, next)) {
        const exp = Record.#typeof(current);
        const act = Record.#typeof(next);
        throw new TypeError(
          `Invalid type for "${key}": expected ${exp}, got ${act}`
        );
      }
    }
  }

  static update(instance, updates) {
    if (Object.isFrozen(instance)) {
      throw new Error('Cannot mutate immutable Record');
    }
    Record.#validate(instance, updates);
    for (const key of Object.keys(updates)) {
      if (Reflect.has(instance, key)) {
        instance[key] = updates[key];
      }
    }
    return instance;
  }

  static fork(instance, updates) {
    Record.#validate(instance, updates);
    const obj = Object.create(null);
    for (const key of Object.keys(instance)) {
      obj[key] = Reflect.has(updates, key)
        ? updates[key]
        : instance[key];
    }
    return Object.isFrozen(instance)
      ? Object.freeze(obj)
      : Object.seal(obj);
  }

  static branch(instance, updates) {
    Record.#validate(instance, updates);
    const obj = Object.create(instance);
    for (const key of Object.keys(updates)) {
      Reflect.defineProperty(obj, key, {
        value: updates[key],
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    return Object.isFrozen(instance)
      ? Object.freeze(obj)
      : Object.seal(obj);
  }
}

module.exports = { Record };
