'use strict';

const metatests = require('metatests');
const { List } = require('../lib/list.js');

metatests.test('List: constructor', (test) => {
  const list = new List();
  test.strictSame(list.size, 0);
  test.end();
});

metatests.test('List: constructor with size', (test) => {
  const list = new List(3);
  test.strictSame(list.size, 3);
  test.strictSame(list.at(0), undefined);
  test.end();
});

metatests.test('List: fromArray', (test) => {
  const list = List.fromArray([1, 2, 3]);
  test.strictSame(list.size, 3);
  test.strictSame(list.at(0), 1);
  test.strictSame(list.at(2), 3);
  test.end();
});

metatests.test('List: fromIterator', (test) => {
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
  }
  const list = List.fromIterator(gen());
  test.strictSame(list.size, 3);
  test.strictSame(list.toArray(), [1, 2, 3]);
  test.end();
});

metatests.test('List: range', (test) => {
  const list1 = List.range(0, 5);
  test.strictSame(list1.toArray(), [0, 1, 2, 3, 4]);

  const list2 = List.range(0, 10, 2);
  test.strictSame(list2.toArray(), [0, 2, 4, 6, 8]);

  const list3 = List.range(5, 0, -1);
  test.strictSame(list3.toArray(), [5, 4, 3, 2, 1]);

  test.end();
});

metatests.test('List: merge', (test) => {
  const list1 = List.fromArray([1, 2]);
  const list2 = List.fromArray([3, 4]);
  const list3 = List.fromArray([5, 6]);
  const merged = List.merge([list1, list2, list3]);
  test.strictSame(merged.toArray(), [1, 2, 3, 4, 5, 6]);
  test.end();
});

metatests.test('List: append', (test) => {
  const list = new List();
  list.append(1);
  list.append(2);
  list.append(3);
  test.strictSame(list.toArray(), [1, 2, 3]);
  test.end();
});

metatests.test('List: prepend', (test) => {
  const list = new List();
  list.prepend(3);
  list.prepend(2);
  list.prepend(1);
  test.strictSame(list.toArray(), [1, 2, 3]);
  test.end();
});

metatests.test('List: clear', (test) => {
  const list = List.fromArray([1, 2, 3]);
  list.clear();
  test.strictSame(list.size, 0);
  test.end();
});

metatests.test('List: enqueue and dequeue', (test) => {
  const list = new List();
  list.enqueue(1);
  list.enqueue(2);
  list.enqueue(3);
  test.strictSame(list.dequeue(), 1);
  test.strictSame(list.dequeue(), 2);
  test.strictSame(list.size, 1);
  test.end();
});

metatests.test('List: first and last', (test) => {
  const list = List.fromArray([1, 2, 3]);
  test.strictSame(list.first(), 1);
  test.strictSame(list.last(), 3);
  test.end();
});

metatests.test('List: at with positive index', (test) => {
  const list = List.fromArray(['a', 'b', 'c', 'd']);
  test.strictSame(list.at(0), 'a');
  test.strictSame(list.at(2), 'c');
  test.end();
});

metatests.test('List: at with negative index', (test) => {
  const list = List.fromArray(['a', 'b', 'c', 'd']);
  test.strictSame(list.at(-1), 'd');
  test.strictSame(list.at(-2), 'c');
  test.end();
});

metatests.test('List: set', (test) => {
  const list = List.fromArray([1, 2, 3]);
  list.set(1, 20);
  test.strictSame(list.at(1), 20);
  list.set(-1, 30);
  test.strictSame(list.at(2), 30);
  test.end();
});

metatests.test('List: insert', (test) => {
  const list = List.fromArray([1, 3]);
  list.insert(1, 2);
  test.strictSame(list.toArray(), [1, 2, 3]);
  test.end();
});

metatests.test('List: insert multiple', (test) => {
  const list = List.fromArray([1, 4]);
  list.insert(1, 2, 2);
  test.strictSame(list.toArray(), [1, 2, 2, 4]);
  test.end();
});

