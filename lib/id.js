'use strict';

const crypto = require('crypto');

const math = require('./math');
const { ALPHA_DIGIT } = require('./strings');

const generateKey = (
  // Generate random key
  length, // number, key length
  possible // string, with possible characters
  // Returns: string, key
) => {
  const base = possible.length;
  let key = '';
  let i, index;
  for (i = 0; i < length; i++) {
    index = Math.floor(math.cryptoRandom() * base);
    key += possible[index];
  }
  return key;
};

const generateStorageKey = (
  // Generate file storage key
  // Returns: Array of string, [folder1, folder2, code]
) => {
  const folder1 = generateKey(2, ALPHA_DIGIT);
  const folder2 = generateKey(2, ALPHA_DIGIT);
  const code = generateKey(8, ALPHA_DIGIT);
  return [folder1, folder2, code];
};

const guidPrefetcher = math.cryptoPrefetcher(4096, 16);

const generateGUID = (
  // Generate an RFC4122-compliant GUID (UUID v4)
  // Returns: string, GUID
) => {
  const bytes = guidPrefetcher.next();

  bytes[6] &= 0x0F;
  bytes[6] |= 0x40;
  bytes[8] &= 0x3F;
  bytes[8] |= 0x80;

  return [
    bytes.toString('hex', 0, 4),
    bytes.toString('hex', 4, 6),
    bytes.toString('hex', 6, 8),
    bytes.toString('hex', 8, 10),
    bytes.toString('hex', 10, 16)
  ].join('-');
};

const crcSID = (
  // Calculate SID CRC
  config, // record, { length, characters, secret }
  key // string, SID key
  // Returns: string, CRC
) => (
  crypto
    .createHash('md5')
    .update(key + config.secret)
    .digest('hex')
    .substring(0, 4)
);

const generateSID = (
  // Generate random SID
  config // record, { length, characters, secret }
  // Returns: string, SID
) => {
  const key = generateKey(
    config.length - 4,
    config.characters
  );
  return key + crcSID(config, key);
};

const validateSID = (
  // Validate SID
  config, // record, { length, characters, secret }
  sid // string, session id
  // Returns: boolean
) => {
  if (!sid) return false;
  const crc = sid.substr(sid.length - 4);
  const key = sid.substr(0, sid.length - 4);
  return crcSID(config, key) === crc;
};

const hash = (
  // Calculate hash with salt
  password, // string
  salt // string
  // Returns: string, hash
) => (
  crypto
    .createHmac('sha512', salt)
    .update(password)
    .digest('hex')
);

const validateHash = (
  // Validate hash
  hash, // string
  password, // string
  salt // string
  // Returns: boolean
) => (hash(password, salt) === hash);

module.exports = {
  generateKey,
  generateGUID,
  generateSID,
  crcSID,
  validateSID,
  hash,
  validateHash,
  generateStorageKey,
};
