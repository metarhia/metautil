'use strict';

const crypto = require('crypto');

const UINT32_MAX = 0xffffffff;
const BUF_LEN = 1024;
const BUF_SIZE = BUF_LEN * Uint32Array.BYTES_PER_ELEMENT;

const randomPrefetcher = {
  buf: crypto.randomBytes(BUF_SIZE),
  pos: 0,
};

const cryptoRandom = () => {
  if (randomPrefetcher.pos === randomPrefetcher.buf.length) {
    randomPrefetcher.pos = 0;
    crypto.randomFillSync(randomPrefetcher.buf);
  }
  const val = randomPrefetcher.buf.readUInt32LE(randomPrefetcher.pos);
  randomPrefetcher.pos += Uint32Array.BYTES_PER_ELEMENT;
  return val / (UINT32_MAX + 1);
};

const generateKey = (length, possible) => {
  const base = possible.length;
  let key = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(cryptoRandom() * base);
    key += possible[index];
  }
  return key;
};

const crcToken = (secret, key) => {
  const md5 = crypto.createHash('md5').update(key + secret);
  return md5.digest('hex').substring(0, 4);
};

const generateToken = (secret, characters, length) => {
  const key = generateKey(length - 4, characters);
  return key + crcToken(secret, key);
};

const validateToken = (secret, token) => {
  if (!token) return false;
  const len = token.length;
  const crc = token.slice(len - 4);
  const key = token.slice(0, -4);
  return crcToken(secret, key) === crc;
};

// Only change these if you know what you're doing
const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SCRYPT_PREFIX = '$scrypt$N=32768,r=8,p=1,maxmem=67108864$';

const serializeHash = (hash, salt) => {
  const saltString = salt.toString('base64').split('=')[0];
  const hashString = hash.toString('base64').split('=')[0];
  return `${SCRYPT_PREFIX}${saltString}$${hashString}`;
};

const deserializeHash = (phcString) => {
  const parsed = phcString.split('$');
  parsed.shift();
  if (parsed[0] !== 'scrypt') {
    throw new Error('Node.js crypto module only supports scrypt');
  }
  const params = Object.fromEntries(
    parsed[1].split(',').map((p) => {
      const kv = p.split('=');
      kv[1] = Number(kv[1]);
      return kv;
    })
  );
  const salt = Buffer.from(parsed[2], 'base64');
  const hash = Buffer.from(parsed[3], 'base64');
  return { params, salt, hash };
};

const SALT_LEN = 32;
const KEY_LEN = 64;

const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(SALT_LEN, (err, salt) => {
      if (err) {
        reject(err);
        return;
      }
      crypto.scrypt(password, salt, KEY_LEN, SCRYPT_PARAMS, (err, hash) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(serializeHash(hash, salt));
      });
    });
  });

let defaultHash;
hashPassword('').then((hash) => {
  defaultHash = hash;
});

const validatePassword = (password, serHash = defaultHash) => {
  const { params, salt, hash } = deserializeHash(serHash);
  return new Promise((resolve, reject) => {
    const callback = (err, hashedPassword) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(crypto.timingSafeEqual(hashedPassword, hash));
    };
    crypto.scrypt(password, salt, hash.length, params, callback);
  });
};

module.exports = {
  cryptoRandom,
  generateKey,
  crcToken,
  generateToken,
  validateToken,
  hashPassword,
  validatePassword,
};
