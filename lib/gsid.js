'use strict';

const crypto = require('node:crypto');

const DIGITS = '0123456789';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARS = DIGITS + LOWER + UPPER + '-_';
const CHARS_LENGTH = CHARS.length;

const POSSIBLE = new Uint8Array(256);
for (let i = 0; i < CHARS_LENGTH; i++) {
  const char = CHARS.charCodeAt(i);
  POSSIBLE[i] = char;
  POSSIBLE[i + 64] = char;
  POSSIBLE[i + 128] = char;
  POSSIBLE[i + 192] = char;
}

const DEFAULT_LENGTH = 24;
const BUF_SIZE = DEFAULT_LENGTH * 4096;

const randomBuffer = crypto.randomBytes(BUF_SIZE);
const resultBuffer = [];
resultBuffer[DEFAULT_LENGTH] = Buffer.allocUnsafe(DEFAULT_LENGTH);

let bufferPos = 0;

const generateId = ({ length = DEFAULT_LENGTH } = {}) => {
  if (length < 1 || length > 256) {
    throw new Error(`Incorrect GSID length ${length} (expected 1..256)`);
  }
  let result = resultBuffer[length];
  if (!result) {
    result = Buffer.allocUnsafe(length);
    resultBuffer[length] = result;
  }
  if (bufferPos + length > randomBuffer.length) {
    crypto.randomFillSync(randomBuffer);
    bufferPos = 0;
  }
  const start = bufferPos;
  bufferPos += length;
  for (let i = 0; i < length; i++) {
    result[i] = POSSIBLE[randomBuffer[start + i]];
  }
  return result.toString('ascii');
};

module.exports = { generateId };
