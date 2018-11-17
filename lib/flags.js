'use strict';

const { Uint64 } = require('./uint64');

const masks = [];
const masksNot = [];
for (let i = 0; i < 64; i++) {
  const mask = new Uint64(1).shiftLeft(i);
  masks.push(mask);
  masksNot.push(Uint64.not(mask));
}

const getErrorMsg = key => `Flags instance does not have key ${key}`;

class Flags {
  static from(...args) {
    if (args.length > 64) {
      throw new TypeError('Flags does not support more than 64 values');
    }
    const values = new Map(args.map((v, i) => [v, i]));

    class FlagsClass {
      static from(...args) {
        return new FlagsClass(...args);
      }

      constructor(...args) {
        if (args[0] instanceof Uint64) {
          this.value = new Uint64(args[0]);
        } else {
          this.value = new Uint64(0);
          args.forEach(arg => this.set(arg));
        }
      }

      static has(key) {
        return values.has(key);
      }

      get(key) {
        const value = values.get(key);
        if (value === undefined) {
          throw new TypeError(getErrorMsg(key));
        }
        return (Uint64.shiftRight(this.value, value).toUint32() & 0x1) === 1;
      }

      set(key) {
        const value = values.get(key);
        if (value === undefined) {
          throw new TypeError(getErrorMsg(key));
        }
        this.value.or(masks[value]);
      }

      unset(key) {
        const value = values.get(key);
        if (value === undefined) {
          throw new TypeError(getErrorMsg(key));
        }
        this.value.and(masksNot[value]);
      }

      toggle(key) {
        const value = values.get(key);
        if (value === undefined) {
          throw new TypeError(getErrorMsg(key));
        }
        this.value.xor(masks[value]);
      }

      toString() {
        const str = this.value.toString(2);
        return '0'.repeat(values.size - str.length) + str;
      }

      toNumber() {
        return new Uint64(this.value);
      }

      [Symbol.toPrimitive]() {
        return this.value.toUint32();
      }
    }
    return FlagsClass;
  }
}

module.exports = { Flags };
