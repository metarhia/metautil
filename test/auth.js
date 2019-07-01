'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('test checkPassword / MIN_LENGTH', test => {
  const password = 'password';
  const passedResult = common.checkPassword(password, [
    { name: 'MIN_LENGTH', minLength: password.length },
  ]);
  const failedResult = common.checkPassword(password, [
    { name: 'MIN_LENGTH', minLength: password.length + 1 },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / MAX_LENGTH', test => {
  const password = 'password';
  const passedResult = common.checkPassword(password, [
    { name: 'MAX_LENGTH', maxLength: password.length },
  ]);
  const failedResult = common.checkPassword(password, [
    { name: 'MAX_LENGTH', maxLength: password.length - 1 },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / MIN_PASSPHRASE_LENGTH', test => {
  const password = 'password';
  const passedResult = common.checkPassword(password, [
    { name: 'MIN_PASSPHRASE_LENGTH', minLength: password.length },
  ]);
  const failedResult = common.checkPassword(password, [
    { name: 'MIN_PASSPHRASE_LENGTH', minLength: password.length + 1 },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / MAX_REPEATED_CHARS', test => {
  const password = 'password';
  const passedResult = common.checkPassword(password, [
    {
      name: 'MAX_REPEATED_CHARS',
      number: 2,
    },
  ]);
  const failedResult = common.checkPassword(password, [
    {
      name: 'MAX_REPEATED_CHARS',
      number: 1,
    },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / MIN_LOWERCASE_CHARS', test => {
  const password = 'PASSword𞥃';
  const passedResult = common.checkPassword(password, [
    {
      name: 'MIN_LOWERCASE_CHARS',
      number: 5,
    },
  ]);
  const failedResult = common.checkPassword(password, [
    {
      name: 'MIN_LOWERCASE_CHARS',
      number: 6,
    },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / MIN_UPPERCASE_CHARS', test => {
  const password = 'PASSword𞤡';
  const passedResult = common.checkPassword(password, [
    {
      name: 'MIN_UPPERCASE_CHARS',
      number: 5,
    },
  ]);
  const failedResult = common.checkPassword(password, [
    {
      name: 'MIN_UPPERCASE_CHARS',
      number: 6,
    },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / MIN_NUMBERS', test => {
  const password = 'pa123ss45';
  const passedResult = common.checkPassword(password, [
    {
      name: 'MIN_NUMBERS',
      number: 5,
    },
  ]);
  const failedResult = common.checkPassword(password, [
    {
      name: 'MIN_NUMBERS',
      number: 6,
    },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / FOUND_TOPOLOGY', test => {
  const topologies = ['ullllldd', 'ulldddds'];

  const passedResult = common.checkPassword('UUUU', [
    { name: 'FOUND_TOPOLOGY', topologies },
  ]);
  const failedResult = common.checkPassword('Ukk1111&', [
    { name: 'FOUND_TOPOLOGY', topologies },
  ]);
  const failedWithCustomChars = common.checkPassword('Ā𝚔𝚔1111%', [
    { name: 'FOUND_TOPOLOGY', topologies },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.strictSame(failedWithCustomChars.valid, false);
  test.end();
});

metatests.test('test checkPassword / POPULAR_PASSWORD', test => {
  const popularPasswords = ['pass'];

  const passedResult = common.checkPassword('abcd', [
    { name: 'POPULAR_PASSWORD', popularPasswords },
  ]);
  const failedResult = common.checkPassword('pass', [
    { name: 'POPULAR_PASSWORD', popularPasswords },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / MIN_SPECIAL_CHARS', test => {
  const password = 'pa!#ss&*';
  const passedResult = common.checkPassword(password, [
    {
      name: 'MIN_SPECIAL_CHARS',
      number: 4,
    },
  ]);
  const failedResult = common.checkPassword(password, [
    {
      name: 'MIN_SPECIAL_CHARS',
      number: 5,
    },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkPassword / Default', test => {
  const passedResult = common.checkPassword('abcdefghij');
  const failedResult = common.checkPassword('p');

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkLogin / MIN_LENGTH', test => {
  const login = 'login';
  const passedResult = common.checkLogin(login, [
    { name: 'MIN_LENGTH', minLength: login.length },
  ]);
  const failedResult = common.checkLogin(login, [
    { name: 'MIN_LENGTH', minLength: login.length + 1 },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkLogin / MAX_LENGTH', test => {
  const login = 'login';
  const passedResult = common.checkLogin(login, [
    { name: 'MAX_LENGTH', maxLength: login.length },
  ]);
  const failedResult = common.checkLogin(login, [
    { name: 'MAX_LENGTH', maxLength: login.length - 1 },
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkLogin / Default', test => {
  const passedResult = common.checkLogin('login1');
  const failedResultShort = common.checkLogin('short');
  const failedResultLong = common.checkLogin('too' + 'long'.repeat(30));

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResultShort.valid, false);
  test.strictSame(failedResultLong.valid, false);
  test.end();
});

metatests.test('test checkLogin / IS_EMAIL', test => {
  const emails = ['local-part@domain', 'l@dom'];
  emails.forEach(email => {
    const passedResult = common.checkLogin(email, ['IS_EMAIL']);
    test.strictSame(passedResult.valid, true);
  });

  const invalidEmails = [
    'local-part',
    'local-part@',
    'local-part@do',
    '@domain',
    'l'.repeat(65) + '@domain',
    'local-part@' + 'd'.repeat(256),
  ];
  invalidEmails.forEach(invalidEmail => {
    const failedResult = common.checkLogin(invalidEmail, ['IS_EMAIL']);
    test.strictSame(failedResult.valid, false);
  });
  test.end();
});

metatests.test('test checkLoginPassword / LOGIN_INCLUDES_PASSWORD', test => {
  const passedResult = common.checkLoginPassword('login', 'password', [
    'LOGIN_INCLUDES_PASSWORD',
  ]);
  const failedResult = common.checkLoginPassword('loginpassword', 'password', [
    'LOGIN_INCLUDES_PASSWORD',
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkLoginPassword / PASSWORD_INCLUDES_LOGIN', test => {
  const passedResult = common.checkLoginPassword('login', 'password', [
    'PASSWORD_INCLUDES_LOGIN',
  ]);
  const failedResult = common.checkLoginPassword('login', 'loginpassword', [
    'PASSWORD_INCLUDES_LOGIN',
  ]);

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult.valid, false);
  test.end();
});

metatests.test('test checkLoginPassword / Default', test => {
  const passedResult = common.checkLoginPassword('login', 'password');
  const failedResult1 = common.checkLoginPassword('loginpassword', 'password');
  const failedResult2 = common.checkLoginPassword('login', 'loginpassword');

  test.strictSame(passedResult.valid, true);
  test.strictSame(failedResult1.valid, false);
  test.strictSame(failedResult2.valid, false);
  test.end();
});

metatests.test('test AuthenticationStrength / compliance', test => {
  let password = 'pass';
  const required = [{ name: 'MIN_LENGTH', minLength: 5 }];
  const optional = [
    { name: 'MAX_REPEATED_CHARS', number: 2 },
    { name: 'MIN_SPECIAL_CHARS', number: 1 },
    { name: 'MIN_UPPERCASE_CHARS', number: 1 },
    { name: 'MIN_NUMBERS', number: 1 },
  ];

  let result = common.checkPassword(password, required, optional);
  test.assertNot(result.valid);
  test.strictSame(result.compliance, 0.25);

  password = 'passsword';
  result = common.checkPassword(password, required, optional);
  test.assert(result.valid);
  test.strictSame(result.compliance, 0);

  password = 'password';
  result = common.checkPassword(password, required, optional);
  test.assert(result.valid);
  test.strictSame(result.compliance, 0.25);

  password = 'password!';
  result = common.checkPassword(password, required, optional);
  test.assert(result.valid);
  test.strictSame(result.compliance, 0.5);

  password = 'Password!';
  result = common.checkPassword(password, required, optional);
  test.assert(result.valid);
  test.strictSame(result.compliance, 0.75);

  password = 'Password!1';
  result = common.checkPassword(password, required, optional);
  test.assert(result.valid);
  test.strictSame(result.compliance, 1);

  test.end();
});
