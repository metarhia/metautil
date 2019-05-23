'use strict';

const submodules = [
  'array', // Arrays manipulations
  'auth', // Validation of data for authentication/authorization
  'btree', // B-Tree for indexes in DB
  'cache', // Cache (enhanced Map)
  'callbacks', // Callback utilities
  'data', // Data structures manipulations
  'enum', // Enumerated type
  'events', // Events and emitter
  'flags', // Flags data type
  'fp', // Functional programming
  'fs', // File System
  'id', // Keys and identifiers
  'int64', // Int64
  'iterator', // Iterator
  'math', // Math common function
  'mp', // Metaprogramming
  'network', // Network utilities
  'oop', // Object-oriented programming
  'pool', // Object pool
  'sort', // Sort compare functions
  'stream', // Stream utilities
  'strings', // Strings utilities
  'time', // Date and Time functions
  'uint64', // Uint64
  'units', // Units conversion
  'utilities', // Common utilities
].map(path => require('./lib/' + path));

module.exports = Object.assign({}, ...submodules);
