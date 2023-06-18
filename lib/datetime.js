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

const isOrdinal = (s) => ORDINAL.some((d) => s.endsWith(d));

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

const nextEvent = (ev, d = new Date()) => {
  let ms = 0;
  const Y = d.getUTCFullYear();
  const M = d.getUTCMonth() + 1;
  const D = d.getUTCDate();
  const w = d.getUTCDay() + 1;
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();

  const iY = ev.YY > -1;
  const iM = ev.MM > -1;
  const iD = ev.DD > -1;
  const iw = ev.wd > -1;
  const ih = ev.hh > -1;
  const im = ev.mm > -1;
  const ims = ev.ms > -1;

  if (iY && (ev.YY < Y || ev.YY > Y)) return ev.YY < Y ? -1 : 0;
  if (iM && (ev.MM < M || ev.MM > M || ev.MM !== M)) return ev.MM < M ? -1 : 0;
  if (iD && (ev.DD < D || ev.DD > D || ev.DD !== D)) return ev.DD < D ? -1 : 0;
  if (iw && ev.wd !== w) return 0;
  if (ih && (ev.hh < h || (ev.hh === h && im && ev.mm < m))) return -1;

  if (ih) ms += (ev.hh - h) * DURATION_UNITS.h;
  if (im) ms += (ev.mm - m) * DURATION_UNITS.m;

  ms *= 1000;
  if (ims) ms += ev.ms;
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
