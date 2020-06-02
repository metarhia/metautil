'use strict';

// The value is assigned at the end of the file to avoid the circular reference.
let Uint64 = null;

const INT32_MAX = 0x7fffffff;
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

class Int64 {
  constructor(value) {
    this.value = new Uint32Array(2);
    if (value instanceof Int64 || value instanceof Uint64) {
      this.value[0] = value.value[0];
      this.value[1] = value.value[1];
      return;
    }
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return;
    if (numValue >= 0 && numValue <= UINT32_MAX) {
      this.value[0] = numValue;
    } else if (numValue >= -INT32_MAX && numValue < 0) {
      this.value[0] = numValue;
      this.value[1] = UINT32_MAX;
    } else if (numValue >= 0 && numValue <= Number.MAX_SAFE_INTEGER) {
      this.value[0] = numValue % (UINT32_MAX + 1);
      this.value[1] = Math.floor(numValue / (UINT32_MAX + 1));
    } else if (numValue >= Number.MIN_SAFE_INTEGER && numValue < 0) {
      this.value[0] = -numValue % (UINT32_MAX + 1);
      this.value[1] = Math.floor(-numValue / (UINT32_MAX + 1));
      this.value = Int64._conversion(this.value);
    } else if (typeof value === 'string') {
      const negative = value.startsWith('-');
      if (negative) value = value.slice(1);

      let radix = 10;
      if (value.startsWith('0x')) {
        radix = 16;
      } else if (value.startsWith('0o')) {
        radix = 8;
      } else if (value.startsWith('0b')) {
        radix = 2;
      }
      if (radix !== 10) value = value.slice(2);
      const intRadix = new Int64(radix);
      let res = Int64.zero();
      for (let i = 0; i < value.length; i++) {
        const digit = charToNum[value[i]];
        const intDigit = new Int64(digit);
        res = Int64.mult(res, intRadix);
        if (negative) res.sub(intDigit);
        else res.add(intDigit);
      }
      this.value[0] = res.value[0];
      this.value[1] = res.value[1];
    }
  }

  toInt32() {
    return this.value[0] >> 0;
  }

  toUint32() {
    return this.value[0];
  }

  static zero() {
    return new Int64(0);
  }

  static one() {
    return new Int64(1);
  }

  // #private
  // Convert signed to 2's complement representation and vise versa
  static _conversion(value) {
    const result = new Uint32Array(value);
    let pos = 0;
    if (result[0] === 0) {
      while (pos < 32 && ((result[1] >>> pos) & 1) === 0) {
        pos++;
      }
      if (pos !== 31) {
        const mask = (1 << (pos + 1)) - 1;
        result[1] = ~(result[1] | mask) | (result[1] & mask);
      }
    } else {
      while (pos < 32 && ((result[0] >>> pos) & 1) === 0) {
        pos++;
      }
      if (pos !== 31) {
        const mask = (1 << (pos + 1)) - 1;
        result[0] = ~(result[0] | mask) | (result[0] & mask);
      }
      result[1] = ~result[1];
    }
    return result;
  }

  add(b) {
    if (b.value[0] === 0 && b.value[1] === 0) return this;
    const tmp = this.value[0] + b.value[0];
    this.value[0] = tmp;
    this.value[1] += b.value[1] + (tmp > UINT32_MAX ? 1 : 0);
    return this;
  }

  static add(a, b) {
    return new Int64(a).add(b);
  }

  sub(b) {
    if (b.value[0] === 0 && b.value[1] === 0) return this;
    const value = Int64._conversion(b.value);
    const tmp = this.value[0] + value[0];
    this.value[0] = tmp;
    this.value[1] += value[1] + (tmp > UINT32_MAX ? 1 : 0);
    return this;
  }

  static sub(a, b) {
    return new Int64(a).sub(b);
  }

  static cmp(a, b) {
    const aSign = a.value[1] >>> 31;
    const bSign = b.value[1] >>> 31;
    if (aSign !== bSign) return aSign === 1 ? -1 : 1;

    if (a.value[1] > b.value[1]) return 1;
    if (a.value[1] < b.value[1]) return -1;
    if (a.value[0] === b.value[0]) return 0;
    return a.value[0] > b.value[0] ? 1 : -1;
  }

  // #private
  static _division(n, d) {
    const zero = Int64.zero();
    const one = Int64.one();
    if (Int64.cmp(d, zero) === 0) {
      throw new RangeError('Int64: division by zero');
    }
    if (Int64.cmp(n, zero) === 0) return [zero, 0];
    if (Int64.cmp(d, one) === 0) return [n, zero];
    if (Int64.cmp(d, n) === 0) return [one, zero];

    const nSign = n.value[1] >>> 31;
    let value = new Uint32Array(n.value);
    if (nSign) value = Int64._conversion(value);
    const dSign = d.value[1] >>> 31;
    const dPositive = new Int64(d);
    if (dSign) dPositive.value = Int64._conversion(dPositive.value);

    const q = Int64.zero();
    const r = Int64.zero();
    for (let i = 63; i >= 0; i--) {
      r.shiftLeft(1);
      const valIndex = i >>> 5;
      const nval = value[valIndex];
      const ii = i < 32 ? i : i - 32;
      r.value[0] = (r.value[0] & ~1) | ((nval & (1 << ii)) >>> ii);
      if (Int64.cmp(r, dPositive) >= 0) {
        r.sub(dPositive);
        q.value[valIndex] |= 1 << ii;
      }
    }
    q.value[1] &= INT32_MAX;
    r.value[1] &= INT32_MAX;
    if (nSign ^ dSign) q.value = Int64._conversion(q.value);
    if (nSign) r.value = Int64._conversion(r.value);
    return [q, r];
  }

