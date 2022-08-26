'use strict';

const path = require('path');

const random = (min, max) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

const sample = (arr) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

const ipToInt = (ip = '127.0.0.1') => {
  if (ip === '') return 0;
  const bytes = ip.split('.');
  let res = 0;
  for (const byte of bytes) {
    res = (res << 8) + parseInt(byte, 10);
  }
  return res;
};

const parseHost = (host) => {
  if (!host) {
    return 'no-host-name-in-http-headers';
  }
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};

const parseParams = (params) => Object.fromEntries(new URLSearchParams(params));

const replace = (str, substr, newstr) => {
  if (substr === '') return str;
  let src = str;
  let res = '';
  do {
    const index = src.indexOf(substr);
    if (index === -1) return res + src;
    const start = src.substring(0, index);
    src = src.substring(index + substr.length, src.length);
    res += start + newstr;
  } while (true);
};

const fileExt = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  return replace(ext, '.', '');
};

const parsePath = (relPath) => {
  const name = path.basename(relPath, '.js');
  const names = relPath.split(path.sep);
  names[names.length - 1] = name;
  return names;
};

const between = (s, prefix, suffix) => {
  let i = s.indexOf(prefix);
  if (i === -1) return '';
  s = s.substring(i + prefix.length);
  if (suffix) {
    i = s.indexOf(suffix);
    if (i === -1) return '';
    s = s.substring(0, i);
  }
  return s;
};

const split = (s, separator) => {
  const i = s.indexOf(separator);
  if (i < 0) return [s, ''];
  return [s.slice(0, i), s.slice(i + separator.length)];
};

const inRange = (x, min, max) => x >= min && x <= max;

const isFirstUpper = (s) => !!s && inRange(s[0], 'A', 'Z');

const isFirstLower = (s) => !!s && inRange(s[0], 'a', 'z');

const isFirstLetter = (s) => isFirstUpper(s) || isFirstLower(s);

const isHashObject = (o) =>
  typeof o === 'object' && o !== null && !Array.isArray(o);

const toLowerCamel = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const toUpperCamel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const toLower = (s) => s.toLowerCase();

const toCamel = (separator) => (s) => {
  const words = s.split(separator);
  const first = words.length > 0 ? words.shift().toLowerCase() : '';
  return first + words.map(toLower).map(toUpperCamel).join('');
};

const spinalToCamel = toCamel('-');

const snakeToCamel = toCamel('_');

const isConstant = (s) => s === s.toUpperCase();

const twoDigit = (n) => {
  const s = n.toString();
  if (n < 10) return '0' + s;
  return s;
};

const nowDate = (date) => {
  if (!date) date = new Date();
  const yyyy = date.getUTCFullYear().toString();
  const mm = twoDigit(date.getUTCMonth() + 1);
  const dd = twoDigit(date.getUTCDate());
  return `${yyyy}-${mm}-${dd}`;
};

const nowDateTimeUTC = (date, timeSep = ':') => {
  if (!date) date = new Date();
  const yyyy = date.getUTCFullYear().toString();
  const mm = twoDigit(date.getUTCMonth() + 1);
  const dd = twoDigit(date.getUTCDate());
  const hh = twoDigit(date.getUTCHours());
  const min = twoDigit(date.getUTCMinutes());
  const ss = twoDigit(date.getUTCSeconds());
  return `${yyyy}-${mm}-${dd}T${hh}${timeSep}${min}${timeSep}${ss}`;
};

const DURATION_UNITS = {
  d: 86400, // days
  h: 3600, // hours
  m: 60, // minutes
  s: 1, // seconds
};

const duration = (s) => {
  if (typeof s === 'number') return s;
  if (typeof s !== 'string') return 0;
  let result = 0;
  const parts = s.split(' ');
  for (const part of parts) {
    const unit = part.slice(-1);
    const value = parseInt(part.slice(0, -1));
    const mult = DURATION_UNITS[unit];
    if (!isNaN(value) && mult) result += value * mult;
  }
  return result * 1000;
};

const SIZE_UNITS = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const bytesToSize = (bytes) => {
  if (bytes === 0) return '0';
  const exp = Math.floor(Math.log(bytes) / Math.log(1000));
  const size = bytes / 1000 ** exp;
  const short = Math.round(size);
  const unit = exp === 0 ? '' : ' ' + SIZE_UNITS[exp - 1];
  return short.toString() + unit;
};

const UNIT_SIZES = {
  yb: 24, // yottabyte
  zb: 21, // zettabyte
  eb: 18, // exabyte
  pb: 15, // petabyte
  tb: 12, // terabyte
  gb: 9, // gigabyte
  mb: 6, // megabyte
  kb: 3, // kilobyte
};

const sizeToBytes = (size) => {
  const [num, unit] = size.toLowerCase().split(' ');
  const exp = UNIT_SIZES[unit];
  const value = parseInt(num, 10);
  if (!exp) return value;
  return value * 10 ** exp;
};

const namespaceByPath = (namespace, path) => {
  const [key, rest] = split(path, '.');
  const step = namespace[key];
  if (!step) return null;
  if (rest === '') return step;
  return namespaceByPath(step, rest);
};

const ORDINAL = ['st', 'nd', 'rd', 'th'];

