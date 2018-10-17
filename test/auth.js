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

metatests.test('test checkLogin / IS_EMAIL', test => {
  const emails = [
    'local-part@domain',
    'l@dom',
  ];
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

metatests.test('test AuthenticationStrength / strength', test => {
  let password = 'pass';
  const required = [{ name: 'MIN_LENGTH', minLength: 5 }];
  const optional = [
    { name: 'MAX_REPEATED_CHARS', number: 2 },
    { name: 'MIN_SPECIAL_CHARS', number: 1 },
    { name: 'MIN_UPPERCASE_CHARS', number: 1 },
    { name: 'MIN_NUMBERS', number: 1 },
  ];

  let result = common.checkPassword(password, required, optional);
  test.strictSame(result.strength, 'Not valid');

  password = 'passsword';
  result = common.checkPassword(password, required, optional);
  test.strictSame(result.strength, 'Very weak');

  password = 'password';
  result = common.checkPassword(password, required, optional);
  test.strictSame(result.strength, 'Weak');

  password = 'password!';
  result = common.checkPassword(password, required, optional);
  test.strictSame(result.strength, 'Good');

  password = 'Password!';
  result = common.checkPassword(password, required, optional);
  test.strictSame(result.strength, 'Strong');

  password = 'Password!1';
  result = common.checkPassword(password, required, optional);
  test.strictSame(result.strength, 'Very strong');
  test.end();
});
