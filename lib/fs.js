'use strict';

const fsp = require('node:fs').promises;
const { toBool } = require('./async.js');

const directoryExists = async (path) => {
  const stats = await fsp.stat(path).catch(() => null);
  if (!stats) return false;
  return stats.isDirectory();
};

const ensureDirectory = async (path) => {
  const alreadyExists = await directoryExists(path);
  if (alreadyExists) return true;
  return fsp.mkdir(path).then(...toBool);
};

module.exports = {
  directoryExists,
  ensureDirectory,
};
