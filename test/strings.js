'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.case(
  'String functions',
  { metautil },
  {
    'metautil.replace': [
      ['a2a2a2', 'a2', 'z', 'zzz'],
      ['k2k2k2', 'a2', 'z', 'k2k2k2'],
      ['', 'a2', 'z', ''],
      ['a2', '', 'z', 'a2'],
      ['a2', 'a2', '', ''],
      ['a2', 'a2', 'a2', 'a2'],
      ['a2a2a2', 'a2', 'a2', 'a2a2a2'],
      ['a20w10z2a22aa0', 'a2', '', '0w10z22aa0'],
    ],
    'metautil.fileExt': [
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
    'metautil.between': [
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
    'metautil.isFirstUpper': [
      ['Abcd', true],
      ['abcd', false],
      ['aBCD', false],
      ['', false],
    ],
    'metautil.isConstant': [
      ['UPPER', true],
      ['UPPER_SNAKE', true],
      ['lowercase', false],
      ['camelCase', false],
      ['PascalCase', false],
      ['snake_case', false],
    ],
  }
);
