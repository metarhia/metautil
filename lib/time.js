'use strict';

// Compare time1 and time2
//   time1 - <string>, time or milliseconds
//   time2 - <string>, time or milliseconds
// Returns: <boolean>
//
// Example: isTimeEqual(sinceTime, buffer.stats.mtime)
const isTimeEqual = (time1, time2) =>
  new Date(time1).getTime() === new Date(time2).getTime();

const pad2 = n => (n < 10 ? '0' + n : '' + n);

// Get current date in YYYY-MM-DD format
// Signature: [date]
//   date - <Date>, (optional), default: `new Date()`
// Returns: <string>
const nowDate = date => {
  if (!date) date = new Date();
  return (
    date.getUTCFullYear() +
    '-' +
    pad2(date.getUTCMonth() + 1) +
    '-' +
    pad2(date.getUTCDate())
  );
};

// Get current date in YYYY-MM-DD hh:mm format
// Signature: [date]
//   date - <Date>, (optional), default: `new Date()`
// Returns: <string>
const nowDateTime = date => {
  if (!date) date = new Date();
  return (
    date.getUTCFullYear() +
    '-' +
    pad2(date.getUTCMonth() + 1) +
    '-' +
    pad2(date.getUTCDate()) +
    ' ' +
    pad2(date.getUTCHours()) +
    ':' +
    pad2(date.getUTCMinutes())
  );
};

module.exports = {
  isTimeEqual,
  nowDate,
  nowDateTime,
};
