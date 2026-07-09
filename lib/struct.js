'use strict';

const typeOf = (value) => {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
};

class Struct {
  static immutable(className, defaults) {
    return Struct.#build(className, defaults, false);
  }

  static mutable(className, defaults) {
    return Struct.#build(className, defaults, true);
  }

  static #build(className, defaults, isMutable) {
    const fields = Object.keys(defaults);
    const schema = Object.create(null);
    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      schema[key] = typeOf(defaults[key]);
    }
    Object.freeze(schema);

    const validate = (data) => {
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
    };

    const { [className]: Entity } = {
      [className]: class {
        static fields = fields.slice();
        static schema = schema;
        static mutable = isMutable;

        constructor(data = {}) {
          validate(data);
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

        update(updates) {
          if (!isMutable) {
            throw new Error(
              'Cannot update immutable Struct, use fork or branch',
            );
          }
          validate(updates);
          return Object.assign(this, updates);
        }

        fork(updates = {}) {
          return new Entity({ ...this.toObject(), ...updates });
        }

        branch(updates = {}) {
          validate(updates);
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
      },
    };

    return Entity;
  }
}

module.exports = { Struct };
