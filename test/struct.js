'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Struct } = metautil;

test('Struct: immutable applies defaults', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const city = new City();
  assert.strictEqual(city.name, 'Unknown');
});

test('Struct: immutable overrides defaults with data', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const rome = new City({ name: 'Rome' });
  assert.strictEqual(rome.name, 'Rome');
});

test('Struct: mutable applies defaults', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const user = new User();
  assert.strictEqual(user.id, 0);
  assert.strictEqual(user.name, 'Anonymous');
});

test('Struct: create is equivalent to new', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const rome = City.create({ name: 'Rome' });
  assert.strictEqual(rome.name, 'Rome');
});

test('Struct: exposes fields, schema, mutable statics', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous', roles: [] });
  assert.deepStrictEqual(User.fields, ['id', 'name', 'roles']);
  assert.deepStrictEqual(
    { ...User.schema },
    { id: 'number', name: 'string', roles: 'array' },
  );
  assert.strictEqual(User.mutable, true);

  const City = Struct.immutable({ name: 'Unknown' });
  assert.strictEqual(City.mutable, false);
});

test('Struct: independent classes do not share schema', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const Country = Struct.immutable({ name: 'Unknown' });
  assert.notStrictEqual(City, Country);
  assert.notStrictEqual(City.fields, Country.fields);
  assert.deepStrictEqual(City.fields, Country.fields);
});

test('Struct: unknown field throws TypeError', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  assert.throws(
    () => new City({ unknown: 1 }),
    new TypeError('Unknown field "unknown"'),
  );
});

test('Struct: wrong field type throws TypeError', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  assert.throws(
    () => new User({ id: 'one' }),
    new TypeError('Invalid type for "id": expected number, got string'),
  );
});

test('Struct: array and null are distinguished from object', () => {
  const Data = Struct.mutable({ tags: [], meta: null, info: {} });
  assert.strictEqual(Data.schema.tags, 'array');
  assert.strictEqual(Data.schema.meta, 'null');
  assert.strictEqual(Data.schema.info, 'object');
  assert.throws(
    () => new Data({ tags: {} }),
    new TypeError('Invalid type for "tags": expected array, got object'),
  );
});

test('Struct: immutable instance is frozen', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const rome = new City({ name: 'Rome' });
  assert.strictEqual(Object.isFrozen(rome), true);
  assert.throws(() => {
    rome.name = 'Roma';
  }, TypeError);
  assert.strictEqual(rome.name, 'Rome');
});

test('Struct: mutable instance is sealed, not frozen', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const user = new User({ id: 1, name: 'Marcus' });
  assert.strictEqual(Object.isSealed(user), true);
  assert.strictEqual(Object.isFrozen(user), false);
  user.name = 'Marcus Aurelius';
  assert.strictEqual(user.name, 'Marcus Aurelius');
  assert.throws(() => {
    user.extra = 1;
  }, TypeError);
});

test('Struct: update mutates a mutable instance in place', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const user = new User({ id: 1, name: 'Marcus' });
  const updated = user.update({ name: 'Marcus Aurelius' });
  assert.strictEqual(updated, user);
  assert.strictEqual(user.name, 'Marcus Aurelius');
});

test('Struct: update validates fields', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const user = new User({ id: 1, name: 'Marcus' });
  assert.throws(
    () => user.update({ id: 'one' }),
    new TypeError('Invalid type for "id": expected number, got string'),
  );
});

test('Struct: update throws on immutable instance', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const rome = new City({ name: 'Rome' });
  assert.throws(
    () => rome.update({ name: 'Roma' }),
    new Error('Cannot update immutable Struct, use fork or branch'),
  );
});

test('Struct: fork creates an independent copy', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const marcus = new User({ id: 1, name: 'Marcus' });
  const lucius = marcus.fork({ name: 'Lucius Verus' });
  assert.notStrictEqual(lucius, marcus);
  assert.strictEqual(lucius.id, 1);
  assert.strictEqual(lucius.name, 'Lucius Verus');
  assert.strictEqual(marcus.name, 'Marcus');
});

test('Struct: fork copies reference fields by value', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const User = Struct.mutable({ name: 'Anonymous', city: new City() });
  const rome = new City({ name: 'Rome' });
  const marcus = new User({ name: 'Marcus', city: rome });
  const lucius = marcus.fork({ name: 'Lucius Verus' });
  assert.strictEqual(lucius.city, rome);
});

test('Struct: fork works on immutable records', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const rome = new City({ name: 'Rome' });
  const napoli = rome.fork({ name: 'Napoli' });
  assert.notStrictEqual(napoli, rome);
  assert.strictEqual(napoli.name, 'Napoli');
  assert.strictEqual(Object.isFrozen(napoli), true);
});

test('Struct: branch shares unset fields with the source', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const User = Struct.mutable({ name: 'Anonymous', city: new City() });
  const rome = new City({ name: 'Rome' });
  const marcus = new User({ name: 'Marcus', city: rome });
  const commodus = marcus.branch({ name: 'Commodus' });
  assert.strictEqual(commodus.name, 'Commodus');
  assert.strictEqual(commodus.city, marcus.city);
  assert.strictEqual(marcus.name, 'Marcus');
});

test('Struct: branch result is an instance of its class', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const marcus = new User({ id: 1, name: 'Marcus' });
  const commodus = marcus.branch({ name: 'Commodus' });
  assert.strictEqual(commodus instanceof User, true);
});

test('Struct: branch validates fields', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const marcus = new User({ id: 1, name: 'Marcus' });
  assert.throws(
    () => marcus.branch({ id: 'one' }),
    new TypeError('Invalid type for "id": expected number, got string'),
  );
});

test('Struct: branch of an immutable record is frozen', () => {
  const City = Struct.immutable({ name: 'Unknown' });
  const rome = new City({ name: 'Rome' });
  const napoli = rome.branch({ name: 'Napoli' });
  assert.strictEqual(Object.isFrozen(napoli), true);
});

test('Struct: branch of a mutable record is sealed, not frozen', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const marcus = new User({ id: 1, name: 'Marcus' });
  const commodus = marcus.branch({ name: 'Commodus' });
  assert.strictEqual(Object.isSealed(commodus), true);
  assert.strictEqual(Object.isFrozen(commodus), false);
});

test('Struct: branch cannot later update a field it did not set', () => {
  // Fields not passed to branch() stay inherited from the source instance
  // instead of becoming own properties, so update() cannot assign them
  // once the branch is sealed. Re-branch or fork to change such fields.
  const User = Struct.mutable({ id: 0, name: 'Anonymous', email: '' });
  const marcus = new User({ id: 1, name: 'Marcus', email: 'a@b.c' });
  const commodus = marcus.branch({ name: 'Commodus' });
  assert.throws(() => commodus.update({ email: 'commodus@metarhia.com' }));
});

test('Struct: toObject returns a plain independent copy', () => {
  const User = Struct.mutable({ id: 0, name: 'Anonymous' });
  const marcus = new User({ id: 1, name: 'Marcus' });
  const obj = marcus.toObject();
  assert.deepStrictEqual(obj, { id: 1, name: 'Marcus' });
  assert.strictEqual(obj.constructor, Object);
  obj.name = 'Changed';
  assert.strictEqual(marcus.name, 'Marcus');
});
