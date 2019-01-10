'use strict';

const metatests = require('metatests');
const { Flags, Uint64 } = require('..');

metatests.test('FlagsClass.from', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  test.type(Numeri, 'function');

  const num = Numeri.from('Due', 'Tre');

  test.type(num, 'object');
  test.strictSame(num.get('Uno'), false);
  test.strictSame(num.get('Due'), true);
  test.strictSame(num.get('Tre'), true);
  test.strictSame(num.get('Quatro'), false);

  test.end();
});

metatests.test('new FlagsClass', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  test.type(Numeri, 'function');

  const num = new Numeri('Due', 'Tre');

  test.type(num, 'object');
  test.strictSame(num.get('Uno'), false);
  test.strictSame(num.get('Due'), true);
  test.strictSame(num.get('Tre'), true);
  test.strictSame(num.get('Quatro'), false);

  test.end();
});

metatests.test('new FlagsClass from Uint64', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  test.type(Numeri, 'function');

  const num = new Numeri(new Uint64('0b10110'));

  test.type(num, 'object');
  test.strictSame(num.get('Uno'), false);
  test.strictSame(num.get('Due'), true);
  test.strictSame(num.get('Tre'), true);
  test.strictSame(num.get('Quatro'), false);

  test.end();
});

metatests.test('FlagsClass.get', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from('Due', 'Tre');

  test.strictSame(num.get('Uno'), false);
  test.strictSame(num.get('Due'), true);
  test.strictSame(num.get('Tre'), true);
  test.strictSame(num.get('Quatro'), false);

  test.end();
});

metatests.test('FlagsClass.has', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');

  test.strictSame(Numeri.has('Uno'), true);
  test.strictSame(Numeri.has('Due'), true);
  test.strictSame(Numeri.has('Tre'), true);
  test.strictSame(Numeri.has('Quatro'), true);

  test.strictSame(Numeri.has('Cinque'), false);
  test.strictSame(Numeri.has('Sei'), false);

  test.end();
});

metatests.test('FlagsClass.set', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from();

  num.set('Due');
  num.set('Tre');

  test.strictSame(num.get('Due'), true);
  test.strictSame(num.get('Tre'), true);

  num.set('Due');
  num.set('Tre');

  test.strictSame(num.get('Due'), true);
  test.strictSame(num.get('Tre'), true);

  test.end();
});

metatests.test('FlagsClass.unset', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from('Due', 'Tre');

  num.unset('Due');
  num.unset('Tre');

  test.strictSame(num.get('Due'), false);
  test.strictSame(num.get('Tre'), false);

  num.unset('Due');
  num.unset('Tre');

  test.strictSame(num.get('Due'), false);
  test.strictSame(num.get('Tre'), false);

  test.end();
});

metatests.test('FlagsClass.toggle', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from();

  num.toggle('Due');
  num.toggle('Tre');

  test.strictSame(num.get('Due'), true);
  test.strictSame(num.get('Tre'), true);

  num.toggle('Due');
  num.toggle('Tre');

  test.strictSame(num.get('Due'), false);
  test.strictSame(num.get('Tre'), false);

  test.end();
});

metatests.test('FlagsClass.toString', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const nums = [
    [[], '0000'],
    [['Uno'], '0001'],
    [['Due'], '0010'],
    [['Tre'], '0100'],
    [['Quatro'], '1000'],
    [['Uno', 'Due'], '0011'],
    [['Due', 'Tre'], '0110'],
    [['Uno', 'Quatro'], '1001'],
    [['Tre', 'Quatro'], '1100'],
    [['Uno', 'Due', 'Tre', 'Quatro'], '1111'],
  ];
  nums.forEach(num =>
    test.strictSame(Numeri.from(...num[0]).toString(), num[1])
  );

  test.end();
});

metatests.test('FlagsClass.toNumber', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const nums = [
    [[], false],
    [['Uno'], 1],
    [['Due'], 2],
    [['Tre'], 4],
    [['Quatro'], 8],
    [['Uno', 'Due'], 3],
    [['Due', 'Tre'], 6],
    [['Uno', 'Quatro'], 9],
    [['Tre', 'Quatro'], 12],
    [['Uno', 'Due', 'Tre', 'Quatro'], 15],
  ];
  nums.forEach(num =>
    test.strictSame(Numeri.from(...num[0]).toNumber(), new Uint64(num[1]))
  );

  test.end();
});

metatests.test('FlagsClass.toPrimitive', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const nums = [
    [[], 0],
    [['Uno'], 1],
    [['Due'], 2],
    [['Tre'], 4],
    [['Quatro'], 8],
    [['Uno', 'Due'], 3],
    [['Due', 'Tre'], 6],
    [['Uno', 'Quatro'], 9],
    [['Tre', 'Quatro'], 12],
    [['Uno', 'Due', 'Tre', 'Quatro'], 15],
  ];
  nums.forEach(num => test.strictSame(+Numeri.from(...num[0]), num[1]));

  test.end();
});

metatests.test('Create new instance with too much arguments', test => {
  const values = new Array(65);
  const message = 'Flags does not support more than 64 values';
  test.throws(() => {
    Flags.from(...values);
  }, new TypeError(message));
  test.end();
});

metatests.test('Get incorrect key', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from();
  const message = 'Flags instance does not have key Cinque';
  test.throws(() => {
    num.get('Cinque');
  }, new TypeError(message));
  test.end();
});

metatests.test('Set incorrect key', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from();
  const message = 'Flags instance does not have key Cinque';
  test.throws(() => {
    num.set('Cinque');
  }, new TypeError(message));
  test.end();
});

metatests.test('Unset incorrect key', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from();
  const message = 'Flags instance does not have key Cinque';
  test.throws(() => {
    num.unset('Cinque');
  }, new TypeError(message));
  test.end();
});

metatests.test('Toggle incorrect key', test => {
  const Numeri = Flags.from('Uno', 'Due', 'Tre', 'Quatro');
  const num = Numeri.from();
  const message = 'Flags instance does not have key Cinque';
  test.throws(() => {
    num.toggle('Cinque');
  }, new TypeError(message));
  test.end();
});
