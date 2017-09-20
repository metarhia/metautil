'use strict';

const DURATION_UNITS = {
  days:    { rx: /(\d+)\s*d/, mul: 86400 },
  hours:   { rx: /(\d+)\s*h/, mul: 3600 },
  minutes: { rx: /(\d+)\s*m/, mul: 60 },
  seconds: { rx: /(\d+)\s*s/, mul: 1 }
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
  let key, unit, match;
  for (key in DURATION_UNITS) {
    unit = DURATION_UNITS[key];
    match = s.match(unit.rx);
    if (match) result += parseInt(match[1], 10) * unit.mul;
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
  yb: { rx: /(\d+)\s*YB/, pow: 24 },
  zb: { rx: /(\d+)\s*ZB/, pow: 21 },
  eb: { rx: /(\d+)\s*EB/, pow: 18 },
  pb: { rx: /(\d+)\s*PB/, pow: 15 },
  tb: { rx: /(\d+)\s*TB/, pow: 12 },
  gb: { rx: /(\d+)\s*GB/, pow: 9 },
  mb: { rx: /(\d+)\s*MB/, pow: 6 },
  kb: { rx: /(\d+)\s*KB/, pow: 3 }
};

const sizeToBytes = (
  // Convert string with units to int
  size // string, size
  // Returns: number
) => {
  if (typeof(size) === 'number') return size;
  size = size.toUpperCase();
  let result = 0;
  if (typeof(size) === 'string') {
    let key, unit, match;
    let found = false;
    for (key in UNIT_SIZES) {
      unit = UNIT_SIZES[key];
      match = size.match(unit.rx);
      if (match) {
        result += parseInt(match[1], 10) * Math.pow(10, unit.pow);
        found = true;
      }
    }
    if (!found) result = parseInt(size, 10);
  }
  return result;
};

module.exports = {
  duration,
  bytesToSize,
  sizeToBytes,
};
