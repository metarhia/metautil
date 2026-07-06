'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { List } = metautil;

// --- Construction ---

test('List: fromArray and toArray roundtrip', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  assert.strictEqual(list.size, 3);
});

test('List: fromIterable', () => {
  const list = List.fromIterable(new Set([10, 20, 30]));
  assert.strictEqual(list.size, 3);
});

test('List: range ascending', () => {
  const list = List.range(1, 5);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: range with step', () => {
  const list = List.range(0, 10, 2);
  assert.deepStrictEqual(list.toArray(), [0, 2, 4, 6, 8, 10]);
});

test('List: range descending', () => {
  const list = List.range(5, 1, -1);
  assert.deepStrictEqual(list.toArray(), [5, 4, 3, 2, 1]);
});

test('List: merge', () => {
  const a = List.fromArray([1, 2]);
  const b = List.fromArray([3, 4]);
  const c = List.merge([a, b]);
  assert.deepStrictEqual(c.toArray(), [1, 2, 3, 4]);
  assert.strictEqual(a.size, 2);
});

// --- CRUD ---

test('List: append and prepend', () => {
  const list = new List();
  list.append(2);
  list.prepend(1);
  list.append(3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: enqueue and dequeue (FIFO)', () => {
  const list = new List();
  list.enqueue('a');
  list.enqueue('b');
  list.enqueue('c');
  assert.strictEqual(list.dequeue(), 'a');
  assert.strictEqual(list.dequeue(), 'b');
  assert.strictEqual(list.size, 1);
});

test('List: dequeue empty returns undefined', () => {
  const list = new List();
  assert.strictEqual(list.dequeue(), undefined);
});

test('List: insert at index', () => {
  const list = List.fromArray([1, 3]);
  list.insert(1, 2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: insert multiple copies', () => {
  const list = List.fromArray([1, 4]);
  list.insert(1, 2, 2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 2, 4]);
});

test('List: insert at end', () => {
  const list = List.fromArray([1, 2]);
  list.insert(5, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: delete single', () => {
  const list = List.fromArray([1, 2, 3]);
  list.delete(1);
  assert.deepStrictEqual(list.toArray(), [1, 3]);
});

test('List: delete multiple', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.delete(1, 3);
  assert.deepStrictEqual(list.toArray(), [1, 5]);
});

test('List: at and set', () => {
  const list = List.fromArray([10, 20, 30]);
  assert.strictEqual(list.at(0), 10);
  assert.strictEqual(list.at(2), 30);
  assert.strictEqual(list.at(-1), undefined);
  assert.strictEqual(list.at(3), undefined);
  list.set(1, 99);
  assert.strictEqual(list.at(1), 99);
});

test('List: first and last', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.first(), 1);
  assert.strictEqual(list.last(), 3);
});

test('List: first and last empty', () => {
  const list = new List();
  assert.strictEqual(list.first(), undefined);
  assert.strictEqual(list.last(), undefined);
});

// --- Slicing ---

test('List: tail removes first n elements', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.tail().toArray(), [2, 3, 4, 5]);
  assert.deepStrictEqual(list.tail(2).toArray(), [3, 4, 5]);
  assert.strictEqual(list.size, 5);
});

test('List: init removes last n elements', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.init().toArray(), [1, 2, 3, 4]);
  assert.deepStrictEqual(list.init(2).toArray(), [1, 2, 3]);
});

test('List: take first n', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.take(3).toArray(), [1, 2, 3]);
});

test('List: take last n (negative)', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.take(-2).toArray(), [4, 5]);
});

test('List: drop first n', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(2);
  assert.deepStrictEqual(list.toArray(), [3, 4, 5]);
});

test('List: drop last n (negative)', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(-2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: slice', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.slice(1, 4).toArray(), [2, 3, 4]);
  assert.deepStrictEqual(list.slice(2).toArray(), [3, 4, 5]);
  assert.deepStrictEqual(list.slice(-2).toArray(), [4, 5]);
  assert.strictEqual(list.size, 5);
});

// --- Rearranging ---

test('List: rotateLeft', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotateLeft(2);
  assert.deepStrictEqual(list.toArray(), [3, 4, 5, 1, 2]);
});

test('List: rotateRight', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotateRight(2);
  assert.deepStrictEqual(list.toArray(), [4, 5, 1, 2, 3]);
});