const isOrdinal = (s) => {
  for (const d of ORDINAL) {
    if (s.endsWith(d)) return true;
  }
  return false;
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const NAME_LEN = 3;

const parseMonth = (s) => {
  const name = s.substring(0, NAME_LEN);
  const i = MONTHS.indexOf(name);
  return i >= 0 ? i + 1 : -1;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseDay = (s) => {
  const name = s.substring(0, NAME_LEN);
  const i = DAYS.indexOf(name);
  return i >= 0 ? i + 1 : -1;
};

const YEAR_LEN = 4;

const parseEvery = (s = '') => {
  let YY = -1;
  let MM = -1;
  let DD = -1;
  let wd = -1;
  let hh = -1;
  let mm = -1;
  let ms = 0;
  const parts = s.split(' ');
  for (const part of parts) {
    if (part.includes(':')) {
      const [h, m] = split(part, ':');
      if (h !== '') hh = parseInt(h);
      mm = m === '' ? 0 : parseInt(m);
      continue;
    }
    if (isOrdinal(part)) {
      DD = parseInt(part);
      continue;
    }
    if (part.length === YEAR_LEN) {
      YY = parseInt(part);
      continue;
    }
    if (MM === -1) {
      MM = parseMonth(part);
      if (MM > -1) continue;
    }
    if (wd === -1) {
      wd = parseDay(part);
      if (wd > -1) continue;
    }
    const unit = part.slice(-1);
    const mult = DURATION_UNITS[unit];
    if (typeof mult === 'number') {
      const value = parseInt(part);
      if (!isNaN(value)) ms += value * mult;
    }
  }
  return { YY, MM, DD, wd, hh, mm, ms: ms > 0 ? ms * 1000 : -1 };
};

const nextEvent = (every, date = new Date()) => {
  let ms = 0;
  const YY = date.getUTCFullYear();
  const MM = date.getUTCMonth() + 1;
  const DD = date.getUTCDate();
  const wd = date.getUTCDay() + 1;
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  if (every.YY > -1) {
    if (every.YY < YY) return -1;
    if (every.YY > YY) return 0;
    if (every.MM > -1) {
      if (every.MM < MM) return -1;
      if (every.MM > MM) return 0;
      if (every.DD > -1) {
        if (every.DD < DD) return -1;
        if (every.DD > DD) return 0;
        if (every.hh > -1) {
          if (every.hh < hh) return -1;
          if (every.hh === hh) {
            if (every.mm > -1 && every.mm < mm) return -1;
          }
        }
      }
    }
  }
  if (every.MM > -1 && every.MM !== MM) return 0;
  if (every.DD > -1 && every.DD !== DD) return 0;
  if (every.wd > -1 && every.wd !== wd) return 0;
  if (every.hh > -1) ms += (every.hh - hh) * DURATION_UNITS.h;
  if (every.mm > -1) ms += (every.mm - mm) * DURATION_UNITS.m;
  ms *= 1000;
  if (every.ms > -1) ms += every.ms;
  return ms;
};

const makePrivate = (instance) => {
  const iface = {};
  const fields = Object.keys(instance);
  for (const fieldName of fields) {
    const field = instance[fieldName];
    if (isConstant(fieldName)) {
      iface[fieldName] = field;
    } else if (typeof field === 'function') {
      const bindedMethod = field.bind(instance);
      iface[fieldName] = bindedMethod;
      instance[fieldName] = bindedMethod;
    }
  }
  return iface;
};

const protect = (allowMixins, ...namespaces) => {
  for (const namespace of namespaces) {
    const names = Object.keys(namespace);
    for (const name of names) {
      const target = namespace[name];
      if (!allowMixins.includes(name)) Object.freeze(target);
    }
  }
};

const parseCookies = (cookie) => {
  const values = {};
  const items = cookie.split(';');
  for (const item of items) {
    const parts = item.split('=');
    const key = parts[0].trim();
    const val = parts[1] || '';
    values[key] = val.trim();
  }
  return values;
};

const jsonParse = (buffer) => {
  if (buffer.length === 0) return null;
  try {
    return JSON.parse(buffer);
  } catch {
    return null;
  }
};

const flatObject = (sourceObject, fieldNames = []) => {
  const target = {};

  for (const [key, value] of Object.entries(sourceObject)) {
    if (!isHashObject(value)) {
      target[key] = value;
      continue;
    }

    if (fieldNames.length > 0 && !fieldNames.includes(key)) {
      target[key] = { ...value };
      continue;
    }

    for (const [childKey, childValue] of Object.entries(value)) {
      const combinedKey = `${key}${toUpperCamel(childKey)}`;

      if (sourceObject[combinedKey] !== undefined) {
        const error = `Can not combine keys: key "${combinedKey}" already exists`;
        throw new Error(error);
      }

      target[combinedKey] = childValue;
    }
  }

  return target;
};

const unflatObject = (sourceObject, fieldNames) => {
  const result = {};
  for (const [key, value] of Object.entries(sourceObject)) {
    const prefix = fieldNames.find((name) => key.startsWith(name));
    if (prefix) {
      if (Object.prototype.hasOwnProperty.call(sourceObject, prefix)) {
        throw new Error(`Can not combine keys: key "${prefix}" already exists`);
      }
      const newKey = key.substring(prefix.length).toLowerCase();
      const section = result[prefix];
      if (section) section[newKey] = value;
      else result[prefix] = { [newKey]: value };
      continue;
    }
    result[key] = value;
  }
  return result;
};

const isError = (err) => err?.constructor?.name?.includes('Error') || false;

module.exports = {
  random,
  sample,
  ipToInt,
  parseHost,
  parseParams,
  replace,
  fileExt,
  parsePath,
  between,
  split,
  isFirstUpper,
  isFirstLower,
  isFirstLetter,
  isHashObject,
  toLowerCamel,
  toUpperCamel,
  toLower,
  toCamel,
  spinalToCamel,
  snakeToCamel,
  isConstant,
  nowDate,
  nowDateTimeUTC,
  duration,
  bytesToSize,
  sizeToBytes,
  namespaceByPath,
  parseMonth,
  parseDay,
  parseEvery,
  nextEvent,
  makePrivate,
  protect,
  parseCookies,
  jsonParse,
  flatObject,
  unflatObject,
  isError,
};
