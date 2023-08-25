'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Crypto: cryptoRandom', async (test) => {
  for (let i = 0; i < 200; i++) {
    const value = await metautil.cryptoRandom();
    test.strictSame(typeof value, 'number');
    test.assert(value >= 0, true);
    test.assert(value <= 1, true);
  }
  for (let i = 0; i < 200; i++) {
    const value = await metautil.cryptoRandom(100);
    test.strictSame(typeof value, 'number');
    test.assert(value >= 0, true);
    test.assert(value <= 100, true);
  }
  for (let i = 0; i < 200; i++) {
    const value = await metautil.cryptoRandom(100, 200);
    test.strictSame(typeof value, 'number');
    test.assert(value >= 100, true);
    test.assert(value <= 200, true);
  }
  test.end();
});

const CHARS = 'ABCD';

metatests.case(
  'Crypto: identification utilities',
  { metautil },
  {
    'metautil.generateKey': [
      [5, CHARS, (s) => s.split('').every((c) => CHARS.includes(c))],
      [5, CHARS, (s) => s.length === 5],
      [5, 'AAA', 'AAAAA'],
      [5, 'A', 'AAAAA'],
      [0, CHARS, ''],
      [-1, CHARS, ''],
    ],
    'metautil.crcToken': [
      ['secret', '123456', '992f'],
      ['secret', '654321', 'ea2f'],
      ['anothersecret', '123456', '71f1'],
      ['', '123456', 'e10a'],
      ['secret', '', '5ebe'],
    ],
    'metautil.generateToken': [
      ['secret', 'ABC', 10, (s) => s.length === 10],
      ['secret', 'AAA', 10, (s) => s.length === 10],
      ['secret', 'A', 10, (s) => s.length === 10],
      ['secret', 'ABC', 0, ''],
      ['secret', 'ABC', -1, ''],
      ['secret', '', 10, ''],
      ['', 'ABC', 10, ''],
    ],
    'metautil.validateToken': [
      [
        'secret',
        'XFHczfaqXaaUmIcKfHNF9YAY4BRaMX5Z4Bx99rsB5UA499mTjmewlrWTKTCp77bc',
        true,
      ],
      [
        'secret',
        'XFHczfaqXaaUmIcKfHNF9YAY4BRaMX5Z4Bx99rsB5UA499mTjmewlrWTKTCp77bK',
        false,
      ],
      [
        'secret',
        '2XpU8oAewXwKJJSQeY0MByY403AyXprFdhB96zPFbpJxlBqHA3GfBYeLxgHxBhhZ',
        false,
      ],
      ['secret', 'WRONG-STRING', false],
      ['secret', '', false],
    ],
    'metautil.random': [
      [0, 10, (result) => result >= 0 && result <= 10],
      [1, 10, (result) => result >= 1 && result <= 10],
      [-1, 10, (result) => result >= -1 && result <= 10],
      [10, 20, (result) => result >= 10 && result <= 20],
      [10, 0, (result) => result >= 0 && result <= 10],
      [20, (result) => result >= 0 && result <= 20],
      [10, 10, 10],
    ],
  },
);

metatests.test('Crypto: hashing passwords', async (test) => {
  const password = 'password';

  const hash = await metautil.hashPassword(password);
  test.strictSame(typeof hash, 'string');
  test.strictSame(hash.length, 170);

  const res = metautil.deserializeHash(hash);
  test.strictEqual(res.params.N, 32768);
  test.strictEqual(res.params.r, 8);
  test.strictEqual(res.params.p, 1);
  test.strictEqual(res.params.maxmem, 67108864);
  test.strictEqual(res.salt.length, 32);
  test.strictEqual(res.hash.length, 64);

  const serialized = metautil.serializeHash(res.hash, res.salt);
  test.strictSame(serialized.length, 170);

  const valid = await metautil.validatePassword(password, hash);
  test.strictSame(valid, true);

  test.end();
});

metatests.test('Crypto: md5', async (test) => {
  const hash = await metautil.md5('./.npmignore');
  test.strictSame(hash, '8278a9c6e40823bd7fde51d4ce8ac3f8');
  test.end();
});

metatests.test('Crypto: x509 names', async (test) => {
  const cert = {
    subject: 'CN=localhost',
    subjectAltName:
      'DNS:example.com, DNS:hello.example.com, DNS:hello1.example.com, ' +
      'DNS:hello2.example.com, ' +
      'IP Address:127.0.0.1, IP Address:0:0:0:0:0:0:0:1',
  };
  const names = metautil.getX509names(cert);
  const expected = [
    'localhost',
    'example.com',
    'hello.example.com',
    'hello1.example.com',
    'hello2.example.com',
  ];
  test.strictSame(names, expected);
  test.end();
});
