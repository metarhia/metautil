'use strict';

const crypto = require('crypto');

const math = require('./math');
const { ALPHA_DIGIT } = require('./strings');

// Generate random key
//   length - <number>, key length
//   possible - <string>, with possible characters
// Returns: <string>, key
const generateKey = (length, possible) => {
  const base = possible.length;
  let key = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(math.cryptoRandom() * base);
    key += possible[index];
  }
  return key;
};

// Generate file storage key
// Returns: <string[]>, [folder1, folder2, code]
const generateStorageKey = () => {
  const folder1 = generateKey(2, ALPHA_DIGIT);
  const folder2 = generateKey(2, ALPHA_DIGIT);
  const code = generateKey(8, ALPHA_DIGIT);
  return [folder1, folder2, code];
};

const guidPrefetcher = math.cryptoPrefetcher(4096, 16);

// Generate an RFC4122-compliant GUID (UUID v4)
// Returns: <string>, GUID
const generateGUID = () => {
  const bytes = guidPrefetcher.next();

  bytes[6] &= 0x0f;
  bytes[6] |= 0x40;
  bytes[8] &= 0x3f;
  bytes[8] |= 0x80;

  return [
    bytes.toString('hex', 0, 4),
    bytes.toString('hex', 4, 6),
    bytes.toString('hex', 6, 8),
    bytes.toString('hex', 8, 10),
    bytes.toString('hex', 10, 16),
  ].join('-');
};

// Calculate Token crc
//   secret <string>
//   key <string>
// Returns: <string>, crc
const crcToken = (secret, key) =>
  crypto
    .createHash('md5')
    .update(key + secret)
    .digest('hex')
    .substring(0, 4);

// Generate random Token
//   secret <string>
//   characters <string>
//   length <number>
// Returns: <string>, token
const generateToken = (secret, characters, length) => {
  const key = generateKey(length - 4, characters);
  return key + crcToken(secret, key);
};

// Validate Token
//   secret <string>
//   token <string>
// Returns: <boolean>
const validateToken = (secret, token) => {
  if (!token) return false;
  const len = token.length;
  const crc = token.slice(len - 4);
  const key = token.slice(0, -4);
  return crcToken(secret, key) === crc;
};

// Calculate hash with salt
//   password - <string>
//   salt - <string>
// Returns: <string>, hash
const hash = (password, salt) =>
  crypto
    .createHmac('sha512', salt)
    .update(password)
    .digest('hex');

// Validate hash
//   hashValue - <string>
//   password - <string>
//   salt - <string>
// Returns: <boolean>
const validateHash = (hashValue, password, salt) =>
  hash(password, salt) === hashValue;

// Convert id to array of hex strings
//   id - <number>
// Returns: <Array>, minimal length is 2
//          which contains hex strings with length of 4
const idToChunks = id => {
  let hex = id.toString(16);
  const remainder = hex.length % 4;
  if (remainder !== 0) {
    hex = hex.padStart(hex.length + 4 - remainder, '0');
  }
  let count = hex.length / 4;
  if (count === 1) {
    hex = '0000' + hex;
    count++;
  }
  const chunks = new Array(count);
  for (let i = 0; i < count; i++) {
    const chunk = hex.substr((i + 1) * -4, 4);
    chunks[i] = chunk;
  }
  return chunks;
};

// Convert id to file path
//   id - <number>
// Returns: <string>
const idToPath = id => {
  const chunks = idToChunks(id);
  const path = chunks.join('/');
  return path;
};

// Convert file path to id
//   path - <string>
// Returns: <number>
const pathToId = path => {
  const chunks = path.split('/');
  let hex = '0x';
  for (let i = chunks.length - 1; i >= 0; i--) {
    hex += chunks[i];
  }
  return parseInt(hex, 16);
};

module.exports = {
  generateKey,
  generateGUID,
  generateToken,
  crcToken,
  validateToken,
  hash,
  validateHash,
  generateStorageKey,
  idToChunks,
  idToPath,
  pathToId,
};
