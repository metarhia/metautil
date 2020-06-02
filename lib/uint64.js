'use strict';

// The value is assigned at the end of the file to avoid the circular reference.
let Int64 = null;

const UINT32_MAX = 0xffffffff;

const charToNum = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15,
};

const radixStr = {
  '0x': 16,
  '0o': 8,
  '0b': 2,
};

class Uint64 {
  constructor(value) {
    this.value = new Uint32Array(2);
    if (value instanceof Uint64 || value instanceof Int64) {
      this.value[0] = value.value[0];
      this.value[1] = value.value[1];
      return;
    }
    const numValue = Number(value);
    if (Number.isNaN(numValue) || numValue <= 0) {
      return;
    }
    if (numValue <= UINT32_MAX) {
      this.value[0] = numValue;
    } else if (numValue <= Number.MAX_SAFE_INTEGER) {
      this.value[0] = numValue % (UINT32_MAX + 1);
      this.value[1] = Math.floor(numValue / (UINT32_MAX + 1));
    } else if (typeof value === 'string') {
      const radix = radixStr[value.slice(0, 2)] || 10;
      const uintRadix = new Uint64(radix);
      let res = new Uint64();
      for (let i = radix !== 10 ? 2 : 0; i < value.length; i++) {
        const digit = charToNum[value[i]];
        const uintDigit = new Uint64(digit);
        res = Uint64.mult(res, uintRadix).add(uintDigit);
      }
      this.value[0] = res.value[0];
      this.value[1] = res.value[1];
    }
  }

  toUint32() {
    return this.value[0];
  }

  static add(a, b) {
    return new Uint64(a).add(b);
  }

  add(b) {
    const tmp = this.value[0] + b.value[0];
    this.value[0] = tmp;
    this.value[1] += b.value[1] + Math.floor(tmp / (UINT32_MAX + 1));
    return this;
  }

  static sub(a, b) {
    return new Uint64(a).sub(b);
  }

  sub(b) {
    if (b.value[0] > this.value[0]) {
      this.value[1]--;
      this.value[0] = ~this.value[0] + 1;
    }
    this.value[0] -= b.value[0];
    this.value[1] -= b.value[1];
    return this;
  }

  static mult(a, b) {
    const result = new Uint64();
    let value = b.value[0];
    let bitIndex = 0;
    while (value) {
      if (value & 1) {
        result.add(Uint64.shiftLeft(a, bitIndex));
      }
      bitIndex++;
      value >>>= 1;
    }
    value = b.value[1];
    bitIndex = 32;
    while (value) {
      if (value & 1) {
        result.add(Uint64.shiftLeft(a, bitIndex));
      }
      bitIndex++;
      value >>>= 1;
    }
    return result;
  }

  static cmp(a, b) {
    if (a.value[1] > b.value[1]) {
      return 1;
    } else if (a.value[1] < b.value[1]) {
      return -1;
    } else if (a.value[0] === b.value[0]) {
      return 0;
    }
    return a.value[0] > b.value[0] ? 1 : -1;
  }

  // #private
  static _division(n, d) {
    const zero = new Uint64();
    const one = new Uint64(1);
    if (Uint64.cmp(d, zero) === 0) {
      throw new RangeError('Uint64: division by zero');
    }
    const cmp = Uint64.cmp(d, n);
    if (cmp > 0) return [zero, n];
    else if (cmp === 0) return [one, zero];

    const q = new Uint64();
    const r = new Uint64();
    for (let i = 63; i >= 0; i--) {
      r.shiftLeft(1);
      const valIndex = i >>> 5;
      const nval = n.value[valIndex];
      const ii = i < 32 ? i : i - 32;
      r.value[0] = (r.value[0] & ~1) | ((nval & (1 << ii)) >>> ii);
      if (Uint64.cmp(r, d) >= 0) {
        r.sub(d);
        q.value[valIndex] |= 1 << ii;
      }
    }
    return [q, r];
  }

  static div(a, b) {
    return Uint64._division(a, b)[0];
  }

  static mod(a, b) {
    return Uint64._division(a, b)[1];
  }

  static and(a, b) {
    return new Uint64(a).and(b);
  }

  and(b) {
    this.value[0] &= b.value[0];
    this.value[1] &= b.value[1];
    return this;
  }

  static or(a, b) {
    return new Uint64(a).or(b);
  }

  or(b) {
    this.value[0] |= b.value[0];
    this.value[1] |= b.value[1];
    return this;
  }

  static not(a) {
    return new Uint64(a).not();
  }

  not() {
    this.value[0] = ~this.value[0];
    this.value[1] = ~this.value[1];
    return this;
  }

  static xor(a, b) {
    return new Uint64(a).xor(b);
  }

  xor(b) {
    this.value[0] ^= b.value[0];
    this.value[1] ^= b.value[1];
    return this;
  }

  static shiftRight(a, b) {
    return new Uint64(a).shiftRight(b);
  }

  shiftRight(b) {
    b %= 64;
    if (b >= 32) {
      this.value[0] = this.value[1] >>> (b - 32);
      this.value[1] = 0;
      return this;
    }
    const mask = (1 << b) - 1;
    const tr = (this.value[1] & mask) << (32 - b);
    this.value[1] >>>= b;
    this.value[0] = (this.value[0] >>> b) | tr;
    return this;
  }

  static shiftLeft(a, b) {
    return new Uint64(a).shiftLeft(b);
  }

  shiftLeft(b) {
    b %= 64;
    if (b >= 32) {
      this.value[1] = this.value[0] << (b - 32);
      this.value[0] = 0;
      return this;
    }
    const mask = ((1 << b) - 1) << (32 - b);
    const tr = (this.value[0] & mask) >>> (32 - b);
    this.value[0] <<= b;
    this.value[1] = (this.value[1] << b) | tr;
    return this;
  }

  inc() {
    return this.add(new Uint64(1));
  }

  dec() {
    return this.sub(new Uint64(1));
  }

  toString(radix = 10) {
    if (radix < 2 || radix > 36) {
      throw new RangeError(
        'toString() radix argument must be between 2 and 36'
      );
    }
    const digitStr = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    if (radix === 2 || radix === 16) {
      let value = this.value[0];
      while (value !== 0) {
        result = digitStr[value % radix] + result;
        value = Math.floor(value / radix);
      }
      value = this.value[1];
      if (value !== 0) {
        const pad =
          radix === 2 ? '00000000000000000000000000000000' : '00000000';
        result = (pad + result).slice(-pad.length);
      }
      while (value !== 0) {
        result = digitStr[value % radix] + result;
        value = Math.floor(value / radix);
      }
      if (result.length === 0) {
        result = '0';
      }
      return result;
    }

    const zero = new Uint64();
    let value = new Uint64(this);
    const uintRadix = new Uint64(radix);
    while (Uint64.cmp(value, zero) !== 0) {
      const digit = Uint64.mod(value, uintRadix).value[0];
      result = digitStr[digit] + result;
      value = Uint64.div(value, uintRadix);
    }
    if (result.length === 0) {
      result = '0';
    }
    return result;
  }

  toJSON() {
    return this.toString();
  }

  toPostgres() {
    return new Int64(this);
  }
}

module.exports = { Uint64 };

({ Int64 } = require('./int64'));
