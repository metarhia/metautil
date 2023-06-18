'use strict';

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
  const length = size.length;
  const unit = size.substring(length - 2, length).toLowerCase();
  const value = parseInt(size, 10);
  const exp = UNIT_SIZES[unit];
  if (!exp) return value;
  return value * Math.pow(10, exp);
};

module.exports = { bytesToSize, sizeToBytes };
