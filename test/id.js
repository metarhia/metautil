'use strict';

/*eslint max-len: ["error", { "code": 120 }]*/

const metatests = require('metatests');
const common = require('..');

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const secret = 'secret';
const length = 64;

metatests.case(
  'Common / id',
  { common },
  {
    'common.validateToken': [
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
    'common.generateToken': [
      [
        secret,
        characters,
        length,
        token => common.validateToken(secret, token),
      ],
    ],
    'common.crcToken': [
      [
        secret,
        common.generateKey(length - 4, characters),
        crc => crc.length === 4,
      ],
    ],
    'common.idToChunks': [
      [0, ['0000', '0000']],
      [1, ['0001', '0000']],
      [30, ['001e', '0000']],
      [123456789, ['cd15', '075b']],
      [123456789123, ['1a83', 'be99', '001c']],
      [9007199254740991, ['ffff', 'ffff', 'ffff', '001f']],
    ],
    'common.idToPath': [
      [0, '0000/0000'],
      [1, '0001/0000'],
      [30, '001e/0000'],
      [123456789, 'cd15/075b'],
      [123456789123, '1a83/be99/001c'],
      [9007199254740991, 'ffff/ffff/ffff/001f'],
    ],
    'common.pathToId': [
      ['0000/0000', 0],
      ['0001/0000', 1],
      ['001e/0000', 30],
      ['1000/0000', 4096],
      ['ffff/0000', 65535],
      ['0000/0001', 65536],
      ['e240/0001', 123456],
      ['0000/001e', 1966080],
      ['cd15/075b', 123456789],
      ['0000/1000', 268435456],
      ['0000/ffff', 4294901760],
      ['0000/0000/0001', 4294967296],
      ['1a83/be99/001c', 123456789123],
      ['0000/0000/1000', 17592186044416],
      ['0000/0000/ffff', 281470681743360],
      ['ffff/ffff/ffff/001f', 9007199254740991],
    ],
  }
);

metatests.test('generateStorageKey', test => {
  const key = common.generateStorageKey();
  test.strictSame(Array.isArray(key), true);
  test.strictSame(key.length, 3);
  const [dir1, dir2, file] = key;
  test.strictSame(dir1.length, 2);
  test.strictSame(dir2.length, 2);
  test.strictSame(file.length, 8);
  test.strictSame(key.join('/').length, 14);
  test.end();
});

metatests.test('common.hash() with common.validateHash()', test => {
  const password = 'password';
  const salt = 'salt';
  const hashValue = common.hash(password, salt);
  test.assert(common.validateHash(hashValue, password, salt));
  test.end();
});

metatests.test('generateGUID', test => {
  const guidRegExp = new RegExp(
    '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    'i'
  );
  const guid = common.generateGUID();
  test.assert(guidRegExp.test(guid));
  test.end();
});
