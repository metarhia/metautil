'use strict';

const typeOf = (value) => {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
};

class Struct {
  static immutable(defaults) {
    return Struct.#build(defaults, false);
  }

  static mutable(defaults) {
    return Struct.#build(defaults, true);
  }

  static #build(defaults, isMutable) {
    const fields = Object.keys(defaults);
    const schema = Object.create(null);
    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      schema[key] = typeOf(defaults[key]);
    }
    Object.freeze(schema);

    class Entity {
      static fields = fields.slice();
      static schema = schema;
      static mutable = isMutable;

      constructor(data = {}) {
        Entity.#validate(data);
        for (let i = 0; i < fields.length; i++) {
          const key = fields[i];
          this[key] = key in data ? data[key] : defaults[key];
        }
        if (isMutable) Object.seal(this);
        else Object.freeze(this);
      }

      static create(data) {
        return new Entity(data);
      }

      static #validate(data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const expected = schema[key];
          if (!expected) {
            throw new TypeError(`Unknown field "${key}"`);
          }
          const actual = typeOf(data[key]);
          if (actual !== expected) {
            throw new TypeError(
              `Invalid type for "${key}": expected ${expected}, got ${actual}`,
            );
          }
        }
      }

      update(updates) {
        if (!isMutable) {
          throw new Error('Cannot update immutable Struct, use fork or branch');
        }
        Entity.#validate(updates);
        return Object.assign(this, updates);
      }

      fork(updates = {}) {
        return new Entity({ ...this.toObject(), ...updates });
      }

      branch(updates = {}) {
        Entity.#validate(updates);
        const obj = Object.create(this);
        const keys = Object.keys(updates);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          Reflect.defineProperty(obj, key, {
            value: updates[key],
            writable: isMutable,
            configurable: false,
            enumerable: true,
          });
        }
        return isMutable ? Object.seal(obj) : Object.freeze(obj);
      }

      toObject() {
        const obj = {};
        for (let i = 0; i < fields.length; i++) {
          const key = fields[i];
          obj[key] = this[key];
        }
        return obj;
      }
    }

    return Entity;
  }
}

module.exports = { Struct };
