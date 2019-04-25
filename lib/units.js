'use strict';

const DURATION_UNITS = {
  d: 86400, // days
  h: 3600, // hours
  m: 60, // minutes
  s: 1, // seconds
};

// Parse duration to seconds
//   s - <string>, duration syntax
// Returns: <number>, milliseconds
//
// Example: duration('1d 10h 7m 13s')
const duration = s => {
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

const UNITS_MAX_DURATION = {
  s: 60, // seconds
  m: 60, // minutes
  h: 24, // hours
};

// Convert integer duration to string
//   n - <number>, duration
// Returns: <string>
const durationToString = n => {
  if (typeof n !== 'number' || !n) return '0s';
  n = Math.floor(n / 1000);
  const parts = [];
  for (const unit in UNITS_MAX_DURATION) {
    const mult = UNITS_MAX_DURATION[unit];
    const remainder = n % mult;
    if (remainder) parts.push(remainder + unit);
    n = Math.floor(n / mult);
  }
  if (n) parts.push(n + 'd');
  return parts.reverse().join(' ');
};

const SIZE_UNITS = ['', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'];

// Convert integer to string, representing data size in Kb, Mb, Gb, and Tb
//   bytes - <number>, size
// Returns: <string>
const bytesToSize = bytes => {
  if (bytes === 0) return '0';
  const exp = Math.floor(Math.log(bytes) / Math.log(1000));
  const size = bytes / 1000 ** exp;
  const short = Math.round(size, 2);
  const unit = SIZE_UNITS[exp];
  return short + unit;
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

// Convert string with data size to integer
//   size - <string>, size
// Returns: <number>
const sizeToBytes = size => {
  if (typeof size === 'number') return size;
  const [num, unit] = size.toLowerCase().split(' ');
  const exp = UNIT_SIZES[unit];
  const value = parseInt(num, 10);
  if (!exp) return value;
  return value * 10 ** exp;
};

module.exports = {
  duration,
  durationToString,
  bytesToSize,
  sizeToBytes,
};
