'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Introspection: getSignature', async (test) => {
  const method = ({ a, b, c }) => ({ a, b, c });
  const signature = metautil.getSignature(method);
  test.strictSame(signature, ['a', 'b', 'c']);
  test.end();
});
