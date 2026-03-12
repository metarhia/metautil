'use strict';

const UINT32_MAX = 0xffffffff;
const BUF_LEN = 1024;
const BUF_SIZE = BUF_LEN * Uint32Array.BYTES_PER_ELEMENT;

const randomPrefetcher = {
  buf: new Uint8Array(BUF_SIZE),
  view: null,
  pos: 0,
  next() {
    const { buf, view, pos } = this;
    let start = pos;
    if (start === buf.length) {
      start = 0;
      crypto.getRandomValues(buf);
    }
    const rnd = view.getUint32(start, true) / (UINT32_MAX + 1);
    this.pos = start + Uint32Array.BYTES_PER_ELEMENT;
    return rnd;
  },
};

crypto.getRandomValues(randomPrefetcher.buf);
randomPrefetcher.view = new DataView(
  randomPrefetcher.buf.buffer,
  randomPrefetcher.buf.byteOffset,
  randomPrefetcher.buf.byteLength,
);

const cryptoRandom = (min, max) => {
  const rnd = randomPrefetcher.next();
  if (min === undefined) return rnd;
  const [a, b] = max === undefined ? [0, min] : [min, max];
  return a + Math.floor(rnd * (b - a + 1));
};

const random = (min, max) => {
  const rnd = Math.random();
  if (min === undefined) return rnd;
  const [a, b] = max === undefined ? [0, min] : [min, max];
  return a + Math.floor(rnd * (b - a + 1));
};

const generateUUID = () => crypto.randomUUID();

const generateKey = (possible, length) => {
  if (length < 0) return '';
  const base = possible.length;
  if (base < 1) return '';
  const key = new Uint8Array(length);
  const limit = 256 - (256 % base);
  const batch = new Uint8Array(length + 16);
  let pos = 0;
  while (pos < length) {
    crypto.getRandomValues(batch);
    for (let j = 0; j < batch.length; j++) {
      const value = batch[j];
      if (value >= limit) continue;
      key[pos++] = possible.charCodeAt(value % base);
      if (pos === length) break;
    }
  }
  return String.fromCharCode.apply(null, key);
};

module.exports = {
  cryptoRandom,
  random,
  generateUUID,
  generateKey,
};
