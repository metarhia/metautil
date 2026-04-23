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

const BINARY_SIZE_UNITS = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

const bytesToBinarySize = (bytes) => {
  if (bytes === 0) return '0';
  const exp = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / 1024 ** exp;
  const short = Math.round(size);
  const unit = exp === 0 ? '' : ' ' + BINARY_SIZE_UNITS[exp - 1];
  return short.toString() + unit;
};

const BINARY_UNIT_SIZES = {
  yib: 80, // yobibyte
  zib: 70, // zebibyte
  eib: 60, // exbibyte
  pib: 50, // pebibyte
  tib: 40, // tebibyte
  gib: 30, // gibibyte
  mib: 20, // mebibyte
  kib: 10, // kibibyte
};

const sizeToBytes = (size) => {
  const length = size.length;
  const unit3 = size.substring(length - 3, length).toLowerCase();
  const exp3 = BINARY_UNIT_SIZES[unit3];
  const value = parseInt(size, 10);
  if (exp3) return value * 2 ** exp3;
  const unit2 = size.substring(length - 2, length).toLowerCase();
  const exp2 = UNIT_SIZES[unit2];
  if (!exp2) return value;
  return value * 10 ** exp2;
};

module.exports = { bytesToSize, sizeToBytes, bytesToBinarySize };
