'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('Check called filename/filepath', test => {
  test.ok(common.callerFilepath().endsWith('test/utilities.js'));
  test.strictSame(common.callerFilename(), 'utilities.js');
  test.end();
});

metatests.test('Check called filename/filepath parent', test => {
  child(test, 1);
  test.end();
});

function child(test, depth) {
  test.ok(common.callerFilepath(depth).endsWith('test/utilities.js'));
  test.strictSame(common.callerFilename(depth), 'utilities.js');
}
