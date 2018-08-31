'use strict';

const crypto = require('crypto');

class CryptoRandomPrefetcher {
  constructor(bufSize, valueSize) {
    this.buf = crypto.randomBytes(bufSize);
    this.pos = 0;
    this.vsz = valueSize;
  }

  next(
    // Return Buffer with next `valueSize` random bytes.
  ) {
    if (this.pos === this.buf.length) {
      this.pos = 0;
      crypto.randomFillSync(this.buf);
    }
    const end = this.pos + this.vsz;
    const buf = this.buf.slice(this.pos, end);
    this.pos = end;
    return buf;
  }
}

const cryptoPrefetcher = (
  // Create prefetcher to use when crypto.randomBytes is required to generate
  // multiple same-size values. `bufSize` must be a multiple of `valueSize` for
  // this to work.
  bufSize,   // number, size in bytes of the buffer to preallocate
  valueSize  // number, size in bytes of the produced chunks
) => (new CryptoRandomPrefetcher(bufSize, valueSize));

const random = (
  // Generate random integer value in given range
  min, // number, range start
  max // number, range end
  // Returns: number
) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

const randPrefetcher = cryptoPrefetcher(4096, 4);
const UINT32_MAX = 0xFFFFFFFF;

const cryptoRandom = (
  // Generate random number in the range from 0 inclusive up to
  // but not including 1 (same as Math.random),
  // but use crypto-secure number generator.
  // Returns: number
) => randPrefetcher.next().readUInt32LE(0, true) / (UINT32_MAX + 1);

module.exports = {
  cryptoPrefetcher,
  random,
  cryptoRandom,
};
