'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Crypto: hashPassword', async (test) => {
  const password = 'password';
  const hash = await metautil.hashPassword(password);
  test.strictSame(typeof hash, 'string');
  test.strictSame(hash.length, 170);
  test.end();
});

metatests.test('Crypto: validatePassword', async (test) => {
  const password = 'password';
  const hash = await metautil.hashPassword(password);
  const valid = await metautil.validatePassword(password, hash);
  test.strictSame(valid, true);
  test.end();
});

metatests.test('Crypto: md5', async (test) => {
  const hash = await metautil.md5('./.npmignore');
  test.strictSame(hash, '8278a9c6e40823bd7fde51d4ce8ac3f8');
  test.end();
});

metatests.test('Crypto: md5', async (test) => {
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

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const secret = 'secret';
const length = 64;

metatests.case(
  'Crypto: Identification utilities',
  { metautil },
  {
    'metautil.validateToken': [
      [
        secret,
        'XFHczfaqXaaUmIcKfHNF9YAY4BRaMX5Z4Bx99rsB5UA499mTjmewlrWTKTCp77bc',
        true,
      ],
      [
        secret,
        'XFHczfaqXaaUmIcKfHNF9YAY4BRaMX5Z4Bx99rsB5UA499mTjmewlrWTKTCp77bK',
        false,
      ],
      [
        secret,
        '2XpU8oAewXwKJJSQeY0MByY403AyXprFdhB96zPFbpJxlBqHA3GfBYeLxgHxBhhZ',
        false,
      ],
      [secret, 'WRONG-STRING', false],
      [secret, '', false],
    ],
    'metautil.generateToken': [
      [
        secret,
        characters,
        length,
        (token) => metautil.validateToken(secret, token),
      ],
    ],
    'metautil.crcToken': [
      [
        secret,
        metautil.generateKey(length - 4, characters),
        (crc) => crc.length === 4,
      ],
    ],
  },
);
