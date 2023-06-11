'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.case(
  'HTTP parsers',
  { metautil },
  {
    'metautil.parseHost': [
      ['', 'no-host-name-in-http-headers'],
      ['domain.com', 'domain.com'],
      ['localhost', 'localhost'],
      ['domain.com:8080', 'domain.com'],
      ['localhost:8080', 'localhost'],
    ],
    'metautil.parseParams': [
      ['a=1&b=2', { a: '1', b: '2' }],
      ['a=1b=2', { a: '1b=2' }],
      ['a=1', { a: '1' }],
      ['a=1&', { a: '1' }],
      ['a=', { a: '' }],
      ['a', { a: '' }],
    ],
    'metautil.parseCookies': [
      ['a=1;b=2', { a: '1', b: '2' }],
      ['a=1 ;b= 2', { a: '1', b: '2' }],
      ['a=1; b = 2 ', { a: '1', b: '2' }],
      ['a=1', { a: '1' }],
    ],
    'metautil.parseRange': [
      ['bytes=1000-2000', { start: 1000, end: 2000 }],
      ['bytes=0-0', { start: 0, end: 0 }],
      ['bytes=1000-', { start: 1000 }],
      ['bytes=-1000', { tail: 1000 }],
      ['bytes=1000 2000', {}],
      ['bytes=10002000', {}],
      ['bytes1000-2000', {}],
      ['1000-2000', {}],
      ['bytes', {}],
      ['=-', {}],
      ['', {}],
    ],
  },
);

metatests.test('HTTP: parseRange', async (test) => {
  const headers = { range: 'bytes=1000-2000' };
  const range = metautil.parseRange(headers.range);
  test.strictSame(range.start, 1000);
  test.strictSame(range.end, 2000);
  test.end();
});
