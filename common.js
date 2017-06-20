'use strict';

const api = {};
api.os = require('os');
api.path = require('path');
api.events = require('events');
api.crypto = require('crypto');
api.common = {};
module.exports = api.common;

const submodules = [
  'array', // Arrays manipulations
  'data', // Data structures manipulations
  'strings', // Strings utilities
  'time', // Data and Time functions
  'functional', // Functional programming
  'misc', // Miscellaneous tools
  'units', // Units conversion
  'network', // Network utilities
  'id', // Kyes and identifiers
  'sort', // Sort compare functions
  'cache', // Cache (enhanced Map)
];

submodules
  .map(path => './lib/' + path)
  .map(require)
  .map(exports => exports(api));
