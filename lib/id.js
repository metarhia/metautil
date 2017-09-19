'use strict';

const crypto = require('crypto');

const { ALPHA_DIGIT } = require('./strings');

const longDivModBE = (
  // Divide a long big endian encoded unsigned integer by a small one
  // (i.e., not longer than a machine word) in-place and return the remainder
  buffer, // Buffer, containing a divident
  divisor // a divisor as a number
  // Returns: number, the remainder
) => {
  if (divisor === 0) {
    throw new Error('Division by zero');
  }
  const bytesCount = Buffer.byteLength(buffer);
  let remainder = 0;
  let i, j, resultByte, byte;
  for (i = 0; i < bytesCount; i++) {
    byte = buffer[i];
    resultByte = 0;
    for (j = 7; j > -1; j--) {
      remainder <<= 1;
      resultByte <<= 1;
      remainder |= (byte & (1 << j)) >> j;
      if (remainder >= divisor) {
        remainder -= divisor;
        resultByte |= 1;
      }
    }
    buffer[i] = resultByte;
  }
  return remainder;
};

const generateKey = (
  // Generate random key
  length, // number, key length
  possible // string, with possible characters
  // Returns: string, key
) => {
  const base = possible.length;
  const bitsCount = Math.ceil(Math.log2(Math.pow(base, length + 1) - 1));
  const bytes = crypto.randomBytes(Math.ceil(bitsCount / 8));
  let key = '';
  let i, index;
  for (i = 0; i < length; i++) {
    index = longDivModBE(bytes, base);
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

const generateGUID = (
  // Generate an RFC4122-compliant GUID (UUID v4)
  // Returns: string, GUID
) => {
  const bytes = crypto.randomBytes(128);

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
  longDivModBE,
  generateKey,
  generateGUID,
  generateSID,
  crcSID,
  validateSID,
  hash,
  validateHash,
  generateStorageKey,
};
