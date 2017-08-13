'use strict';

const submodules = [
  'utilities', // Common utilities
  'math', // Math common function
  'array', // Arrays manipulations
  'data', // Data structures manipulations
  'strings', // Strings utilities
  'time', // Data and Time functions
  'fp', // Functional programming
  'oop', // Object-oriented programming
  'callbacks', // Callback utilities
  'events', // Events and emitter
  'units', // Units conversion
  'network', // Network utilities
  'id', // Kyes and identifiers
  'sort', // Sort compare functions
  'cache', // Cache (enhanced Map)
  'mp', // Metaprogramming
].map(path => './lib/' + path).map(require);

module.exports = Object.assign({}, ...submodules);
