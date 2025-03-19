'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metatests = require('metatests');
const metautil = require('..');

const testRandom = (random) => {
  {
    const value = random(100, 100);
    assert.strictEqual(typeof value, 'number');
    assert.strictEqual(value, 100);
  }
  {
    const value = random(-100, -100);
    assert.strictEqual(typeof value, 'number');
    assert.strictEqual(value, -100);
  }
  {
    const value = random(0, 0);
    assert.strictEqual(typeof value, 'number');
    assert.strictEqual(value, 0);
  }
  for (let i = 0; i < 200; i++) {
    const value = random();
    assert.strictEqual(typeof value, 'number');
    assert(value >= 0);
    assert(value <= 1);
  }
  for (let i = 0; i < 200; i++) {
    const value = random(100);
    assert.strictEqual(typeof value, 'number');
    assert(value >= 0);
    assert(value <= 100);
  }
  for (let i = 0; i < 200; i++) {
    const value = random(100, 200);
    assert.strictEqual(typeof value, 'number');
    assert(value >= 100);
    assert(value <= 200);
  }
};

test('Crypto: cryptoRandom', async () => {
  testRandom(metautil.cryptoRandom);
});

test('Crypto: random', async () => {
  testRandom(metautil.random);
});

const CHARS = 'ABCD';

metatests.case(
  'Crypto: identification utilities',
  { metautil },
  {
    'metautil.generateKey': [
      [CHARS, 5, (s) => s.split('').every((c) => CHARS.includes(c))],
      [CHARS, 5, (s) => s.length === 5],
      ['AAA', 5, 'AAAAA'],
      ['A', 5, 'AAAAA'],
      [CHARS, 0, ''],
      [CHARS, -1, ''],
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
  },
);

test('Crypto: hashing passwords', async () => {
  const password = 'password';

  const hash = await metautil.hashPassword(password);
  assert.strictEqual(typeof hash, 'string');
  assert.strictEqual(hash.length, 170);

  const res = metautil.deserializeHash(hash);
  assert.strictEqual(res.params.N, 32768);
  assert.strictEqual(res.params.r, 8);
  assert.strictEqual(res.params.p, 1);
  assert.strictEqual(res.params.maxmem, 67108864);
  assert.strictEqual(res.salt.length, 32);
  assert.strictEqual(res.hash.length, 64);

  const serialized = metautil.serializeHash(res.hash, res.salt);
  assert.strictEqual(serialized.length, 170);

  const valid = await metautil.validatePassword(password, hash);
  assert(valid, true);
});

test('Crypto: md5', async () => {
  const hash = await metautil.md5('./.npmignore');
  assert.strictEqual(hash, '8278a9c6e40823bd7fde51d4ce8ac3f8');
});

test('Crypto: x509 names', async () => {
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
  assert.deepStrictEqual(names, expected);
});
