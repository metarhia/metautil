'use strict';

const metatests = require('metatests');
const metautil = require('..');

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const secret = 'secret';
const length = 64;

metatests.case(
  'Identification utilities',
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
  }
);
