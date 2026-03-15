'use strict';

const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');
const fsp = fs.promises;
const { toBool } = require('./async.js');

const UINT32_MAX = 0xffffffff;
const BUF_LEN = 1024;
const BUF_SIZE = BUF_LEN * Uint32Array.BYTES_PER_ELEMENT;

const randomPrefetcher = {
  buf: crypto.randomBytes(BUF_SIZE),
  pos: 0,
  next() {
    const { buf, pos } = this;
    let start = pos;
    if (start === buf.length) {
      start = 0;
      crypto.randomFillSync(buf);
    }
    const end = start + Uint32Array.BYTES_PER_ELEMENT;
    this.pos = end;
    return buf.subarray(start, end);
  },
};

const cryptoRandom = (min, max) => {
  const buf = randomPrefetcher.next();
  const rnd = buf.readUInt32LE(0) / (UINT32_MAX + 1);
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

const generateUUID = crypto.randomUUID;

const generateKey = (possible, length) => {
  if (length < 0) return '';
  const base = possible.length;
  if (base < 1) return '';
  const key = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, base);
    key[i] = possible.charCodeAt(index);
  }
  return Buffer.from(key).toString('latin1');
};

const CRC_LEN = 4;

const crcToken = (secret, key) => {
  const md5 = crypto.createHash('md5').update(key + secret);
  return md5.digest('hex').substring(0, CRC_LEN);
};

const generateToken = (secret, characters, length) => {
  if (length < CRC_LEN || secret === '' || characters === '') return '';
  const key = generateKey(characters, length - CRC_LEN);
  return key + crcToken(secret, key);
};

const validateToken = (secret, token) => {
  if (!token) return false;
  const len = token.length;
  const crc = token.slice(len - CRC_LEN);
  const key = token.slice(0, -CRC_LEN);
  const secretSign = Buffer.from(crcToken(secret, key));
  const tokenSign = Buffer.from(crc);
  return crypto.timingSafeEqual(secretSign, tokenSign);
};

const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SCRYPT_PREFIX = '$scrypt$N=32768,r=8,p=1,maxmem=67108864$';

const serializeHash = (hash, salt) => {
  const saltString = salt.toString('base64').split('=')[0];
  const hashString = hash.toString('base64').split('=')[0];
  return `${SCRYPT_PREFIX}${saltString}$${hashString}`;
};

const parseOptions = (options) => {
  const values = [];
  const items = options.split(',');
  for (const item of items) {
    const [key, val] = item.split('=');
    values.push([key, Number(val)]);
  }
  return Object.fromEntries(values);
};

const HASH_PARTS = 5;

const deserializeHash = (phcString) => {
  const parts = phcString.split('$');
  if (parts.length !== HASH_PARTS) {
    throw new Error('Invalid format; Expected $name$options$salt$hash');
  }
  const [, name, options, salt64, hash64] = parts;
  if (name !== 'scrypt') {
    throw new Error('Node.js crypto module only supports scrypt');
  }
  const params = parseOptions(options);
  const salt = Buffer.from(salt64, 'base64');
  const hash = Buffer.from(hash64, 'base64');
  return { params, salt, hash };
};

const SALT_LEN = 32;
const KEY_LEN = 64;

const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(SALT_LEN, (error, salt) => {
      if (error) return void reject(error);
      crypto.scrypt(password, salt, KEY_LEN, SCRYPT_PARAMS, (error, hash) => {
        if (error) return void reject(error);
        resolve(serializeHash(hash, salt));
      });
    });
  });

const validatePassword = (password, serHash) => {
  const { params, salt, hash } = deserializeHash(serHash);
  return new Promise((resolve, reject) => {
    const callback = (error, hashedPassword) => {
      if (error) return void reject(error);
      resolve(crypto.timingSafeEqual(hashedPassword, hash));
    };
    crypto.scrypt(password, salt, hash.length, params, callback);
  });
};

const md5 = (filePath) => {
  const hash = crypto.createHash('md5');
  const file = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    file.on('error', reject);
    hash.once('readable', () => {
      resolve(hash.read().toString('hex'));
    });
    file.pipe(hash);
  });
};

const DNS_PREFIX = 'DNS:';

const getX509names = (cert) => {
  const { subject, subjectAltName } = cert;
  const subjectName = subject.split('=').pop();
  const altNames = subjectAltName
    .split(', ')
    .filter((entry) => entry.startsWith(DNS_PREFIX))
    .map((entry) => entry.substring(DNS_PREFIX.length));
  return [subjectName, ...altNames];
};

const exists = async (path) => {
  const stats = await fsp.stat(path).catch(() => null);
  return !!stats;
};

const fileExists = async (path) => {
  const stats = await fsp.stat(path).catch(() => null);
  if (!stats) return false;
  return !stats.isDirectory();
};

const directoryExists = async (path) => {
  const stats = await fsp.stat(path).catch(() => null);
  if (!stats) return false;
  return stats.isDirectory();
};

const ensureDirectory = async (path) => {
  const alreadyExists = await directoryExists(path);
  if (alreadyExists) return true;
  return fsp.mkdir(path).then(...toBool);
};

const parsePath = (relPath) => {
  const name = path.basename(relPath, '.js');
  const names = relPath.split(path.sep);
  names[names.length - 1] = name;
  return names;
};

module.exports = {
  cryptoRandom,
  random,
  generateUUID,
  generateKey,
  crcToken,
  generateToken,
  validateToken,
  serializeHash,
  deserializeHash,
  hashPassword,
  validatePassword,
  md5,
  getX509names,
  exists,
  directoryExists,
  fileExists,
  ensureDirectory,
  parsePath,
};
