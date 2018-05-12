'use strict';

api.metatests.test('ipToInt', (test) => {
  const ip = '8.8.8.8';
  const ipNum = 0x08080808;
  test.strictSame(api.common.ipToInt(ip), ipNum);
  test.end();
});

api.metatests.test('ipToInt default', (test) => {
  const ipNum = 0x7F000001;
  test.strictSame(api.common.ipToInt(), ipNum);
  test.end();
});

api.metatests.test('parseHost', (test) => {
  const host = 'localhost:8080';
  test.strictSame(api.common.parseHost(host), 'localhost');
  test.end();
});

api.metatests.test('parseHost empty', (test) => {
  const host = '';
  test.strictSame(api.common.parseHost(host), 'no-host-name-in-http-headers');
  test.end();
});