  static div(a, b) {
    return Int64._division(a, b)[0];
  }

  static mod(a, b) {
    return Int64._division(a, b)[1];
  }

  static mult(a, b) {
    const zero = Int64.zero();
    const one = Int64.one();
    if (Int64.cmp(a, zero) === 0 || Int64.cmp(b, zero) === 0) return zero;
    if (Int64.cmp(a, one) === 0) return new Int64(b);
    if (Int64.cmp(b, one) === 0) return new Int64(a);

    const aSign = a.value[1] >>> 31;
    const bSign = b.value[1] >>> 31;
    const result = Int64.zero();
    const aPositive = new Int64(a);
    let value = new Uint32Array(b.value);
    if (aSign) aPositive.value = Int64._conversion(aPositive.value);
    if (bSign) value = Int64._conversion(value);

    for (let i = 0; i < 63; i++) {
      const valIndex = i >= 32 ? 1 : 0;
      if (value[valIndex] & 1) {
        result.add(new Int64(aPositive).shiftLeft(i));
      }
      value[valIndex] >>>= 1;
    }
    if (aSign ^ bSign) result.value = Int64._conversion(result.value);
    return result;
  }

  and(b) {
    this.value[0] &= b.value[0];
    this.value[1] &= b.value[1];
    return this;
  }

  static and(a, b) {
    return new Int64(a).and(b);
  }

  or(b) {
    this.value[0] |= b.value[0];
    this.value[1] |= b.value[1];
    return this;
  }

  static or(a, b) {
    return new Int64(a).or(b);
  }

  not() {
    this.value[0] = ~this.value[0];
    this.value[1] = ~this.value[1];
    return this;
  }

  static not(a) {
    return new Int64(a).not();
  }

  xor(b) {
    this.value[0] ^= b.value[0];
    this.value[1] ^= b.value[1];
    return this;
  }

  static xor(a, b) {
    return new Int64(a).xor(b);
  }

  shiftRightLogical(b) {
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

  shiftRightArithmetic(b) {
    b %= 64;
    const negative = this.value[1] >>> 31;
    if (b >= 32) {
      this.value[0] = this.value[1] >>> (b - 32);
      if (negative) {
        const mask = (1 << b) - 1;
        this.value[0] |= mask << (32 - b);
        this.value[1] = 0xffffffff;
      } else {
        this.value[1] = 0;
      }
    } else {
      const mask = (1 << b) - 1;
      const tr = (this.value[1] & mask) << (32 - b);
      this.value[0] = (this.value[0] >>> b) | tr;
      this.value[1] >>= b;
    }
    return this;
  }

  shiftRight(b) {
    return this.shiftRightArithmetic(b);
  }

  static shiftRight(a, b) {
    return new Int64(a).shiftRight(b);
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

  static shiftLeft(a, b) {
    return new Int64(a).shiftLeft(b);
  }

  inc() {
    return this.add(Int64.one());
  }

  dec() {
    return this.sub(Int64.one());
  }

  toString(radix = 10) {
    const negative = this.value[1] >>> 31;
    if (radix < 2 || radix > 36) {
      throw new RangeError(
        'toString() radix argument must be between 2 and 36'
      );
    }

    const digitStr = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    if (radix === 2 || radix === 16) {
      const num = new Int64(this);
      if (negative) num.value = Int64._conversion(num.value);
      let value = num.value[0];
      while (value !== 0) {
        result = digitStr[value % radix] + result;
        value = Math.floor(value / radix);
      }
      value = num.value[1];
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
      if (negative) result = '-' + result;
      return result;
    }

    if (negative) {
      const uvalue = new Uint64();
      uvalue.value = Int64._conversion(this.value);
      return '-' + uvalue.toString(radix);
    } else {
      const zero = Int64.zero();
      let value = new Int64(this);
      const uintRadix = new Int64(radix);

      while (Int64.cmp(value, zero) !== 0) {
        const digit = Int64.mod(value, uintRadix).value[0];
        result = digitStr[digit] + result;
        value = Int64.div(value, uintRadix);
      }
      if (result.length === 0) result = '0';
    }
    return result;
  }

  toJSON() {
    return this.toString();
  }

  toPostgres() {
    return this.toString();
  }
}

module.exports = { Int64 };

({ Uint64 } = require('./uint64'));
