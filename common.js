'use strict';

const common = {};
module.exports = common;

const submodules = [
  'data', // Data structures manipulations
  'strings', // Strings utilities
  'time', // Data and Time functions
  'misc', // Miscellaneous tools
  'units', // Units conversion
  'network', // Network utilities
  'id', // Kyes and identifiers
  'sort', // Sort compare functions
  'cache' // Cache (enhanced Map)
];

const requires = submodules
  .map(path => './lib/' + path)
  .map(require);

Object.assign(common, ...requires);
