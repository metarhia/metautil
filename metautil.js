'use strict';

const submodules = [
  'array', // Arrays manipulations
  'fs', // File System
  'id', // Keys and identifiers
  'math', // Math common function
  'network', // Network utilities
  'strings', // Strings utilities
  'time', // Date and Time functions
  'units', // Units conversion
].map((path) => require('./lib/' + path));

module.exports = Object.assign({}, ...submodules);
