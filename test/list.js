'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { List } = require('../lib/list.js');

test('List: constructor', () => {
  const list = new List();
  assert.strictEqual(list.size, 0);
});

test('List: fromArray', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.size, 3);
  assert.strictEqual(list.at(0), 1);
  assert.strictEqual(list.at(2), 3);
});

test('List: fromIterator', () => {
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
  }
  const list = List.fromIterator(gen());
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: range', () => {
  const list1 = List.range(0, 5);
  assert.deepStrictEqual(list1.toArray(), [0, 1, 2, 3, 4]);

  const list2 = List.range(0, 10, 2);
  assert.deepStrictEqual(list2.toArray(), [0, 2, 4, 6, 8]);

  const list3 = List.range(5, 0, -1);
  assert.deepStrictEqual(list3.toArray(), [5, 4, 3, 2, 1]);
});

test('List: merge', () => {
  const list1 = List.fromArray([1, 2]);
  const list2 = List.fromArray([3, 4]);
  const list3 = List.fromArray([5, 6]);
  const merged = List.merge([list1, list2, list3]);
  assert.deepStrictEqual(merged.toArray(), [1, 2, 3, 4, 5, 6]);
});

test('List: append', () => {
  const list = new List();
  list.append(1);
  list.append(2);
  list.append(3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: prepend', () => {
  const list = new List();
  list.prepend(3);
  list.prepend(2);
  list.prepend(1);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: clear', () => {
  const list = List.fromArray([1, 2, 3]);
  list.clear();
  assert.strictEqual(list.size, 0);
});

test('List: enqueue and dequeue', () => {
  const list = new List();
  list.enqueue(1);
  list.enqueue(2);
  list.enqueue(3);
  assert.strictEqual(list.dequeue(), 1);
  assert.strictEqual(list.dequeue(), 2);
  assert.strictEqual(list.size, 1);
});

test('List: first and last', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.first(), 1);
  assert.strictEqual(list.last(), 3);
});

test('List: at with positive index', () => {
  const list = List.fromArray(['a', 'b', 'c', 'd']);
  assert.strictEqual(list.at(0), 'a');
  assert.strictEqual(list.at(2), 'c');
});

test('List: at with negative index', () => {
  const list = List.fromArray(['a', 'b', 'c', 'd']);
  assert.strictEqual(list.at(-1), 'd');
  assert.strictEqual(list.at(-2), 'c');
});

test('List: set', () => {
  const list = List.fromArray([1, 2, 3]);
  list.set(1, 20);
  assert.strictEqual(list.at(1), 20);
  list.set(-1, 30);
  assert.strictEqual(list.at(2), 30);
});

test('List: insert', () => {
  const list = List.fromArray([1, 3]);
  list.insert(1, 2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: insert multiple', () => {
  const list = List.fromArray([1, 4]);
  list.insert(1, 2, 2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 2, 4]);
});

test('List: delete', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.delete(1);
  assert.deepStrictEqual(list.toArray(), [1, 3, 4]);
});

test('List: delete multiple', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.delete(1, 3);
  assert.deepStrictEqual(list.toArray(), [1, 5]);
});

test('List: addAll', () => {
  const list = List.fromArray([1, 2]);
  list.addAll([3, 4, 5]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: removeAll', () => {
  const list = List.fromArray([1, 2, 3, 2, 4, 2, 5]);
  list.removeAll([2, 4]);
  assert.deepStrictEqual(list.toArray(), [1, 3, 5]);
});

test('List: fill', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.fill(0, 1, 4);
  assert.deepStrictEqual(list.toArray(), [1, 0, 0, 0, 5]);
});

test('List: replace', () => {
  const list = List.fromArray([1, 2, 3, 2, 4, 2]);
  list.replace(2, 20);
  assert.deepStrictEqual(list.toArray(), [1, 20, 3, 20, 4, 20]);
});

test('List: tail', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const tail = list.tail();
  assert.deepStrictEqual(tail.toArray(), [2, 3, 4]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4]);
});

test('List: head', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const head = list.head();
  assert.deepStrictEqual(head.toArray(), [1, 2, 3]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4]);
});

test('List: drop from beginning', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(2);
  assert.deepStrictEqual(list.toArray(), [3, 4, 5]);
});

test('List: drop from end', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(-2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: take from beginning', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const taken = list.take(3);
  assert.deepStrictEqual(taken.toArray(), [1, 2, 3]);
});

test('List: take from end', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const taken = list.take(-3);
  assert.deepStrictEqual(taken.toArray(), [3, 4, 5]);
});

test('List: slice', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const sliced = list.slice(1, 4);
  assert.deepStrictEqual(sliced.toArray(), [2, 3, 4]);
});

