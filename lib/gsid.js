'use strict';

const crypto = require('node:crypto');

const DIGITS = '0123456789';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARS = DIGITS + LOWER + UPPER + '-_';
const CHARS_LENGTH = CHARS.length;

const POSSIBLE = new Uint8Array(CHARS_LENGTH);
for (let i = 0; i < CHARS_LENGTH; i++) {
  POSSIBLE[i] = CHARS[i].charCodeAt(0);
}

const DEFAULT_LENGTH = 24;
const BUF_SIZE = DEFAULT_LENGTH * 1024;

const randomPrefetcher = {
  buf: crypto.randomBytes(BUF_SIZE),
  pos: 0,
  next(length = DEFAULT_LENGTH) {
    const { buf, pos } = this;
    let start = pos;
    if (start + length > buf.length) {
      start = 0;
      crypto.randomFillSync(buf);
    }
    const end = start + length;
    this.pos = end;
    return buf.subarray(start, end);
  },
};

const generateGSID = (n = DEFAULT_LENGTH) => {
  const randomBytes = randomPrefetcher.next(n);
  for (let i = 0; i < n; i++) {
    randomBytes[i] = POSSIBLE[randomBytes[i] & 0x3f];
  }
  return randomBytes.toString();
};

module.exports = { generateGSID };