metatests.test('List: delete', (test) => {
  const list = List.fromArray([1, 2, 3, 4]);
  list.delete(1);
  test.strictSame(list.toArray(), [1, 3, 4]);
  test.end();
});

metatests.test('List: delete multiple', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.delete(1, 3);
  test.strictSame(list.toArray(), [1, 5]);
  test.end();
});

metatests.test('List: addAll', (test) => {
  const list = List.fromArray([1, 2]);
  list.addAll([3, 4, 5]);
  test.strictSame(list.toArray(), [1, 2, 3, 4, 5]);
  test.end();
});

metatests.test('List: removeAll', (test) => {
  const list = List.fromArray([1, 2, 3, 2, 4, 2, 5]);
  list.removeAll([2, 4]);
  test.strictSame(list.toArray(), [1, 3, 5]);
  test.end();
});

metatests.test('List: fill', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.fill(0, 1, 4);
  test.strictSame(list.toArray(), [1, 0, 0, 0, 5]);
  test.end();
});

metatests.test('List: replace', (test) => {
  const list = List.fromArray([1, 2, 3, 2, 4, 2]);
  list.replace(2, 20);
  test.strictSame(list.toArray(), [1, 20, 3, 20, 4, 20]);
  test.end();
});

metatests.test('List: tail', (test) => {
  const list = List.fromArray([1, 2, 3, 4]);
  const tail = list.tail();
  test.strictSame(tail.toArray(), [2, 3, 4]);
  test.strictSame(list.toArray(), [1, 2, 3, 4]);
  test.end();
});

metatests.test('List: head', (test) => {
  const list = List.fromArray([1, 2, 3, 4]);
  const head = list.head();
  test.strictSame(head.toArray(), [1, 2, 3]);
  test.strictSame(list.toArray(), [1, 2, 3, 4]);
  test.end();
});

metatests.test('List: drop from beginning', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(2);
  test.strictSame(list.toArray(), [3, 4, 5]);
  test.end();
});

metatests.test('List: drop from end', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.drop(-2);
  test.strictSame(list.toArray(), [1, 2, 3]);
  test.end();
});

metatests.test('List: take from beginning', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const taken = list.take(3);
  test.strictSame(taken.toArray(), [1, 2, 3]);
  test.end();
});

metatests.test('List: take from end', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const taken = list.take(-3);
  test.strictSame(taken.toArray(), [3, 4, 5]);
  test.end();
});

metatests.test('List: slice', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const sliced = list.slice(1, 4);
  test.strictSame(sliced.toArray(), [2, 3, 4]);
  test.end();
});

metatests.test('List: splitAt', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const { before, after } = list.splitAt(2);
  test.strictSame(before.toArray(), [1, 2]);
  test.strictSame(after.toArray(), [3, 4, 5]);
  test.end();
});

metatests.test('List: groupBy', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5, 6]);
  const groups = list.groupBy((v) => (v % 2 === 0 ? 'even' : 'odd'));
  test.strictSame(groups.get('even').toArray(), [2, 4, 6]);
  test.strictSame(groups.get('odd').toArray(), [1, 3, 5]);
  test.end();
});

metatests.test('List: rotateLeft', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotateLeft(2);
  test.strictSame(list.toArray(), [3, 4, 5, 1, 2]);
  test.end();
});

metatests.test('List: rotateRight', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotateRight(2);
  test.strictSame(list.toArray(), [4, 5, 1, 2, 3]);
  test.end();
});

metatests.test('List: rotate', (test) => {
  const list1 = List.fromArray([1, 2, 3, 4, 5]);
  list1.rotate(2);
  test.strictSame(list1.toArray(), [4, 5, 1, 2, 3]);

  const list2 = List.fromArray([1, 2, 3, 4, 5]);
  list2.rotate(-2);
  test.strictSame(list2.toArray(), [3, 4, 5, 1, 2]);

  test.end();
});

