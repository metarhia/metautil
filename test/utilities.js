'use strict';

const metatests = require('metatests');
const common = require('..');

const path = require('path');

const callerFilepathFixture = require('./fixtures/callerFilepath');

metatests.test('Check called filename/filepath', test => {
  test.ok(common.callerFilepath().endsWith(path.join('test', 'utilities.js')));
  test.strictSame(common.callerFilename(), 'utilities.js');
  test.end();
});

metatests.test('Check called filename/filepath parent', test => {
  child(test, 1);
  child(test, /child/);
  test.end();
});

function child(test, depth) {
  test.ok(
    common.callerFilepath(depth).endsWith(path.join('test', 'utilities.js'))
  );
  test.strictSame(common.callerFilename(depth), 'utilities.js');
}

metatests.test('Check filepath filter all', test => {
  test.strictSame(common.callerFilepath(/./), '');
  test.end();
});

metatests.test('Check filepath with indirection', test => {
  test.ok(callerFilepathFixture(1).endsWith(path.join('test', 'utilities.js')));
  test.ok(
    callerFilepathFixture(/callerFilepath/).endsWith(
      path.join('test', 'utilities.js')
    )
  );
  test.end();
});

metatests.testSync('Check captureMaxStack', test => {
  const stack = common.captureMaxStack();
  test.log(stack);
  test.assert(stack.match(/Error[: \w]*\n/), 'stack must match a regexp');
});
