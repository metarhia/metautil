'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');

const { toBool } = require('./async.js');

const exists = async (path) => {
  const stats = await fsp.stat(path).catch(() => null);
  return !!stats;
};

const fileExists = async (path) => {
  const stats = await fsp.stat(path).catch(() => null);
  if (!stats) return false;
  return !stats.isDirectory();
};

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

const parsePath = (relPath) => {
  const name = path.basename(relPath, '.js');
  const names = relPath.split(path.sep);
  names[names.length - 1] = name;
  return names;
};

module.exports = {
  exists,
  directoryExists,
  fileExists,
  ensureDirectory,
  parsePath,
};
