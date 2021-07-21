'use strict';

const path = require('path');
const { EventEmitter } = require('events');

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

const isFirstUpper = (s) => !!s && s[0] === s[0].toUpperCase();

const toLowerCamel = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const toUpperCamel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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

const parseMonth = (s) => {
  for (let i = 0; i < MONTHS.length; i++) {
    if (s.startsWith(MONTHS[i])) return i;
  }
  return -1;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseDay = (s) => {
  for (let i = 0; i < DAYS.length; i++) {
    if (s.startsWith(DAYS[i])) return i;
  }
  return -1;
};

const parseEvery = (s = '') => {
  let month = -1;
  let day = -1;
  let dd = -1;
  let hh = -1;
  let mm = -1;
  let interval = 0;
  const parts = s.split(' ');
  for (const part of parts) {
    if (part.includes(':')) {
      const [h, m] = split(part, ':');
      if (h !== '') hh = parseInt(h);
      mm = m === '' ? 0 : parseInt(m);
      continue;
    }
    if (isOrdinal(part)) {
      dd = parseInt(part);
      continue;
    }
    month = parseMonth(part);
    if (month > -1) continue;
    day = parseDay(part);
    if (day > -1) continue;
    const unit = part.slice(-1);
    const mult = DURATION_UNITS[unit];
    if (typeof mult === 'number') {
      const value = parseInt(part);
      if (!isNaN(value)) interval += value * mult;
    }
  }
  return { month, day, dd, hh, mm, interval: interval * 1000 };
};

const nextEvent = (every, date = new Date()) => {
  let interval = 0;
  const month = date.getUTCMonth();
  if (every.month > -1 && every.month !== month) return -1;
  const day = date.getUTCDay();
  if (every.day > -1 && every.day !== day) return -1;
  const dd = date.getUTCDate();
  if (every.dd > -1 && every.dd !== dd) return -1;
  const hh = date.getUTCHours();
  if (every.hh > -1) {
    interval += (every.hh - hh) * DURATION_UNITS.h;
  }
  const mm = date.getUTCMinutes();
  if (every.mm > -1) {
    interval += (every.mm - mm) * DURATION_UNITS.m;
  }
  if (interval < 0) return -1;
  return interval * 1000 + every.interval;
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

const createAbortController = () => {
  const signal = new EventEmitter();
  const abort = () => {
    signal.emit('abort');
  };
  return { abort, signal };
};

const timeout = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout reached'));
    }, msec);
    if (!signal) return;
    signal.on('abort', () => {
      clearTimeout(timer);
      reject(new Error('Timeout aborted'));
    });
  });

const delay = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, msec);
    if (!signal) return;
    signal.on('abort', () => {
      clearTimeout(timer);
      reject(new Error('Delay aborted'));
    });
  });

module.exports = {
  random,
  sample,
  ipToInt,
  parseHost,
  parseParams,
  replace,
  fileExt,
  between,
  split,
  isFirstUpper,
  toLowerCamel,
  toUpperCamel,
  isConstant,
  nowDate,
  duration,
  parseEvery,
  nextEvent,
  makePrivate,
  protect,
  parseCookies,
  createAbortController,
  timeout,
  delay,
};