metatests.test('List: swap', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.swap(1, 3);
  test.strictSame(list.toArray(), [1, 4, 3, 2, 5]);
  test.end();
});

metatests.test('List: move', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.move(1, 3);
  test.strictSame(list.toArray(), [1, 3, 4, 2, 5]);
  test.end();
});

metatests.test('List: includes', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  test.strictSame(list.includes(3), true);
  test.strictSame(list.includes(10), false);
  test.end();
});

metatests.test('List: indexOf', (test) => {
  const list = List.fromArray([1, 2, 3, 2, 4]);
  test.strictSame(list.indexOf(2), 1);
  test.strictSame(list.indexOf(5), -1);
  test.end();
});

metatests.test('List: lastIndexOf', (test) => {
  const list = List.fromArray([1, 2, 3, 2, 4]);
  test.strictSame(list.lastIndexOf(2), 3);
  test.strictSame(list.lastIndexOf(5), -1);
  test.end();
});

metatests.test('List: equals', (test) => {
  const list1 = List.fromArray([1, 2, 3]);
  const list2 = List.fromArray([1, 2, 3]);
  const list3 = List.fromArray([1, 2, 4]);
  test.strictSame(list1.equals(list2), true);
  test.strictSame(list1.equals(list3), false);
  test.end();
});

metatests.test('List: find', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const found = list.find((v) => v > 3);
  test.strictSame(found, 4);
  test.end();
});

metatests.test('List: findIndex', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const index = list.findIndex((v) => v > 3);
  test.strictSame(index, 3);
  test.end();
});

metatests.test('List: some', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  test.strictSame(
    list.some((v) => v > 4),
    true,
  );
  test.strictSame(
    list.some((v) => v > 10),
    false,
  );
  test.end();
});

metatests.test('List: every', (test) => {
  const list1 = List.fromArray([2, 4, 6, 8]);
  test.strictSame(
    list1.every((v) => v % 2 === 0),
    true,
  );

  const list2 = List.fromArray([2, 4, 5, 8]);
  test.strictSame(
    list2.every((v) => v % 2 === 0),
    false,
  );

  test.end();
});

metatests.test('List: distinct', (test) => {
  const list = List.fromArray([1, 2, 2, 3, 3, 3, 4]);
  list.distinct();
  test.strictSame(list.toArray(), [1, 2, 3, 4]);
  test.end();
});

metatests.test('List: toDistinct', (test) => {
  const list = List.fromArray([1, 2, 2, 3, 3, 3, 4]);
  const distinct = list.toDistinct();
  test.strictSame(distinct.toArray(), [1, 2, 3, 4]);
  test.strictSame(list.toArray(), [1, 2, 2, 3, 3, 3, 4]);
  test.end();
});

metatests.test('List: shuffle', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const original = list.toArray().slice();
  list.shuffle();
  test.strictSame(list.size, 5);
  test.strictSame(
    list.toArray().sort((a, b) => a - b),
    original.sort((a, b) => a - b),
  );
  test.end();
});

metatests.test('List: toShuffled', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const shuffled = list.toShuffled();
  test.strictSame(shuffled.size, 5);
  test.strictSame(list.toArray(), [1, 2, 3, 4, 5]);
  test.end();
});

metatests.test('List: reverse', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.reverse();
  test.strictSame(list.toArray(), [5, 4, 3, 2, 1]);
  test.end();
});

metatests.test('List: toReversed', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const reversed = list.toReversed();
  test.strictSame(reversed.toArray(), [5, 4, 3, 2, 1]);
  test.strictSame(list.toArray(), [1, 2, 3, 4, 5]);
  test.end();
});

metatests.test('List: sort', (test) => {
  const list = List.fromArray([3, 1, 4, 1, 5, 9, 2, 6]);
  list.sort();
  test.strictSame(list.toArray(), [1, 1, 2, 3, 4, 5, 6, 9]);
  test.end();
});

metatests.test('List: sort with comparator', (test) => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  list.sort((a, b) => b - a);
  test.strictSame(list.toArray(), [5, 4, 3, 1, 1]);
  test.end();
});

