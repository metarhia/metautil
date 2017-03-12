'use strict';

module.exports = (api) => {

  api.common.longDivModBE = (
    // Divide a long big endian encoded unsigned integer by a small one
    // (i.e., not longer than a machine word) in-place and return the remainder
    buffer, // Buffer containing a divident
    divisor // a divisor as a Number
    // Return: the remainder (Number)
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

  api.common.generateKey = (
    length, // random key length
    possible // string of possible characters
  ) => {
    const base = possible.length;
    const bitsCount = Math.ceil(Math.log2(Math.pow(base, length + 1) - 1));
    const bytes = api.crypto.randomBytes(Math.ceil(bitsCount / 8));
    let key = '';
    let i, index;
    for (i = 0; i < length; i++) {
      index = api.common.longDivModBE(bytes, base);
      key += possible[index];
    }
    return key;
  };

  api.common.generateGUID = (
    // Generate an RFC4122-compliant GUID (UUID v4)
  ) => {
    const bytes = api.crypto.randomBytes(128);

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

  api.common.generateSID = (
    config // { length, characters, secret }
  ) => {
    const key = api.common.generateKey(
      config.length - 4,
      config.characters
    );
    return key + api.common.crcSID(config, key);
  };

  api.common.crcSID = (
    config, // { length, characters, secret }
    key // key to calculate CRC
  ) => (
    api.crypto
      .createHash('md5')
      .update(key + config.secret)
      .digest('hex')
      .substring(0, 4)
  );

  api.common.validateSID = (
    config, // { length, characters, secret }
    sid // session id string
  ) => {
    if (!sid) return false;
    const crc = sid.substr(sid.length - 4);
    const key = sid.substr(0, sid.length - 4);
    return api.common.crcSID(config, key) === crc;
  };


  api.common.hash = (password, salt) => (
    api.crypto
      .createHmac('sha512', salt)
      .update(password)
      .digest('hex')
  );

  api.common.validateHash = (hash, password, salt) => (
    api.common.hash(password, salt) === hash
  );

};
