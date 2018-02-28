'use strict';

const crypto = require('crypto');

const random = (
  // Generate random int in given range
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

const UINT32_MAX = 0xFFFFFFFF;

const cryptoRandom = (
  // Generate random number in the range from 0 inclusive up to
  // but not including 1 (same as Math.random),
  // but use crypto-secure number generator.
) => crypto.randomBytes(4).readUInt32LE(0, true) / (UINT32_MAX + 1);

module.exports = {
  random,
  cryptoRandom,
};
