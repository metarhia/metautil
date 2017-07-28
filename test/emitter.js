'use strict';

const tap = require('tap');
const common = require('..');

tap.test('emitter', (test) => {
  const ee = common.emitter();
  ee.on('name', () => {
    test.end();
  });
  ee.emit('name');
});
