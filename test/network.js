'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.case(
  'Network utilities',
  { metautil },
  {
    'metautil.ipToInt': [
      ['127.0.0.1', 2130706433],
      ['10.0.0.1', 167772161],
      ['192.168.1.10', -1062731510],
      ['165.225.133.150', -1511946858],
      ['0.0.0.0', 0],
      ['wrong-string', Number.NaN],
      ['', 0],
      ['8.8.8.8', 0x08080808],
      [undefined, 0x7f000001],
    ],
    'metautil.parseHost': [
      ['', 'no-host-name-in-http-headers'],
      ['domain.com', 'domain.com'],
      ['localhost', 'localhost'],
      ['domain.com:8080', 'domain.com'],
      ['localhost:8080', 'localhost'],
    ],
  }
);
