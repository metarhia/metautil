'use strict';

const tap = require('tap');
const common = require('..');

tap.test('ipToInt', (test) => {
  const ip = '8.8.8.8';
  const ipNum = 0x08080808;
  test.strictSame(common.ipToInt(ip), ipNum);
  test.end();
});

tap.test('ipToInt default', (test) => {
  const ipNum = 0x7F000001;
  test.strictSame(common.ipToInt(), ipNum);
  test.end();
});

tap.test('parseHost', (test) => {
  const host = 'localhost:8080';
  test.strictSame(common.parseHost(host), 'localhost');
  test.end();
});

tap.test('parseHost empty', (test) => {
  const host = '';
  test.strictSame(common.parseHost(host), 'no-host-name-in-http-headers');
  test.end();
});