test('List: splitAt', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const { before, after } = list.splitAt(2);
  assert.deepStrictEqual(before.toArray(), [1, 2]);
  assert.deepStrictEqual(after.toArray(), [3, 4, 5]);
});

test('List: groupBy', () => {
  const list = List.fromArray([1, 2, 3, 4, 5, 6]);
  const groups = list.groupBy((v) => (v % 2 === 0 ? 'even' : 'odd'));
  assert.deepStrictEqual(groups.get('even').toArray(), [2, 4, 6]);
  assert.deepStrictEqual(groups.get('odd').toArray(), [1, 3, 5]);
});

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

test('List: rotate', () => {
  const list1 = List.fromArray([1, 2, 3, 4, 5]);
  list1.rotate(2);
  assert.deepStrictEqual(list1.toArray(), [4, 5, 1, 2, 3]);

  const list2 = List.fromArray([1, 2, 3, 4, 5]);
  list2.rotate(-2);
  assert.deepStrictEqual(list2.toArray(), [3, 4, 5, 1, 2]);
});

test('List: swap', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.swap(1, 3);
  assert.deepStrictEqual(list.toArray(), [1, 4, 3, 2, 5]);
});

test('List: move', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.move(1, 3);
  assert.deepStrictEqual(list.toArray(), [1, 3, 4, 2, 5]);
});

test('List: includes', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(list.includes(3), true);
  assert.strictEqual(list.includes(10), false);
});

test('List: indexOf', () => {
  const list = List.fromArray([1, 2, 3, 2, 4]);
  assert.strictEqual(list.indexOf(2), 1);
  assert.strictEqual(list.indexOf(5), -1);
});

test('List: lastIndexOf', () => {
  const list = List.fromArray([1, 2, 3, 2, 4]);
  assert.strictEqual(list.lastIndexOf(2), 3);
  assert.strictEqual(list.lastIndexOf(5), -1);
});

test('List: equals', () => {
  const list1 = List.fromArray([1, 2, 3]);
  const list2 = List.fromArray([1, 2, 3]);
  const list3 = List.fromArray([1, 2, 4]);
  assert.strictEqual(list1.equals(list2), true);
  assert.strictEqual(list1.equals(list3), false);
});

test('List: find', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const found = list.find((v) => v > 3);
  assert.strictEqual(found, 4);
});

test('List: findIndex', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const index = list.findIndex((v) => v > 3);
  assert.strictEqual(index, 3);
});

test('List: some', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(
    list.some((v) => v > 4),
    true,
  );
  assert.strictEqual(
    list.some((v) => v > 10),
    false,
  );
});

test('List: every', () => {
  const list1 = List.fromArray([2, 4, 6, 8]);
  assert.strictEqual(
    list1.every((v) => v % 2 === 0),
    true,
  );

  const list2 = List.fromArray([2, 4, 5, 8]);
  assert.strictEqual(
    list2.every((v) => v % 2 === 0),
    false,
  );
});

test('List: distinct', () => {
  const list = List.fromArray([1, 2, 2, 3, 3, 3, 4]);
  list.distinct();
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4]);
});

test('List: toDistinct', () => {
  const list = List.fromArray([1, 2, 2, 3, 3, 3, 4]);
  const distinct = list.toDistinct();
  assert.deepStrictEqual(distinct.toArray(), [1, 2, 3, 4]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 2, 3, 3, 3, 4]);
});

test('List: shuffle', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const original = list.toArray().slice();
  list.shuffle();
  assert.strictEqual(list.size, 5);
  assert.deepStrictEqual(
    list.toArray().sort((a, b) => a - b),
    original.sort((a, b) => a - b),
  );
});

test('List: toShuffled', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const shuffled = list.toShuffled();
  assert.strictEqual(shuffled.size, 5);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: reverse', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.reverse();
  assert.deepStrictEqual(list.toArray(), [5, 4, 3, 2, 1]);
});

test('List: toReversed', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const reversed = list.toReversed();
  assert.deepStrictEqual(reversed.toArray(), [5, 4, 3, 2, 1]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: sort', () => {
  const list = List.fromArray([3, 1, 4, 1, 5, 9, 2, 6]);
  list.sort();
  assert.deepStrictEqual(list.toArray(), [1, 1, 2, 3, 4, 5, 6, 9]);
});

test('List: sort with comparator', () => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  list.sort((a, b) => b - a);
  assert.deepStrictEqual(list.toArray(), [5, 4, 3, 1, 1]);
});

