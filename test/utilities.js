'use strict';

const metatests = require('metatests');
const common = require('..');

const path = require('path');

metatests.test('safe require success', test => {
  const safeRequire = common.safe(require);
  const result = safeRequire('./mp');
  test.strictSame(!!result[0], false);
  test.strictSame(!!result[1], true);
  test.end();
});

metatests.test('safe require fail', test => {
  const safeRequire = common.safe(require);
  const result = safeRequire('./name');
  test.strictSame(!!result[0], true);
  test.strictSame(!!result[1], false);
  test.end();
});

metatests.test('safe parser success', test => {
  const parser = common.safe(JSON.parse);
  const result = parser('{"a":5}');
  test.strictSame(!!result[0], false);
  test.strictSame(!!result[1], true);
  test.end();
});

metatests.test('safe parser fail', test => {
  const parser = common.safe(JSON.parse);
  const result = parser('{a:}');
  test.strictSame(!!result[0], true);
  test.strictSame(!!result[1], false);
  test.end();
});

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

metatests.test('Check called filename/filepath custom stack', test => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 1;
  const stack = new Error().stack;
  Error.stackTraceLimit = limit;
  test.strictSame(common.callerFilepath(0, stack), '');
  test.strictSame(common.callerFilename(0, stack), '');
  test.end();
});
