'use strict';

const strings = require('./strings.js');

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

const ORDINAL = ['st', 'nd', 'rd', 'th'];

const isOrdinal = (s) => {
  for (const d of ORDINAL) {
    if (s.endsWith(d)) return true;
  }
  return false;
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
      const [h, m] = strings.split(part, ':');
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

module.exports = {
  duration,
  nowDate,
  nowDateTimeUTC,
  parseMonth,
  parseDay,
  parseEvery,
  nextEvent,
};