test('List: rotate positive and negative', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotate(2);
  assert.deepStrictEqual(list.toArray(), [3, 4, 5, 1, 2]);
  list.rotate(-2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: swap', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.swap(0, 3);
  assert.deepStrictEqual(list.toArray(), [4, 2, 3, 1]);
});

test('List: swap out-of-bounds does nothing', () => {
  const list = List.fromArray([1, 2, 3]);
  list.swap(0, 5);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: move forward', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.move(1, 3);
  assert.deepStrictEqual(list.toArray(), [1, 3, 4, 2, 5]);
});

test('List: move backward', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.move(3, 1);
  assert.deepStrictEqual(list.toArray(), [1, 4, 2, 3, 5]);
});

test('List: splitAt', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const { before, after } = list.splitAt(3);
  assert.deepStrictEqual(before.toArray(), [1, 2, 3]);
  assert.deepStrictEqual(after.toArray(), [4, 5]);
});

test('List: groupBy', () => {
  const list = List.fromArray([1, 2, 3, 4, 5, 6]);
  const groups = list.groupBy((v) => (v % 2 === 0 ? 'even' : 'odd'));
  assert.deepStrictEqual(groups.get('odd').toArray(), [1, 3, 5]);
  assert.deepStrictEqual(groups.get('even').toArray(), [2, 4, 6]);
});

// --- Search / compare ---

test('List: includes', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.includes(2), true);
  assert.strictEqual(list.includes(5), false);
});

test('List: indexOf and lastIndexOf', () => {
  const list = List.fromArray([1, 2, 3, 2, 1]);
  assert.strictEqual(list.indexOf(2), 1);
  assert.strictEqual(list.lastIndexOf(2), 3);
  assert.strictEqual(list.indexOf(9), -1);
});

test('List: equals', () => {
  const a = List.fromArray([1, 2, 3]);
  const b = List.fromArray([1, 2, 3]);
  const c = List.fromArray([1, 2, 4]);
  assert.strictEqual(a.equals(b), true);
  assert.strictEqual(a.equals(c), false);
  assert.strictEqual(a.equals(new List()), false);
});

// --- Bulk mutations ---

test('List: addAll', () => {
  const list = List.fromArray([1, 2]);
  list.addAll([3, 4, 5]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: removeAll', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.removeAll([2, 4]);
  assert.deepStrictEqual(list.toArray(), [1, 3, 5]);
});

test('List: fill all', () => {
  const list = List.fromArray([1, 2, 3]);
  list.fill(0);
  assert.deepStrictEqual(list.toArray(), [0, 0, 0]);
});

test('List: fill range', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.fill(9, 1, 4);
  assert.deepStrictEqual(list.toArray(), [1, 9, 9, 9, 5]);
});

test('List: replace', () => {
  const list = List.fromArray([1, 2, 3, 2, 1]);
  list.replace(2, 99);
  assert.deepStrictEqual(list.toArray(), [1, 99, 3, 99, 1]);
});

test('List: distinct', () => {
  const list = List.fromArray([1, 2, 2, 3, 1]);
  list.distinct();
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: toDistinct', () => {
  const list = List.fromArray([1, 2, 2, 3, 1]);
  const result = list.toDistinct();
  assert.deepStrictEqual(result.toArray(), [1, 2, 3]);
  assert.strictEqual(list.size, 5);
});

// --- Ordering ---

test('List: reverse', () => {
  const list = List.fromArray([1, 2, 3]);
  list.reverse();
  assert.deepStrictEqual(list.toArray(), [3, 2, 1]);
});

test('List: toReversed does not mutate', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = list.toReversed();
  assert.deepStrictEqual(result.toArray(), [3, 2, 1]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: sort', () => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  list.sort();
  assert.deepStrictEqual(list.toArray(), [1, 1, 3, 4, 5]);
});

test('List: sort with comparator', () => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  list.sort((a, b) => b - a);
  assert.deepStrictEqual(list.toArray(), [5, 4, 3, 1, 1]);
});

test('List: toSorted does not mutate', () => {
  const list = List.fromArray([3, 1, 2]);
  const result = list.toSorted();
  assert.deepStrictEqual(result.toArray(), [1, 2, 3]);
  assert.deepStrictEqual(list.toArray(), [3, 1, 2]);
});

test('List: shuffle preserves elements', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.shuffle();
  assert.strictEqual(list.size, 5);
  const sorted = list.toArray().sort((a, b) => a - b);
  assert.deepStrictEqual(sorted, [1, 2, 3, 4, 5]);
});

