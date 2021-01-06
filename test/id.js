'use strict';

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
        (token) => common.validateToken(secret, token),
      ],
    ],
    'common.crcToken': [
      [
        secret,
        common.generateKey(length - 4, characters),
        (crc) => crc.length === 4,
      ],
    ],
  }
);
