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

const isFirstUpper = (s) => !!s && s[0] === s[0].toUpperCase();

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
  replace,
  fileExt,
  between,
  isFirstUpper,
  isConstant,
  nowDate,
  duration,
  makePrivate,
  protect,
  parseCookies,
  createAbortController,
  timeout,
  delay,
};