test('List: toShuffled does not mutate', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = list.toShuffled();
  assert.strictEqual(result.size, 3);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

// --- Functional ---

test('List: map', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = list.map((v) => v * 2);
  assert.deepStrictEqual(result.toArray(), [2, 4, 6]);
  assert.strictEqual(list.size, 3);
});

test('List: map with index', () => {
  const list = List.fromArray(['a', 'b', 'c']);
  const result = list.map((v, i) => `${i}:${v}`);
  assert.deepStrictEqual(result.toArray(), ['0:a', '1:b', '2:c']);
});

test('List: lazyMap', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = [...list.lazyMap((v) => v * 10)];
  assert.deepStrictEqual(result, [10, 20, 30]);
});

test('List: flatMap', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = list.flatMap((v) => [v, v * 10]);
  assert.deepStrictEqual(result.toArray(), [1, 10, 2, 20, 3, 30]);
});

test('List: filter', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const result = list.filter((v) => v % 2 === 0);
  assert.deepStrictEqual(result.toArray(), [2, 4]);
});

test('List: lazyFilter', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const result = [...list.lazyFilter((v) => v > 3)];
  assert.deepStrictEqual(result, [4, 5]);
});

test('List: reduce', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const sum = list.reduce((acc, v) => acc + v, 0);
  assert.strictEqual(sum, 10);
});

test('List: lazyReduce (scan)', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const scanned = [...list.lazyReduce((acc, v) => acc + v, 0)];
  assert.deepStrictEqual(scanned, [1, 3, 6, 10]);
});

test('List: some and every', () => {
  const list = List.fromArray([2, 4, 6]);
  assert.strictEqual(
    list.some((v) => v > 5),
    true,
  );
  assert.strictEqual(
    list.some((v) => v > 10),
    false,
  );
  assert.strictEqual(
    list.every((v) => v % 2 === 0),
    true,
  );
  assert.strictEqual(
    list.every((v) => v > 3),
    false,
  );
});

test('List: find and findIndex', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(
    list.find((v) => v > 3),
    4,
  );
  assert.strictEqual(
    list.find((v) => v > 10),
    undefined,
  );
  assert.strictEqual(
    list.findIndex((v) => v > 3),
    3,
  );
  assert.strictEqual(
    list.findIndex((v) => v > 10),
    -1,
  );
});

// --- Stats ---

test('List: sum', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(list.sum(), 15);
});

test('List: sum with fn', () => {
  const list = List.fromArray([{ x: 1 }, { x: 2 }, { x: 3 }]);
  assert.strictEqual(
    list.sum((item) => item.x),
    6,
  );
});

test('List: avg', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(list.avg(), 3);
});

test('List: avg empty returns 0', () => {
  const list = new List();
  assert.strictEqual(list.avg(), 0);
});

test('List: min and max', () => {
  const list = List.fromArray([3, 1, 4, 1, 5, 9]);
  assert.strictEqual(list.min(), 1);
  assert.strictEqual(list.max(), 9);
});

test('List: min and max with comparator', () => {
  const list = List.fromArray([{ n: 3 }, { n: 1 }, { n: 5 }]);
  const cmp = (a, b) => a.n - b.n;
  assert.deepStrictEqual(list.min(cmp), { n: 1 });
  assert.deepStrictEqual(list.max(cmp), { n: 5 });
});

test('List: min and max empty returns undefined', () => {
  const list = new List();
  assert.strictEqual(list.min(), undefined);
  assert.strictEqual(list.max(), undefined);
});

// --- Conversion / utility ---

test('List: isEmpty', () => {
  const list = new List();
  assert.strictEqual(list.isEmpty(), true);
  list.append(1);
  assert.strictEqual(list.isEmpty(), false);
});

test('List: clear', () => {
  const list = List.fromArray([1, 2, 3]);
  list.clear();
  assert.strictEqual(list.size, 0);
  assert.strictEqual(list.isEmpty(), true);
});

test('List: join', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.join(), '1,2,3');
  assert.strictEqual(list.join(' - '), '1 - 2 - 3');
});

test('List: clone', () => {
  const list = List.fromArray([1, 2, 3]);
  const clone = list.clone();
  clone.append(4);
  assert.strictEqual(list.size, 3);
  assert.strictEqual(clone.size, 4);
});

test('List: Symbol.iterator', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('List: Symbol.asyncIterator', async () => {
  const list = List.fromArray([1, 2, 3]);
  const values = [];
  for await (const value of list) values.push(value);
  assert.deepStrictEqual(values, [1, 2, 3]);
});