metatests.test('List: toSorted', (test) => {
  const list = List.fromArray([3, 1, 4, 1, 5]);
  const sorted = list.toSorted();
  test.strictSame(sorted.toArray(), [1, 1, 3, 4, 5]);
  test.strictSame(list.toArray(), [3, 1, 4, 1, 5]);
  test.end();
});

metatests.test('List: map', (test) => {
  const list = List.fromArray([1, 2, 3]);
  const mapped = list.map((v) => v * 2);
  test.strictSame(mapped.toArray(), [2, 4, 6]);
  test.strictSame(list.toArray(), [1, 2, 3]);
  test.end();
});

metatests.test('List: lazyMap', (test) => {
  const list = List.fromArray([1, 2, 3]);
  const iterator = list.lazyMap((v) => v * 2);
  const result = [...iterator];
  test.strictSame(result, [2, 4, 6]);
  test.end();
});

metatests.test('List: flatMap', (test) => {
  const list = List.fromArray([1, 2, 3]);
  const flattened = list.flatMap((v) => [v, v * 10]);
  test.strictSame(flattened.toArray(), [1, 10, 2, 20, 3, 30]);
  test.end();
});

metatests.test('List: filter', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5, 6]);
  const filtered = list.filter((v) => v % 2 === 0);
  test.strictSame(filtered.toArray(), [2, 4, 6]);
  test.strictSame(list.toArray(), [1, 2, 3, 4, 5, 6]);
  test.end();
});

metatests.test('List: lazyFilter', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const iterator = list.lazyFilter((v) => v > 2);
  const result = [...iterator];
  test.strictSame(result, [3, 4, 5]);
  test.end();
});

metatests.test('List: reduce', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const sum = list.reduce((acc, v) => acc + v, 0);
  test.strictSame(sum, 15);
  test.end();
});

metatests.test('List: lazyReduce', (test) => {
  const list = List.fromArray([1, 2, 3, 4]);
  const iterator = list.lazyReduce((acc, v) => acc + v, 0);
  const results = [...iterator];
  test.strictSame(results, [1, 3, 6, 10]);
  test.end();
});

metatests.test('List: sum', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  test.strictSame(list.sum(), 15);
  test.end();
});

metatests.test('List: sum with extractor', (test) => {
  const list = List.fromArray([{ v: 1 }, { v: 2 }, { v: 3 }]);
  test.strictSame(
    list.sum((x) => x.v),
    6,
  );
  test.end();
});

metatests.test('List: avg', (test) => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  test.strictSame(list.avg(), 3);
  test.end();
});

metatests.test('List: min', (test) => {
  const list = List.fromArray([3, 1, 4, 1, 5, 9, 2]);
  test.strictSame(list.min(), 1);
  test.end();
});

metatests.test('List: max', (test) => {
  const list = List.fromArray([3, 1, 4, 1, 5, 9, 2]);
  test.strictSame(list.max(), 9);
  test.end();
});

metatests.test('List: iterator', (test) => {
  const list = List.fromArray([1, 2, 3]);
  const result = [];
  for (const v of list) {
    result.push(v);
  }
  test.strictSame(result, [1, 2, 3]);
  test.end();
});

metatests.test('List: toArray', (test) => {
  const list = List.fromArray([1, 2, 3]);
  const array = list.toArray();
  test.strictSame(array, [1, 2, 3]);
  test.end();
});

metatests.test('List: join', (test) => {
  const list = List.fromArray([1, 2, 3]);
  test.strictSame(list.join('-'), '1-2-3');
  test.strictSame(list.join(), '1,2,3');
  test.end();
});

metatests.test('List: clone', (test) => {
  const list = List.fromArray([1, 2, 3]);
  const cloned = list.clone();
  test.strictSame(cloned.toArray(), [1, 2, 3]);
  cloned.append(4);
  test.strictSame(list.size, 3);
  test.strictSame(cloned.size, 4);
  test.end();
});
