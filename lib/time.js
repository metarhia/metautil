'use strict';

const isTimeEqual = (
  // Compare time1 and time2
  time1, // string, time or milliseconds
  time2 // string, time or milliseconds
  // Returns: boolean
  // Example: isTimeEqual(sinceTime, buffer.stats.mtime)
) => (
  new Date(time1).getTime() === new Date(time2).getTime()
);

const pad2 = n => (n < 10 ? '0' + n : '' + n);

const nowDate = (
  // Current date in YYYY-MM-DD format
  date // Date (optional), now by default
  // Returns: string
) => {
  if (!date) date = new Date();
  return (
    date.getUTCFullYear() + '-' +
    pad2(date.getUTCMonth() + 1) + '-' +
    pad2(date.getUTCDate())
  );
};

const nowDateTime = (
  // Current date in YYYY-MM-DD hh:mm format
  date // Date (optional), now by default
  // Returns: string
) => {
  if (!date) date = new Date();
  return (
    date.getUTCFullYear() + '-' +
    pad2(date.getUTCMonth() + 1) + '-' +
    pad2(date.getUTCDate()) + ' ' +
    pad2(date.getUTCHours()) + ':' +
    pad2(date.getUTCMinutes())
  );
};

module.exports = {
  isTimeEqual,
  nowDate,
  nowDateTime,
};
