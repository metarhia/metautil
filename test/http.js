'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('HTTP: parseRange', async (test) => {
  const headers = { range: 'bytes=1000-2000' };
  const range = metautil.parseRange(headers.range);
  test.strictSame(range.start, 1000);
  test.strictSame(range.end, 2000);
  test.end();
});
