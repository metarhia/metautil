'use strict';

const { EventEmitter } = require('events');

const emitter = (
  // EventEmitter with wildcard
  // Returns: EventEmitter instance
) => {
  const ee = new EventEmitter();
  const emit = ee.emit;
  ee.emit = (...args) => {
    const ar = args.slice(0);
    ar.unshift('*');
    emit.apply(ee, ar);
    emit.apply(ee, args);
  };
  return ee;
};

module.exports = {
  emitter
};
