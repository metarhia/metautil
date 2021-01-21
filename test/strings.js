'use strict';

/*eslint max-len: ["error", { "code": 120 }]*/

const metatests = require('metatests');
const common = require('..');

metatests.case(
  'Metarhia common library',
  { common },
  {
    'common.replace': [
      ['a2a2a2', 'a2', 'z', 'zzz'],
      ['k2k2k2', 'a2', 'z', 'k2k2k2'],
      ['', 'a2', 'z', ''],
      ['a2', '', 'z', 'a2'],
      ['a2', 'a2', '', ''],
      ['a2', 'a2', 'a2', 'a2'],
      ['a2a2a2', 'a2', 'a2', 'a2a2a2'],
      ['a20w10z2a22aa0', 'a2', '', '0w10z22aa0'],
    ],
    'common.fileExt': [
      ['/dir/dir/file.txt', 'txt'],
      ['/dir/dir/file.txt', 'txt'],
      ['\\dir\\file.txt', 'txt'],
      ['/dir/dir/file.txt', 'txt'],
      ['/dir/file.txt', 'txt'],
      ['/dir/file.TXt', 'txt'],
      ['//file.txt', 'txt'],
      ['file.txt', 'txt'],
      ['/dir.ext/', 'ext'],
      ['/dir/', ''],
      ['/', ''],
      ['.', ''],
      ['', ''],
    ],
    'common.between': [
      ['abcdefghijk', 'cd', 'h', 'efg'],
      ['field="value"', '"', '"', 'value'],
      ['field:"value"', '"', '"', 'value'],
      ['field[value]', '[', ']', 'value'],
      ['kjihgfedcba', 'cd', 'h', ''],
      ['kjihgfedcba', 'dc', 'h', ''],
      ['field="value"', '=', '=', ''],
      ['field[value]', '{', '}', ''],
      ['{a:"b",c:"d"}', '"', '"', 'b'],
      ['abcdefghijk', 'cd', 'efghijk'],
    ],
    'common.isFirstUpper': [
      ['Abcd', true],
      ['abcd', false],
      ['aBCD', false],
      ['', false],
    ],
  }
);
