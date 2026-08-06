'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { ConsList, cons, uncons } = metautil;

test('ConsList: empty singleton', () => {
  const empty1 = ConsList.empty;
  const empty2 = ConsList.empty;
  assert.strictEqual(empty1, empty2);
  assert.strictEqual(empty1.isEmpty(), true);
  assert.strictEqual(empty1.size, 0);
});

test('ConsList: prepend creates new list', () => {
  const empty = ConsList.empty;
  const list1 = empty.prepend(3);
  const list2 = list1.prepend(2);
  const list3 = list2.prepend(1);
  assert.strictEqual(list3.value, 1);
  assert.strictEqual(list3.size, 3);
  assert.strictEqual(list3.tail.value, 2);
  assert.strictEqual(list3.tail.tail.value, 3);
  assert.strictEqual(list3.tail.tail.tail, ConsList.empty);
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

  assert.strictEqual(branch1.tail, shared);
  assert.strictEqual(branch2.tail, shared);

  assert.deepStrictEqual(branch1.toArray(), [1, 2, 3, 4]);
  assert.deepStrictEqual(branch2.toArray(), [10, 2, 3, 4]);
  assert.deepStrictEqual(shared.toArray(), [2, 3, 4]);
});

test('ConsList: value', () => {
  const list = ConsList.fromArray([42, 99]);
  assert.strictEqual(list.value, 42);
  assert.strictEqual(ConsList.empty.value, undefined);
});

test('ConsList: tail', () => {
  const list = ConsList.fromArray([1, 2, 3]);
  const tail = list.tail;
  assert.strictEqual(tail.value, 2);
  assert.strictEqual(tail.size, 2);

  const singleItem = ConsList.fromArray([42]);
  assert.strictEqual(singleItem.tail.isEmpty(), true);
  assert.strictEqual(singleItem.tail, ConsList.empty);
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
  assert.strictEqual(list.tail.size, 4);
  assert.strictEqual(list.tail.tail.size, 3);
});

test('ConsList: deep branching shares tail immutably', () => {
  const base = ConsList.of(100);
  const a = base.prepend(1).prepend(2).prepend(3);
  const b = base.prepend(7).prepend(8).prepend(9);

  assert.deepStrictEqual(a.toArray(), [3, 2, 1, 100]);
  assert.deepStrictEqual(b.toArray(), [9, 8, 7, 100]);

  assert.strictEqual(a.tail.tail.tail, base);
  assert.strictEqual(b.tail.tail.tail, base);
});

test('ConsList: uncons', () => {
  const list = ConsList.of(1, 2, 3);
  const { value, tail } = list.uncons();
  assert.strictEqual(value, 1);
  assert.strictEqual(tail, list.tail);
  assert.deepStrictEqual(tail.toArray(), [2, 3]);

  const empty = ConsList.empty.uncons();
  assert.strictEqual(empty.value, undefined);
  assert.strictEqual(empty.tail, ConsList.empty);
});

test('ConsList: equals', () => {
  const a = ConsList.fromArray([1, 2, 3]);
  const b = ConsList.fromArray([1, 2, 3]);
  const c = ConsList.fromArray([1, 2, 4]);
  assert.strictEqual(a.equals(b), true);
  assert.strictEqual(a.equals(c), false);
  assert.strictEqual(a.equals(ConsList.empty), false);
  assert.strictEqual(ConsList.empty.equals(ConsList.empty), true);
  assert.strictEqual(a.equals(a), true);

  const shared = ConsList.of(2, 3);
  const left = shared.prepend(1);
  const right = ConsList.fromArray([1, 2, 3]);
  assert.strictEqual(left.equals(right), true);
  assert.strictEqual(a.equals(null), false);
  assert.strictEqual(a.equals([1, 2, 3]), false);
});

test('ConsList: includes', () => {
  const list = ConsList.of(1, 2, 3);
  assert.strictEqual(list.includes(1), true);
  assert.strictEqual(list.includes(2), true);
  assert.strictEqual(list.includes(3), true);
  assert.strictEqual(list.includes(4), false);
  assert.strictEqual(ConsList.empty.includes(1), false);
  assert.strictEqual(ConsList.of(0).includes(0), true);
});

test('ConsList: member', () => {
  const list = ConsList.of(1, 2, 3, 2);
  const found = list.member(2);
  assert.deepStrictEqual(found.toArray(), [2, 3, 2]);
  assert.strictEqual(found, list.tail);
  assert.strictEqual(list.member(1), list);
  assert.strictEqual(list.member(3), list.tail.tail);
  assert.strictEqual(list.member(9), ConsList.empty);
  assert.strictEqual(ConsList.empty.member(1), ConsList.empty);
});

