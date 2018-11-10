'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('identity function', test => {
  test.strictSame(common.id(10), 10);
  test.strictSame(common.id({ data: 10 }), { data: 10 });
  test.end();
});

metatests.test('async identity function', test => {
  let sync = true;
  const cb = (err, data) => {
    test.error(err);
    test.assertNot(sync);
    test.strictSame(data, { data: 10 });
    test.end();
  };

  common.asyncId({ data: 10 }, cb);
  sync = false;
});
