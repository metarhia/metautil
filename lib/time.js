'use strict';

const api = {};
api.common = {};
module.exports = api.common;

api.common.isTimeEqual = (
  time1, // Compare time1
  time2 // and time2 in milliseconds
  // Example: api.common.isTimeEqual(sinceTime, buffer.stats.mtime);
  // Return: boolean
) => (
  new Date(time2).getTime() === new Date(time1).getTime()
);

const pad2 = n => (n < 10 ? '0' + n : '' + n);

api.common.nowDate = (
  now // date object (optional) to YYYY-MM-DD
) => {
  if (!now) now = new Date();
  return (
    now.getUTCFullYear() + '-' +
    pad2(now.getUTCMonth() + 1) + '-' +
    pad2(now.getUTCDate())
  );
};

api.common.nowDateTime = (
  now // date object (optional) to YYYY-MM-DD hh:mm
) => {
  if (!now) now = new Date();
  return (
    now.getUTCFullYear() + '-' +
    api.common.pad2(now.getUTCMonth() + 1) + '-' +
    api.common.pad2(now.getUTCDate()) + ' ' +
    api.common.pad2(now.getUTCHours()) + ':' +
    api.common.pad2(now.getUTCMinutes())
  );
};
