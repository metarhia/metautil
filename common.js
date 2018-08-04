'use strict';

const submodules = [
  'auth', // Validation of data for authentication/authorization
  'utilities', // Common utilities
  'math', // Math common function
  'array', // Arrays manipulations
  'data', // Data structures manipulations
  'strings', // Strings utilities
  'time', // Date and Time functions
  'fp', // Functional programming
  'oop', // Object-oriented programming
  'callbacks', // Callback utilities
  'events', // Events and emitter
  'units', // Units conversion
  'network', // Network utilities
  'id', // Keys and identifiers
  'sort', // Sort compare functions
  'cache', // Cache (enhanced Map)
  'mp', // Metaprogramming
  'enum', // Enumerated type
  'iterator', // Iterator
  'uint64', // Uint64
].map(path => require('./lib/' + path));

module.exports = Object.assign({}, ...submodules);
