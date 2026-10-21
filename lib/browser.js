'use strict';

const UINT32_MAX = 0xffffffff;
const BUF_LEN = 1024;
const BUF_SIZE = BUF_LEN * Uint32Array.BYTES_PER_ELEMENT;

const randomBuffer = crypto.getRandomValues(new Uint8Array(BUF_SIZE));

const randomPrefetcher = {
  buf: randomBuffer,
  view: new DataView(
    randomBuffer.buffer,
    randomBuffer.byteOffset,
    randomBuffer.byteLength,
  ),
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

const toRange = (rnd, min, max) => {
  if (min === undefined) return rnd;
  const hasMax = max !== undefined;
  const a = hasMax ? min : 0;
  const b = hasMax ? max : min;
  return a + Math.floor(rnd * (b - a + 1));
};

const cryptoRandom = (min, max) => {
  const rnd = randomPrefetcher.next();
  return toRange(rnd, min, max);
};

const random = (min, max) => {
  const rnd = Math.random();
  return toRange(rnd, min, max);
};

const generateUUID = () => crypto.randomUUID();

const latin1Decoder = new TextDecoder('latin1');

const generateKey = (possible, length) => {
  if (length < 0) return '';
  const base = possible.length;
  if (base < 1) return '';
  const key = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const index = cryptoRandom(0, base - 1);
    key[i] = possible.charCodeAt(index);
  }
  return latin1Decoder.decode(key);
};

module.exports = {
  cryptoRandom,
  random,
  generateUUID,
  generateKey,
};