test('List: toSorted', () => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  const sorted = list.toSorted();
  assert.deepStrictEqual(sorted.toArray(), [1, 1, 3, 4, 5]);
  assert.deepStrictEqual(list.toArray(), [3, 1, 4, 1, 5]);
});

test('List: map', () => {
  const list = List.fromArray([1, 2, 3]);
  const mapped = list.map((v) => v * 2);
  assert.deepStrictEqual(mapped.toArray(), [2, 4, 6]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: lazyMap', () => {
  const list = List.fromArray([1, 2, 3]);
  const iterator = list.lazyMap((v) => v * 2);
  const result = [...iterator];
  assert.deepStrictEqual(result, [2, 4, 6]);
});

test('List: flatMap', () => {
  const list = List.fromArray([1, 2, 3]);
  const flattened = list.flatMap((v) => [v, v * 10]);
  assert.deepStrictEqual(flattened.toArray(), [1, 10, 2, 20, 3, 30]);
});

test('List: filter', () => {
  const list = List.fromArray([1, 2, 3, 4, 5, 6]);
  const filtered = list.filter((v) => v % 2 === 0);
  assert.deepStrictEqual(filtered.toArray(), [2, 4, 6]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5, 6]);
});

test('List: lazyFilter', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const iterator = list.lazyFilter((v) => v > 2);
  const result = [...iterator];
  assert.deepStrictEqual(result, [3, 4, 5]);
});

test('List: reduce', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const sum = list.reduce((acc, v) => acc + v, 0);
  assert.strictEqual(sum, 15);
});

test('List: lazyReduce', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const iterator = list.lazyReduce((acc, v) => acc + v, 0);
  const results = [...iterator];
  assert.deepStrictEqual(results, [1, 3, 6, 10]);
});

test('List: sum', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(list.sum(), 15);
});

test('List: sum with extractor', () => {
  const list = List.fromArray([{ v: 1 }, { v: 2 }, { v: 3 }]);
  assert.strictEqual(
    list.sum((x) => x.v),
    6,
  );
});

test('List: avg', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(list.avg(), 3);
});

test('List: min', () => {
  const list = List.fromArray([3, 1, 4, 1, 5, 9, 2]);
  assert.strictEqual(list.min(), 1);
});

test('List: max', () => {
  const list = List.fromArray([3, 1, 4, 1, 5, 9, 2]);
  assert.strictEqual(list.max(), 9);
});

test('List: iterator', () => {
  const list = List.fromArray([1, 2, 3]);
  const result = [];
  for (const v of list) {
    result.push(v);
  }
  assert.deepStrictEqual(result, [1, 2, 3]);
});

test('List: toArray', () => {
  const list = List.fromArray([1, 2, 3]);
  const array = list.toArray();
  assert.deepStrictEqual(array, [1, 2, 3]);
});

test('List: join', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.strictEqual(list.join('-'), '1-2-3');
  assert.strictEqual(list.join(), '1,2,3');
});

test('List: clone', () => {
  const list = List.fromArray([1, 2, 3]);
  const cloned = list.clone();
  assert.deepStrictEqual(cloned.toArray(), [1, 2, 3]);
  cloned.append(4);
  assert.strictEqual(list.size, 3);
  assert.strictEqual(cloned.size, 4);
});

test('List: async iterator', async () => {
  const list = List.fromArray([1, 2, 3]);
  const result = [];
  for await (const v of list) {
    result.push(v);
  }
  assert.deepStrictEqual(result, [1, 2, 3]);
});

test('List: async iterator with Promise values', async () => {
  const list = List.fromArray([
    Promise.resolve(10),
    Promise.resolve(20),
    Promise.resolve(30),
  ]);
  const result = [];
  for await (const v of list) {
    result.push(v);
  }
  assert.deepStrictEqual(result, [10, 20, 30]);
});

test('List: async iterator with mixed values', async () => {
  const list = List.fromArray([1, Promise.resolve(2), 3, Promise.resolve(4)]);
  const result = [];
  for await (const v of list) {
    const value = v instanceof Promise ? await v : v;
    result.push(value);
  }
  assert.deepStrictEqual(result, [1, 2, 3, 4]);
});

test('List: async iterator with delayed Promises', async () => {
  const delay = (ms, value) =>
    new Promise((resolve) => setTimeout(() => resolve(value), ms));
  const list = List.fromArray([
    delay(10, 'first'),
    delay(5, 'second'),
    delay(1, 'third'),
  ]);
  const result = [];
  const start = Date.now();
  for await (const promise of list) {
    const value = await promise;
    result.push(value);
  }
  const elapsed = Date.now() - start;
  assert.deepStrictEqual(result, ['first', 'second', 'third']);
  assert.ok(elapsed >= 10, 'Should wait for promises to resolve');
});
