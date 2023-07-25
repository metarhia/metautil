'use strict';

const fsp = require('node:fs').promises;

const directoryExists = async (path) => {
  const stats = await fsp.stat(path).catch(() => null);
  if (!stats) return false;
  return stats.isDirectory();
};

const ensureDirectory = async (path) => {
  return fsp.mkdir(path).then(
    () => true,
    (err) => err.code === 'EEXIST',
  );
};

module.exports = {
  directoryExists,
  ensureDirectory,
};
