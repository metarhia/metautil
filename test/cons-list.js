'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { ConsList } = metautil;

test('ConsList: empty singleton', () => {
  const empty1 = ConsList.empty;
  const empty2 = ConsList.empty;
  assert.strictEqual(empty1, empty2);
  assert.strictEqual(empty1.isEmpty(), true);
  assert.strictEqual(empty1.size, 0);
});

test('ConsList: prepend creates new head', () => {
  const empty = ConsList.empty;
  const list1 = empty.prepend(3);
  const list2 = list1.prepend(2);
  const list3 = list2.prepend(1);
  assert.strictEqual(list3.value, 1);
  assert.strictEqual(list3.size, 3);
  assert.strictEqual(list3.next.value, 2);
  assert.strictEqual(list3.next.next.value, 3);
  assert.strictEqual(list3.next.next.next, null);
});

test('ConsList: prepend does not mutate original', () => {
  const base = ConsList.fromArray([2, 3]);
  const extended = base.prepend(1);
  assert.strictEqual(base.size, 2);
  assert.strictEqual(base.value, 2);
  assert.strictEqual(extended.size, 3);
  assert.strictEqual(extended.value, 1);
});

test('ConsList: structural sharing (branching)', () => {
  const shared = ConsList.fromArray([2, 3, 4]);
  const branch1 = shared.prepend(1);
  const branch2 = shared.prepend(10);

  assert.strictEqual(branch1.next, shared);
  assert.strictEqual(branch2.next, shared);

  assert.deepStrictEqual(branch1.toArray(), [1, 2, 3, 4]);
  assert.deepStrictEqual(branch2.toArray(), [10, 2, 3, 4]);
  assert.deepStrictEqual(shared.toArray(), [2, 3, 4]);
});

test('ConsList: first', () => {
  const list = ConsList.fromArray([42, 99]);
  assert.strictEqual(list.first(), 42);
  assert.strictEqual(ConsList.empty.first(), undefined);
});

test('ConsList: rest', () => {
  const list = ConsList.fromArray([1, 2, 3]);
  const tail = list.rest();
  assert.strictEqual(tail.value, 2);
  assert.strictEqual(tail.size, 2);

  const singleItem = ConsList.fromArray([42]);
  assert.strictEqual(singleItem.rest().isEmpty(), true);
  assert.strictEqual(singleItem.rest(), ConsList.empty);
});

test('ConsList: fromArray', () => {
  const list = ConsList.fromArray([1, 2, 3]);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('ConsList: fromArray empty', () => {
  const list = ConsList.fromArray([]);
  assert.strictEqual(list.isEmpty(), true);
  assert.deepStrictEqual(list.toArray(), []);
});

test('ConsList: fromIterable', () => {
  const list = ConsList.fromIterable(new Set([1, 2, 3]));
  assert.strictEqual(list.size, 3);
  assert.strictEqual(list.toArray().includes(1), true);
});

test('ConsList: of', () => {
  const list = ConsList.of(10, 20, 30);
  assert.deepStrictEqual(list.toArray(), [10, 20, 30]);
});

test('ConsList: toArray', () => {
  const list = ConsList.fromArray([1, 2, 3]);
  const arr = list.toArray();
  assert.deepStrictEqual(arr, [1, 2, 3]);
  arr.push(99);
  assert.strictEqual(list.size, 3);
});

test('ConsList: Symbol.iterator', () => {
  const list = ConsList.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('ConsList: Symbol.iterator empty', () => {
  const list = ConsList.empty;
  assert.deepStrictEqual([...list], []);
});

test('ConsList: size reflects chain length', () => {
  let list = ConsList.empty;
  for (let i = 5; i >= 1; i--) list = list.prepend(i);
  assert.strictEqual(list.size, 5);
  assert.strictEqual(list.rest().size, 4);
  assert.strictEqual(list.rest().rest().size, 3);
});

test('ConsList: deep branching shares tail immutably', () => {
  const base = ConsList.of(100);
  const a = base.prepend(1).prepend(2).prepend(3);
  const b = base.prepend(7).prepend(8).prepend(9);

  assert.deepStrictEqual(a.toArray(), [3, 2, 1, 100]);
  assert.deepStrictEqual(b.toArray(), [9, 8, 7, 100]);

  assert.strictEqual(a.rest().rest().rest(), base);
  assert.strictEqual(b.rest().rest().rest(), base);
});
