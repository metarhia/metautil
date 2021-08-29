'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Security: hashPassword', async (test) => {
  const password = 'password';
  const hash = await metautil.hashPassword(password);
  test.strictSame(typeof hash, 'string');
  test.strictSame(hash.length, 170);
  test.end();
});

metatests.test('Security: validatePassword', async (test) => {
  const password = 'password';
  const hash = await metautil.hashPassword(password);
  const valid = await metautil.validatePassword(password, hash);
  test.strictSame(valid, true);
  test.end();
});

metatests.test('Hash: md5', async (test) => {
  const hash = await metautil.md5('./.npmignore');
  test.strictSame(hash, 'aeaef7191e38bcaa361fd13b83aacf2e');
  test.end();
});
