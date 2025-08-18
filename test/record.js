'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { Record } = require('..');

test('Record.create() (immutable)', () => {
  const Emperor = Record.immutable({ id: 0, name: '' });
  const marcus = Emperor.create({ id: 1, name: 'Marcus Aurelius' });
  assert.deepEqual(marcus, { id: 1, name: 'Marcus Aurelius' });
  assert(Object.isFrozen(marcus));
});

test('Record.create() (mutable)', () => {
  const Emperor = Record.mutable({ id: 0, name: '' });
  const commodus = Emperor.create({ id: 2, name: 'Commodus' });
  assert.deepEqual(commodus, { id: 2, name: 'Commodus' });
  assert(Object.isSealed(commodus));
});

test('Record.create() uses defaults if missing fields', () => {
  const Emperor = Record.immutable({ id: 0, name: 'Unknown' });
  const defaulted = Emperor.create();
  assert.deepEqual(defaulted, { id: 0, name: 'Unknown' });
});

test('Record.create() fills missing field with default', () => {
  const Emperor = Record.immutable({ id: 0, name: 'Unknown' });
  const result = Emperor.create({ id: 42 });
  assert.deepEqual(result, { id: 42, name: 'Unknown' });
});

test('Record.update() mutates sealed objects with type check', () => {
  const Emperor = Record.mutable({ id: 0, name: '' });
  const hadrian = Emperor.create({ id: 3, name: 'Hadrian' });
  Record.update(hadrian, { name: 'Publius Hadrianus' });
  assert.equal(hadrian.name, 'Publius Hadrianus');
});

test('Record.update() throws on update immutable', () => {
  const Emperor = Record.immutable({ id: 0, name: '' });
  const antoninus = Emperor.create({ id: 4, name: 'Antoninus Pius' });
  assert.throws(() => {
    Record.update(antoninus, { name: 'Titus Aurelius' });
  }, /Cannot mutate immutable Record/);
});

test('Record.fork() clone immutable', () => {
  const Emperor = Record.immutable({ id: 0, name: '' });
  const lucius = Emperor.create({ id: 5, name: 'Lucius Verus' });
  const forked = Record.fork(lucius, { name: 'Lucius Aelius' });
  assert.notEqual(forked, lucius);
  assert.equal(forked.name, 'Lucius Aelius');
  assert.equal(forked.id, 5);
  assert(Object.isFrozen(forked));
});

test('Record.branch() builds prototype chain with overrides', () => {
  const Emperor = Record.immutable({ id: 0, name: '', title: '' });

  const base = Emperor.create({
    id: 6,
    name: 'Marcus Aurelius',
    title: 'Philosopher King',
  });

  const branch1 = Record.branch(base, { name: 'Marcus' });
  const branch2 = Record.branch(branch1, { title: 'Imperator' });

  assert.equal(branch2.name, 'Marcus');
  assert.equal(branch2.title, 'Imperator');
  assert.equal(branch2.id, 6);
  assert(Object.getPrototypeOf(branch2) === branch1);
  assert(Object.getPrototypeOf(branch1) === base);
});

test('Record throws on type mismatch during creation and update', () => {
  const Emperor = Record.immutable({ id: 0, name: '' });

  assert.throws(() => {
    Emperor.create({ id: 'not-a-number', name: 'Trajan' });
  }, /expected number, got string/);

  const Mutable = Record.mutable({ id: 0, name: '' });
  const nerva = Mutable.create({ id: 7, name: 'Nerva' });

  assert.throws(() => {
    Record.update(nerva, { id: 'eight' });
  }, /expected number, got string/);

  assert.throws(() => {
    Record.fork(nerva, { id: 'IX' });
  }, /expected number, got string/);

  assert.throws(() => {
    Record.branch(nerva, { id: 'X' });
  }, /expected number, got string/);
});

test('Record.create() ignores unknown fields', () => {
  const Emperor = Record.immutable({ id: 0, name: '' });
  const result = Emperor.create({
    id: 10,
    name: 'Antoninus',
    title: 'Pius',
  });
  assert.deepEqual(result, { id: 10, name: 'Antoninus' });
});

test('Record.branch() maintains immutability across chain', () => {
  const Emperor = Record.immutable({ id: 0, name: '', title: '' });
  const base = Emperor.create({ id: 1, name: 'Marcus', title: 'Emperor' });
  const b1 = Record.branch(base, { title: 'Philosopher' });
  const b2 = Record.branch(b1, { name: 'Lucius' });

  assert(Object.isFrozen(b1));
  assert(Object.isFrozen(b2));
  assert.equal(b2.title, 'Philosopher');
  assert.equal(b2.name, 'Lucius');
  assert.equal(b2.id, 1);
});
