'use strict';

/*eslint max-len: ["error", { "code": 120 }]*/

const config = {
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  secret: 'secret',
  length: 64
};

api.metatests.case('Common / id', {
  'common.validateSID': [
    [config, 'XFHczfaqXaaUmIcKfHNF9YAY4BRaMX5Z4Bx99rsB5UA499mTjmewlrWTKTCp77bc',  true],
    [config, 'XFHczfaqXaaUmIcKfHNF9YAY4BRaMX5Z4Bx99rsB5UA499mTjmewlrWTKTCp77bK', false],
    [config, '2XpU8oAewXwKJJSQeY0MByY403AyXprFdhB96zPFbpJxlBqHA3GfBYeLxgHxBhhZ', false],
    [config, 'WRONG-STRING',                                                     false],
    [config, '',                                                                 false],
  ],
  'common.generateSID': [
    [config, (result) => (result.length === 64)],
  ],
  'common.crcSID': [
    [
      config,
      api.common.generateKey(
        config.length - 4,
        config.characters
      ),
      (result)  => (result.length === 4)
    ]
  ],
  'common.idToChunks': [
    [0,                ['0000', '0000']],
    [1,                ['0001', '0000']],
    [30,               ['001e', '0000']],
    [123456789,        ['cd15', '075b']],
    [123456789123,     ['1a83', 'be99', '001c']],
    [9007199254740991, ['ffff', 'ffff', 'ffff', '001f']]
  ],
  'common.idToPath': [
    [0,                '0000/0000'],
    [1,                '0001/0000'],
    [30,               '001e/0000'],
    [123456789,        'cd15/075b'],
    [123456789123,     '1a83/be99/001c'],
    [9007199254740991, 'ffff/ffff/ffff/001f']
  ],
  'common.pathToId': [
    ['0000/0000',           0],
    ['0001/0000',           1],
    ['001e/0000',           30],
    ['cd15/075b',           123456789],
    ['1a83/be99/001c',      123456789123],
    ['ffff/ffff/ffff/001f', 9007199254740991]
  ]
});

//console.dir(idToChunks());

api.metatests.test('generateStorageKey', (test) => {
  const key = api.common.generateStorageKey();
  test.strictSame(Array.isArray(key), true);
  test.strictSame(key.length, 3);
  const [dir1, dir2, file] = key;
  test.strictSame(dir1.length, 2);
  test.strictSame(dir2.length, 2);
  test.strictSame(file.length, 8);
  test.strictSame(key.join('/').length, 14);
  test.end();
});
