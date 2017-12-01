'use strict';

const DURATION_UNITS = {
  d: 86400, // days
  h:  3600, // hours
  m:    60, // minutes
  s:     1, // seconds
};

const duration = (
  // Parse duration to seconds
  s // string, duration syntax
  // Returns: number, milliseconds
  // Example: duration('1d 10h 7m 13s')
) => {
  if (typeof(s) === 'number') return s;
  if (typeof(s) !== 'string') return 0;
  let result = 0;
  const parts = s.split(' ');
  let unit, value, part, mult;
  for (part of parts) {
    unit = part.slice(-1);
    value = parseInt(part.slice(0, -1));
    mult = DURATION_UNITS[unit];
    if (!isNaN(value) && mult) result += value * mult;
  }
  return result * 1000;
};

const SIZE_UNITS = [
  '', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'
];

const bytesToSize = (
  // Convert int to string size Kb, Mb, Gb and Tb
  bytes // number, size
  // Returns: string
) => {
  if (bytes === 0) return '0';
  const exp = Math.floor(Math.log(bytes) / Math.log(1000));
  const size = bytes / Math.pow(1000, exp);
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
  gb:  9, // gigabyte
  mb:  6, // megabyte
  kb:  3, // kilobyte
};

const sizeToBytes = (
  // Convert string with units to int
  size // string, size
  // Returns: number
) => {
  if (typeof(size) === 'number') return size;
  const [num, unit] = size.toLowerCase().split(' ');
  const exp = UNIT_SIZES[unit];
  const value = parseInt(num, 10);
  if (!exp) return value;
  return value * Math.pow(10, exp);
};

module.exports = {
  duration,
  bytesToSize,
  sizeToBytes,
};
