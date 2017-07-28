'use strict';

const submodules = [
  'array', // Arrays manipulations
  'data', // Data structures manipulations
  'strings', // Strings utilities
  'time', // Data and Time functions
  'functional', // Functional programming
  'misc', // Miscellaneous tools
  'events', // Events and emitter
  'units', // Units conversion
  'network', // Network utilities
  'id', // Kyes and identifiers
  'sort', // Sort compare functions
  'cache', // Cache (enhanced Map)
].map(path => './lib/' + path).map(require);

module.exports = Object.assign({}, ...submodules);
