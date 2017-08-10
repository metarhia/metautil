'use strict';

const isTimeEqual = (
  // Compare time1 and time2
  time1, // string, time or milliseconds
  time2 // string, time or milliseconds
  // Returns: boolean
  // Example: isTimeEqual(sinceTime, buffer.stats.mtime);
) => (
  new Date(time1).getTime() === new Date(time2).getTime()
);

const pad2 = n => (n < 10 ? '0' + n : '' + n);

const nowDate = (
  // Current date in YYYY-MM-DD format
  now // Date (optional)
  // Returns: string
) => {
  if (!now) now = new Date();
  return (
    now.getUTCFullYear() + '-' +
    pad2(now.getUTCMonth() + 1) + '-' +
    pad2(now.getUTCDate())
  );
};

const nowDateTime = (
  // Current date in YYYY-MM-DD  hh:mm format
  now // Date (optional)
  // Returns: string
) => {
  if (!now) now = new Date();
  return (
    now.getUTCFullYear() + '-' +
    pad2(now.getUTCMonth() + 1) + '-' +
    pad2(now.getUTCDate()) + ' ' +
    pad2(now.getUTCHours()) + ':' +
    pad2(now.getUTCMinutes())
  );
};

module.exports = {
  isTimeEqual,
  nowDate,
  nowDateTime,
};
