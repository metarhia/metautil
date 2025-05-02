'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { Record } = require('..');

test('Record.create() (immutable)', () => {
  const Emperor = Record.immutable(['id', 'name']);
  const marcus = Emperor.create(1, 'Marcus Aurelius');
  assert.deepEqual(marcus, { id: 1, name: 'Marcus Aurelius' });
  assert(Object.isFrozen(marcus));
});

test('Record.create() (mutable)', () => {
  const Emperor = Record.mutable(['id', 'name']);
  const commodus = Emperor.create(2, 'Commodus');
  assert.deepEqual(commodus, { id: 2, name: 'Commodus' });
  assert(Object.isSealed(commodus));
});

test('Record.update() mutates sealed objects', () => {
  const Emperor = Record.mutable(['id', 'name']);
  const hadrian = Emperor.create(3, 'Hadrian');
  Record.update(hadrian, { name: 'Publius Hadrianus' });
  assert.equal(hadrian.name, 'Publius Hadrianus');
});

test('Record.update() throws on frozen objects', () => {
  const Emperor = Record.immutable(['id', 'name']);
  const antoninus = Emperor.create(4, 'Antoninus Pius');
  assert.throws(() => {
    Record.update(antoninus, { name: 'Titus Aurelius' });
  }, /Cannot mutate immutable Record/);
});

test('Record.fork() returns new frozen object', () => {
  const Emperor = Record.immutable(['id', 'name']);
  const lucius = Emperor.create(5, 'Lucius Verus');
  const forked = Record.fork(lucius, { name: 'Lucius Aelius' });
  assert.notEqual(forked, lucius);
  assert.equal(forked.name, 'Lucius Aelius');
  assert.equal(forked.id, 5);
  assert(Object.isFrozen(forked));
});

test('Record.branch() builds prototype chain with overrides', () => {
  const Emperor = Record.immutable(['id', 'name', 'title']);
  const base = Emperor.create(6, 'Marcus Aurelius', 'Philosopher King');
  const branch1 = Record.branch(base, { name: 'Marcus' });
  const branch2 = Record.branch(branch1, { title: 'Imperator' });

  assert.equal(branch2.name, 'Marcus'); // from branch1
  assert.equal(branch2.title, 'Imperator'); // from branch2
  assert.equal(branch2.id, 6); // from base
  assert(Object.getPrototypeOf(branch2) === branch1);
  assert(Object.getPrototypeOf(branch1) === base);
});