test('ConsList: toReversed', () => {
  const list = ConsList.of(1, 2, 3);
  const reversed = list.toReversed();
  assert.deepStrictEqual(reversed.toArray(), [3, 2, 1]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  assert.strictEqual(reversed.size, 3);
  assert.strictEqual(ConsList.empty.toReversed(), ConsList.empty);
  assert.deepStrictEqual(ConsList.of(42).toReversed().toArray(), [42]);
  assert.strictEqual(list.toReversed().toReversed().equals(list), true);
});

test('ConsList: map', () => {
  const list = ConsList.of(1, 2, 3);
  const mapped = list.map((v) => v * 2);
  assert.deepStrictEqual(mapped.toArray(), [2, 4, 6]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  assert.deepStrictEqual(list.map((v, i) => `${i}:${v}`).toArray(), [
    '0:1',
    '1:2',
    '2:3',
  ]);
  assert.strictEqual(
    ConsList.empty.map((v) => v),
    ConsList.empty,
  );
});

test('ConsList: filter', () => {
  const list = ConsList.of(1, 2, 3, 4, 5);
  assert.deepStrictEqual(list.filter((v) => v % 2 === 0).toArray(), [2, 4]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(
    list.filter((v, i) => i === 0 || v > 3).toArray(),
    [1, 4, 5],
  );
  assert.strictEqual(
    ConsList.empty.filter((v) => v),
    ConsList.empty,
  );
  assert.strictEqual(list.filter(() => false).isEmpty(), true);
});

test('ConsList: find, some, every', () => {
  const list = ConsList.of(1, 2, 3, 4);
  assert.strictEqual(
    list.find((v) => v > 2),
    3,
  );
  assert.strictEqual(
    list.find((v, i) => i === 1),
    2,
  );
  assert.strictEqual(
    list.find((v) => v > 10),
    undefined,
  );
  assert.strictEqual(
    ConsList.empty.find((v) => v),
    undefined,
  );
  assert.strictEqual(
    list.some((v) => v === 3),
    true,
  );
  assert.strictEqual(
    list.some((v) => v === 9),
    false,
  );
  assert.strictEqual(
    ConsList.empty.some((v) => v),
    false,
  );
  assert.strictEqual(
    list.every((v) => v > 0),
    true,
  );
  assert.strictEqual(
    list.every((v) => v < 3),
    false,
  );
  assert.strictEqual(
    ConsList.empty.every((v) => v),
    true,
  );
});

test('ConsList: reduce', () => {
  const list = ConsList.of(1, 2, 3, 4);
  assert.strictEqual(
    list.reduce((acc, v) => acc + v, 0),
    10,
  );
  assert.strictEqual(
    list.reduce((acc, v) => acc + v),
    10,
  );
  assert.deepStrictEqual(
    list.reduce((acc, v, i) => {
      acc.push(`${i}:${v}`);
      return acc;
    }, []),
    ['0:1', '1:2', '2:3', '3:4'],
  );
  const indices = [];
  list.reduce((acc, v, i) => {
    indices.push(i);
    return acc + v;
  });
  assert.deepStrictEqual(indices, [1, 2, 3]);
  assert.strictEqual(
    ConsList.empty.reduce((acc, v) => acc + v, 42),
    42,
  );
  assert.strictEqual(
    ConsList.of(7).reduce((acc, v) => acc + v),
    7,
  );
  assert.throws(
    () => ConsList.empty.reduce((acc, v) => acc + v),
    /ConsList is empty/,
  );
});

test('ConsList: merge', () => {
  const a = ConsList.of(1, 2);
  const b = ConsList.of(3, 4);
  const c = ConsList.of(5);
  const joined = ConsList.merge(a, b, c);
  assert.deepStrictEqual(joined.toArray(), [1, 2, 3, 4, 5]);
  assert.strictEqual(joined.size, 5);
  assert.strictEqual(joined.tail.tail.tail.tail, c);
  assert.deepStrictEqual(a.toArray(), [1, 2]);
  assert.deepStrictEqual(b.toArray(), [3, 4]);
  assert.strictEqual(ConsList.merge(a, ConsList.empty), a);
  assert.strictEqual(ConsList.merge(ConsList.empty, b), b);
  assert.strictEqual(ConsList.merge(a), a);
  assert.strictEqual(ConsList.merge(), ConsList.empty);
  assert.strictEqual(
    ConsList.merge(ConsList.empty, ConsList.empty),
    ConsList.empty,
  );
});

test('cons: builds ConsList', () => {
  const list = cons(1, cons(2, cons(3)));
  assert.strictEqual(list instanceof ConsList, true);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  assert.strictEqual(list.tail.tail.tail, ConsList.empty);
});

test('cons: defaults to empty tail', () => {
  const alone = cons('a');
  assert.strictEqual(alone.value, 'a');
  assert.strictEqual(alone.tail, ConsList.empty);
  assert.strictEqual(alone.size, 1);
});

test('cons: shares existing tail', () => {
  const tail = ConsList.of(2, 3);
  const list = cons(1, tail);
  assert.strictEqual(list.tail, tail);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('uncons: splits ConsList', () => {
  const list = ConsList.of(1, 2, 3);
  const { value, tail } = uncons(list);
  assert.strictEqual(value, 1);
  assert.strictEqual(tail, list.tail);
  assert.deepStrictEqual(tail.toArray(), [2, 3]);
  assert.deepStrictEqual(cons(value, tail).toArray(), [1, 2, 3]);
});

test('uncons: empty', () => {
  const result = uncons(ConsList.empty);
  assert.strictEqual(result.value, undefined);
  assert.strictEqual(result.tail, ConsList.empty);
});
