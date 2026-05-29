'use strict';

const DEC_SIZE_UNITS = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const BIN_SIZE_UNITS = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

const toSize = (base, units) => (bytes) => {
  if (bytes === 0) return '0';
  const exp = Math.floor(Math.log(bytes) / Math.log(base));
  const size = bytes / base ** exp;
  const short = Math.round(size);
  const unit = exp === 0 ? '' : ' ' + units[exp - 1];
  return short.toString() + unit;
};

const bytesToSize = toSize(1000, DEC_SIZE_UNITS);
const bytesToBinarySize = toSize(1024, BIN_SIZE_UNITS);

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
  const binUnit = size.slice(-3).toLowerCase();
  const binExp = BINARY_UNIT_SIZES[binUnit];
  const value = parseInt(size, 10);
  if (binExp) return value * 2 ** binExp;
  const decUnit = binUnit.slice(1);
  const decExp = UNIT_SIZES[decUnit];
  if (!decExp) return value;
  return value * 10 ** decExp;
};

module.exports = { bytesToSize, sizeToBytes, bytesToBinarySize };
