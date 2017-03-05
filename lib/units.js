'use strict';

const api = {};
api.common = {};
module.exports = api.common;

const DURATION_UNITS = {
  days:    { rx: /(\d+)\s*d/, mul: 86400 },
  hours:   { rx: /(\d+)\s*h/, mul: 3600 },
  minutes: { rx: /(\d+)\s*m/, mul: 60 },
  seconds: { rx: /(\d+)\s*s/, mul: 1 }
};

api.common.duration = (
  s // parse duration to seconds
  // Example: duration('1d 10h 7m 13s')
) => {
  if (typeof(s) === 'number') return s;
  let result = 0;
  let unit, match, key;
  if (typeof(s) === 'string') {
    for (key in DURATION_UNITS) {
      unit = DURATION_UNITS[key];
      match = s.match(unit.rx);
      if (match) result += parseInt(match[1], 10) * unit.mul;
    }
  }
  return result * 1000;
};

api.common.bytesToSize = (
  bytes // number to be converted to size Kb, Mb, Gb and Tb
) => {
  if (bytes === 0) return '0';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)), 10);
  return (
    Math.round(bytes / Math.pow(1000, i), 2) +
    api.common.bytesToSize.sizes[i]
  );
};

api.common.bytesToSize.sizes = [
  '', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'
];

api.common.sizeToBytes = (
  size // string with units to be converted to number
) => {
  if (typeof(size) === 'number') return size;
  size = size.toUpperCase();
  let result = 0;
  const units = api.common.sizeToBytes.units;
  if (typeof(size) === 'string') {
    let key, unit, match;
    let found = false;
    for (key in units) {
      unit = units[key];
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

api.common.sizeToBytes.units = {
  yb: { rx: /(\d+)\s*YB/, pow: 24 },
  zb: { rx: /(\d+)\s*ZB/, pow: 21 },
  eb: { rx: /(\d+)\s*EB/, pow: 18 },
  pb: { rx: /(\d+)\s*PB/, pow: 15 },
  tb: { rx: /(\d+)\s*TB/, pow: 12 },
  gb: { rx: /(\d+)\s*GB/, pow: 9 },
  mb: { rx: /(\d+)\s*MB/, pow: 6 },
  kb: { rx: /(\d+)\s*KB/, pow: 3 }
};
