'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { PersistentList } = metautil;

test('PersistentList: empty singleton', () => {
  const empty1 = PersistentList.empty;
  const empty2 = PersistentList.empty;
  assert.strictEqual(empty1, empty2);
  assert.strictEqual(empty1.isEmpty(), true);
  assert.strictEqual(empty1.size, 0);
});

test('PersistentList: prepend creates new head', () => {
  const empty = PersistentList.empty;
  const list1 = empty.prepend(3);
  const list2 = list1.prepend(2);
  const list3 = list2.prepend(1);
  assert.strictEqual(list3.value, 1);
  assert.strictEqual(list3.size, 3);
  assert.strictEqual(list3.next.value, 2);
  assert.strictEqual(list3.next.next.value, 3);
  assert.strictEqual(list3.next.next.next, null);
});

test('PersistentList: prepend does not mutate original', () => {
  const base = PersistentList.fromArray([2, 3]);
  const extended = base.prepend(1);
  assert.strictEqual(base.size, 2);
  assert.strictEqual(base.value, 2);
  assert.strictEqual(extended.size, 3);
  assert.strictEqual(extended.value, 1);
});

test('PersistentList: structural sharing (branching)', () => {
  const shared = PersistentList.fromArray([2, 3, 4]);
  const branch1 = shared.prepend(1);
  const branch2 = shared.prepend(10);

  assert.strictEqual(branch1.next, shared);
  assert.strictEqual(branch2.next, shared);

  assert.deepStrictEqual(branch1.toArray(), [1, 2, 3, 4]);
  assert.deepStrictEqual(branch2.toArray(), [10, 2, 3, 4]);
  assert.deepStrictEqual(shared.toArray(), [2, 3, 4]);
});

test('PersistentList: first', () => {
  const list = PersistentList.fromArray([42, 99]);
  assert.strictEqual(list.first(), 42);
  assert.strictEqual(PersistentList.empty.first(), undefined);
});

test('PersistentList: rest', () => {
  const list = PersistentList.fromArray([1, 2, 3]);
  const tail = list.rest();
  assert.strictEqual(tail.value, 2);
  assert.strictEqual(tail.size, 2);

  const singleItem = PersistentList.fromArray([42]);
  assert.strictEqual(singleItem.rest().isEmpty(), true);
  assert.strictEqual(singleItem.rest(), PersistentList.empty);
});

test('PersistentList: fromArray', () => {
  const list = PersistentList.fromArray([1, 2, 3]);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('PersistentList: fromArray empty', () => {
  const list = PersistentList.fromArray([]);
  assert.strictEqual(list.isEmpty(), true);
  assert.deepStrictEqual(list.toArray(), []);
});

test('PersistentList: fromIterable', () => {
  const list = PersistentList.fromIterable(new Set([1, 2, 3]));
  assert.strictEqual(list.size, 3);
  assert.strictEqual(list.toArray().includes(1), true);
});

test('PersistentList: of', () => {
  const list = PersistentList.of(10, 20, 30);
  assert.deepStrictEqual(list.toArray(), [10, 20, 30]);
});

test('PersistentList: toArray', () => {
  const list = PersistentList.fromArray([1, 2, 3]);
  const arr = list.toArray();
  assert.deepStrictEqual(arr, [1, 2, 3]);
  arr.push(99);
  assert.strictEqual(list.size, 3);
});

test('PersistentList: Symbol.iterator', () => {
  const list = PersistentList.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('PersistentList: Symbol.iterator empty', () => {
  const list = PersistentList.empty;
  assert.deepStrictEqual([...list], []);
});

test('PersistentList: size reflects chain length', () => {
  let list = PersistentList.empty;
  for (let i = 5; i >= 1; i--) list = list.prepend(i);
  assert.strictEqual(list.size, 5);
  assert.strictEqual(list.rest().size, 4);
  assert.strictEqual(list.rest().rest().size, 3);
});

test('PersistentList: deep branching shares tail immutably', () => {
  const base = PersistentList.of(100);
  const a = base.prepend(1).prepend(2).prepend(3);
  const b = base.prepend(7).prepend(8).prepend(9);

  assert.deepStrictEqual(a.toArray(), [3, 2, 1, 100]);
  assert.deepStrictEqual(b.toArray(), [9, 8, 7, 100]);

  assert.strictEqual(a.rest().rest().rest(), base);
  assert.strictEqual(b.rest().rest().rest(), base);
});
