'use strict';

const NaE = Symbol('NotAnEnum');

// Static properties:
//   NaE <Symbol> Not an Enum
class Enum {
  static from(...args) {
    let values = args[0];
    if (typeof values !== 'object') {
      values = args;
    }
    const enumValues = new Map();
    const EnumClass = class extends Enum {
      static from(val) {
        return enumValues.get(val) || Enum.NaE;
      }
      static get values() {
        return values;
      }
      static has(value) {
        return enumValues.has(value);
      }
      static key(value) {
        const e = enumValues.get(value);
        return e ? e.index : undefined;
      }
      [Symbol.toPrimitive]() {
        return this.index;
      }
    };
    const withData = !Array.isArray(values);
    let i = 0;
    for (const key in values) {
      const e = new EnumClass();
      e.index = i++;
      if (withData) {
        e.value = key;
        e.data = values[key];
      } else {
        e.value = values[key];
      }
      enumValues.set(e.value, e);
    }
    return EnumClass;
  }
}

Object.defineProperty(Enum, 'NaE', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NaE,
});

module.exports = { Enum };
