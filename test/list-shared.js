'use strict';

const test = require('node:test');
const assert = require('node:assert');

module.exports = function createTests(ListClass, name) {
  // Phase 1: Core Infrastructure

  test(`${name}: constructor creates empty list`, () => {
    const list = new ListClass();
    assert.strictEqual(list.size, 0);
  });

  test(`${name}: size getter returns element count`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(list.size, 3);
  });

  test(`${name}: Symbol.iterator allows for...of`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const result = [];
    for (const item of list) {
      result.push(item);
    }
    assert.deepStrictEqual(result, [1, 2, 3]);
  });

  test(`${name}: Symbol.iterator allows spread`, () => {
    const list = ListClass.fromArray(['a', 'b', 'c']);
    assert.deepStrictEqual([...list], ['a', 'b', 'c']);
  });

  test(`${name}: toArray returns copy of elements`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const arr = list.toArray();
    assert.deepStrictEqual(arr, [1, 2, 3]);
    arr.push(4);
    assert.strictEqual(list.size, 3);
  });

  test(`${name}: clone creates independent copy`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const cloned = list.clone();
    cloned.append(4);
    assert.strictEqual(list.size, 3);
    assert.strictEqual(cloned.size, 4);
  });

  test(`${name}: clear removes all elements`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.clear();
    assert.strictEqual(list.size, 0);
    assert.deepStrictEqual([...list], []);
  });

  // Phase 2: Basic Operations

  test(`${name}: at returns element at index`, () => {
    const list = ListClass.fromArray([10, 20, 30]);
    assert.strictEqual(list.at(0), 10);
    assert.strictEqual(list.at(1), 20);
    assert.strictEqual(list.at(2), 30);
  });

  test(`${name}: at supports negative indices`, () => {
    const list = ListClass.fromArray([10, 20, 30]);
    assert.strictEqual(list.at(-1), 30);
    assert.strictEqual(list.at(-2), 20);
    assert.strictEqual(list.at(-3), 10);
  });

  test(`${name}: at returns undefined for out of bounds`, () => {
    const list = ListClass.fromArray([1, 2]);
    assert.strictEqual(list.at(5), undefined);
    assert.strictEqual(list.at(-5), undefined);
  });

  test(`${name}: set modifies element at index`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.set(1, 99);
    assert.deepStrictEqual([...list], [1, 99, 3]);
  });

  test(`${name}: set supports negative indices`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.set(-1, 99);
    assert.deepStrictEqual([...list], [1, 2, 99]);
  });

  test(`${name}: set ignores out of bounds`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.set(10, 99);
    list.set(-10, 99);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: first returns first element`, () => {
    const list = ListClass.fromArray([10, 20, 30]);
    assert.strictEqual(list.first(), 10);
  });

  test(`${name}: first returns undefined for empty list`, () => {
    const list = new ListClass();
    assert.strictEqual(list.first(), undefined);
  });

  test(`${name}: last returns last element`, () => {
    const list = ListClass.fromArray([10, 20, 30]);
    assert.strictEqual(list.last(), 30);
  });

  test(`${name}: last returns undefined for empty list`, () => {
    const list = new ListClass();
    assert.strictEqual(list.last(), undefined);
  });

  test(`${name}: append adds to end`, () => {
    const list = ListClass.fromArray([1, 2]);
    list.append(3);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: prepend adds to start`, () => {
    const list = ListClass.fromArray([2, 3]);
    list.prepend(1);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: insert adds at index`, () => {
    const list = ListClass.fromArray([1, 4]);
    list.insert(1, 2);
    assert.deepStrictEqual([...list], [1, 2, 4]);
  });

  test(`${name}: insert with count adds multiple`, () => {
    const list = ListClass.fromArray([1, 5]);
    list.insert(1, 0, 3);
    assert.deepStrictEqual([...list], [1, 0, 0, 0, 5]);
  });

  test(`${name}: delete removes at index`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    list.delete(1);
    assert.deepStrictEqual([...list], [1, 3, 4]);
  });

  test(`${name}: delete with count removes multiple`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.delete(1, 3);
    assert.deepStrictEqual([...list], [1, 5]);
  });

  // Phase 3: Queue/Stack Operations

  test(`${name}: enqueue adds to end (alias for append)`, () => {
    const list = ListClass.fromArray([1, 2]);
    list.enqueue(3);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: dequeue removes and returns first element`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const value = list.dequeue();
    assert.strictEqual(value, 1);
    assert.deepStrictEqual([...list], [2, 3]);
  });

  test(`${name}: dequeue returns undefined for empty list`, () => {
    const list = new ListClass();
    assert.strictEqual(list.dequeue(), undefined);
  });

  // Phase 4: Static Factory Methods

  test(`${name}: fromArray creates list from array`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: fromIterator creates list from iterator`, () => {
    const set = new Set([1, 2, 3]);
    const list = ListClass.fromIterator(set);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: fromIterator works with generator`, () => {
    function* gen() {
      yield 'a';
      yield 'b';
      yield 'c';
    }
    const list = ListClass.fromIterator(gen());
    assert.deepStrictEqual([...list], ['a', 'b', 'c']);
  });

  test(`${name}: range creates ascending range`, () => {
    const list = ListClass.range(0, 5);
    assert.deepStrictEqual([...list], [0, 1, 2, 3, 4]);
  });

  test(`${name}: range with step`, () => {
    const list = ListClass.range(0, 10, 2);
    assert.deepStrictEqual([...list], [0, 2, 4, 6, 8]);
  });

  test(`${name}: range descending with negative step`, () => {
    const list = ListClass.range(5, 0, -1);
    assert.deepStrictEqual([...list], [5, 4, 3, 2, 1]);
  });

  test(`${name}: range empty when step is zero`, () => {
    const list = ListClass.range(0, 5, 0);
    assert.strictEqual(list.size, 0);
  });

  test(`${name}: merge combines multiple lists`, () => {
    const a = ListClass.fromArray([1, 2]);
    const b = ListClass.fromArray([3, 4]);
    const c = ListClass.fromArray([5]);
    const merged = ListClass.merge([a, b, c]);
    assert.deepStrictEqual([...merged], [1, 2, 3, 4, 5]);
  });

  test(`${name}: merge works with empty lists`, () => {
    const a = ListClass.fromArray([1]);
    const b = new ListClass();
    const c = ListClass.fromArray([2]);
    const merged = ListClass.merge([a, b, c]);
    assert.deepStrictEqual([...merged], [1, 2]);
  });

  // Phase 5: Slicing & Subsetting

  test(`${name}: slice extracts portion`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const sliced = list.slice(1, 4);
    assert.deepStrictEqual([...sliced], [2, 3, 4]);
  });

  test(`${name}: slice with negative indices`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const sliced = list.slice(-3, -1);
    assert.deepStrictEqual([...sliced], [3, 4]);
  });

  test(`${name}: slice without arguments copies all`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const sliced = list.slice();
    assert.deepStrictEqual([...sliced], [1, 2, 3]);
  });

  test(`${name}: head returns all but last element`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    const head = list.head();
    assert.deepStrictEqual([...head], [1, 2, 3]);
  });

  test(`${name}: head on single element returns empty`, () => {
    const list = ListClass.fromArray([1]);
    const head = list.head();
    assert.strictEqual(head.size, 0);
  });

  test(`${name}: tail returns all but first element`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    const tail = list.tail();
    assert.deepStrictEqual([...tail], [2, 3, 4]);
  });

  test(`${name}: tail on single element returns empty`, () => {
    const list = ListClass.fromArray([1]);
    const tail = list.tail();
    assert.strictEqual(tail.size, 0);
  });

  test(`${name}: take positive n from start`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const taken = list.take(3);
    assert.deepStrictEqual([...taken], [1, 2, 3]);
  });

  test(`${name}: take negative n from end`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const taken = list.take(-2);
    assert.deepStrictEqual([...taken], [4, 5]);
  });

  test(`${name}: drop positive n removes from start`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.drop(2);
    assert.deepStrictEqual([...list], [3, 4, 5]);
  });

  test(`${name}: drop negative n removes from end`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.drop(-2);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: splitAt divides list`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const { before, after } = list.splitAt(2);
    assert.deepStrictEqual([...before], [1, 2]);
    assert.deepStrictEqual([...after], [3, 4, 5]);
  });

  test(`${name}: splitAt at start`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const { before, after } = list.splitAt(0);
    assert.strictEqual(before.size, 0);
    assert.deepStrictEqual([...after], [1, 2, 3]);
  });

  test(`${name}: splitAt at end`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const { before, after } = list.splitAt(3);
    assert.deepStrictEqual([...before], [1, 2, 3]);
    assert.strictEqual(after.size, 0);
  });

  // Phase 6: Search Operations

  test(`${name}: includes returns true when value exists`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(list.includes(2), true);
  });

  test(`${name}: includes returns false when value missing`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(list.includes(5), false);
  });

  test(`${name}: indexOf returns first index`, () => {
    const list = ListClass.fromArray([1, 2, 3, 2]);
    assert.strictEqual(list.indexOf(2), 1);
  });

  test(`${name}: indexOf returns -1 when not found`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(list.indexOf(5), -1);
  });

  test(`${name}: lastIndexOf returns last index`, () => {
    const list = ListClass.fromArray([1, 2, 3, 2]);
    assert.strictEqual(list.lastIndexOf(2), 3);
  });

  test(`${name}: find returns matching element`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    assert.strictEqual(
      list.find((x) => x > 2),
      3,
    );
  });

  test(`${name}: find returns undefined when no match`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(
      list.find((x) => x > 10),
      undefined,
    );
  });

  test(`${name}: findIndex returns index of match`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    assert.strictEqual(
      list.findIndex((x) => x > 2),
      2,
    );
  });

  test(`${name}: findIndex returns -1 when no match`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(
      list.findIndex((x) => x > 10),
      -1,
    );
  });

  test(`${name}: equals returns true for equal lists`, () => {
    const a = ListClass.fromArray([1, 2, 3]);
    const b = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(a.equals(b), true);
  });

  test(`${name}: equals returns false for different lengths`, () => {
    const a = ListClass.fromArray([1, 2, 3]);
    const b = ListClass.fromArray([1, 2]);
    assert.strictEqual(a.equals(b), false);
  });

  test(`${name}: equals returns false for different values`, () => {
    const a = ListClass.fromArray([1, 2, 3]);
    const b = ListClass.fromArray([1, 2, 4]);
    assert.strictEqual(a.equals(b), false);
  });

  // Phase 7: Bulk Modifications

  test(`${name}: addAll adds multiple values`, () => {
    const list = ListClass.fromArray([1, 2]);
    list.addAll([3, 4, 5]);
    assert.deepStrictEqual([...list], [1, 2, 3, 4, 5]);
  });

  test(`${name}: addAll works with iterables`, () => {
    const list = ListClass.fromArray([1]);
    list.addAll(new Set([2, 3]));
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: removeAll removes matching values`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.removeAll([2, 4]);
    assert.deepStrictEqual([...list], [1, 3, 5]);
  });

  test(`${name}: removeAll handles duplicates`, () => {
    const list = ListClass.fromArray([1, 2, 2, 3, 2]);
    list.removeAll([2]);
    assert.deepStrictEqual([...list], [1, 3]);
  });

  test(`${name}: fill fills entire list`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.fill(0);
    assert.deepStrictEqual([...list], [0, 0, 0]);
  });

  test(`${name}: fill fills range`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.fill(0, 1, 4);
    assert.deepStrictEqual([...list], [1, 0, 0, 0, 5]);
  });

  test(`${name}: replace replaces first occurrence`, () => {
    const list = ListClass.fromArray([1, 2, 3, 2]);
    list.replace(2, 99);
    assert.deepStrictEqual([...list], [1, 99, 3, 2]);
  });

  test(`${name}: replace does nothing if not found`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.replace(5, 99);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  // Phase 8: Reordering

  test(`${name}: swap exchanges two elements`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    list.swap(0, 3);
    assert.deepStrictEqual([...list], [4, 2, 3, 1]);
  });

  test(`${name}: swap with negative indices`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    list.swap(0, -1);
    assert.deepStrictEqual([...list], [4, 2, 3, 1]);
  });

  test(`${name}: move relocates element`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.move(0, 3);
    assert.deepStrictEqual([...list], [2, 3, 4, 1, 5]);
  });

  test(`${name}: rotate positive shifts right`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.rotate(2);
    assert.deepStrictEqual([...list], [4, 5, 1, 2, 3]);
  });

  test(`${name}: rotate negative shifts left`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.rotate(-2);
    assert.deepStrictEqual([...list], [3, 4, 5, 1, 2]);
  });

  test(`${name}: rotateLeft shifts left`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    list.rotateLeft(1);
    assert.deepStrictEqual([...list], [2, 3, 4, 1]);
  });

  test(`${name}: rotateRight shifts right`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    list.rotateRight(1);
    assert.deepStrictEqual([...list], [4, 1, 2, 3]);
  });

  test(`${name}: reverse reverses in place`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.reverse();
    assert.deepStrictEqual([...list], [3, 2, 1]);
  });

  test(`${name}: toReversed returns reversed copy`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const reversed = list.toReversed();
    assert.deepStrictEqual([...reversed], [3, 2, 1]);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  // Phase 9: Sorting & Shuffling

  test(`${name}: sort sorts in place`, () => {
    const list = ListClass.fromArray([3, 1, 2]);
    list.sort((a, b) => a - b);
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: sort with default comparator`, () => {
    const list = ListClass.fromArray(['c', 'a', 'b']);
    list.sort();
    assert.deepStrictEqual([...list], ['a', 'b', 'c']);
  });

  test(`${name}: toSorted returns sorted copy`, () => {
    const list = ListClass.fromArray([3, 1, 2]);
    const sorted = list.toSorted((a, b) => a - b);
    assert.deepStrictEqual([...sorted], [1, 2, 3]);
    assert.deepStrictEqual([...list], [3, 1, 2]);
  });

  test(`${name}: shuffle randomizes order`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    list.shuffle();
    const arr = [...list].sort();
    assert.deepStrictEqual(arr, [1, 2, 3, 4, 5]);
  });

  test(`${name}: shuffle with custom random`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    let callCount = 0;
    list.shuffle(() => {
      callCount++;
      return 0.5;
    });
    assert(callCount > 0);
  });

  test(`${name}: toShuffled returns shuffled copy`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const shuffled = list.toShuffled();
    assert.deepStrictEqual([...list], [1, 2, 3, 4, 5]);
    assert.deepStrictEqual([...shuffled].sort(), [1, 2, 3, 4, 5]);
  });

  // Phase 10: Deduplication

  test(`${name}: distinct removes duplicates in place`, () => {
    const list = ListClass.fromArray([1, 2, 2, 3, 1, 4]);
    list.distinct();
    assert.deepStrictEqual([...list], [1, 2, 3, 4]);
  });

  test(`${name}: distinct on unique list unchanged`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    list.distinct();
    assert.deepStrictEqual([...list], [1, 2, 3]);
  });

  test(`${name}: toDistinct returns deduplicated copy`, () => {
    const list = ListClass.fromArray([1, 2, 2, 3, 1]);
    const unique = list.toDistinct();
    assert.deepStrictEqual([...unique], [1, 2, 3]);
    assert.deepStrictEqual([...list], [1, 2, 2, 3, 1]);
  });

  // Phase 11: Functional Methods

  test(`${name}: map transforms elements`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const doubled = list.map((x) => x * 2);
    assert.deepStrictEqual([...doubled], [2, 4, 6]);
  });

  test(`${name}: map receives index`, () => {
    const list = ListClass.fromArray(['a', 'b', 'c']);
    const indexed = list.map((v, i) => `${i}:${v}`);
    assert.deepStrictEqual([...indexed], ['0:a', '1:b', '2:c']);
  });

  test(`${name}: flatMap flattens arrays`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const flat = list.flatMap((x) => [x, x * 10]);
    assert.deepStrictEqual([...flat], [1, 10, 2, 20, 3, 30]);
  });

  test(`${name}: flatMap works with Lists`, () => {
    const list = ListClass.fromArray([1, 2]);
    const flat = list.flatMap((x) => ListClass.fromArray([x, x]));
    assert.deepStrictEqual([...flat], [1, 1, 2, 2]);
  });

  test(`${name}: filter removes non-matching`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const evens = list.filter((x) => x % 2 === 0);
    assert.deepStrictEqual([...evens], [2, 4]);
  });

  test(`${name}: filter receives index`, () => {
    const list = ListClass.fromArray(['a', 'b', 'c', 'd']);
    const odd = list.filter((_, i) => i % 2 === 1);
    assert.deepStrictEqual([...odd], ['b', 'd']);
  });

  test(`${name}: reduce accumulates value`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    const sum = list.reduce((acc, v) => acc + v, 0);
    assert.strictEqual(sum, 10);
  });

  test(`${name}: some returns true if any match`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(
      list.some((x) => x > 2),
      true,
    );
    assert.strictEqual(
      list.some((x) => x > 10),
      false,
    );
  });

  test(`${name}: every returns true if all match`, () => {
    const list = ListClass.fromArray([2, 4, 6]);
    assert.strictEqual(
      list.every((x) => x % 2 === 0),
      true,
    );
    assert.strictEqual(
      list.every((x) => x > 3),
      false,
    );
  });

  test(`${name}: sum adds numbers`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    assert.strictEqual(list.sum(), 10);
  });

  test(`${name}: sum with extractor`, () => {
    const list = ListClass.fromArray([{ v: 1 }, { v: 2 }, { v: 3 }]);
    assert.strictEqual(
      list.sum((x) => x.v),
      6,
    );
  });

  test(`${name}: sum of empty list is 0`, () => {
    const list = new ListClass();
    assert.strictEqual(list.sum(), 0);
  });

  test(`${name}: avg computes average`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    assert.strictEqual(list.avg(), 3);
  });

  test(`${name}: avg with extractor`, () => {
    const list = ListClass.fromArray([{ v: 2 }, { v: 4 }]);
    assert.strictEqual(
      list.avg((x) => x.v),
      3,
    );
  });

  test(`${name}: avg of empty list is NaN`, () => {
    const list = new ListClass();
    assert.strictEqual(Number.isNaN(list.avg()), true);
  });

  test(`${name}: min returns smallest`, () => {
    const list = ListClass.fromArray([3, 1, 4, 1, 5]);
    assert.strictEqual(list.min(), 1);
  });

  test(`${name}: min with comparator`, () => {
    const list = ListClass.fromArray([{ v: 3 }, { v: 1 }, { v: 2 }]);
    const min = list.min((a, b) => a.v - b.v);
    assert.deepStrictEqual(min, { v: 1 });
  });

  test(`${name}: min of empty list is undefined`, () => {
    const list = new ListClass();
    assert.strictEqual(list.min(), undefined);
  });

  test(`${name}: max returns largest`, () => {
    const list = ListClass.fromArray([3, 1, 4, 1, 5]);
    assert.strictEqual(list.max(), 5);
  });

  test(`${name}: max with comparator`, () => {
    const list = ListClass.fromArray([{ v: 3 }, { v: 1 }, { v: 2 }]);
    const max = list.max((a, b) => a.v - b.v);
    assert.deepStrictEqual(max, { v: 3 });
  });

  test(`${name}: max of empty list is undefined`, () => {
    const list = new ListClass();
    assert.strictEqual(list.max(), undefined);
  });

  test(`${name}: groupBy groups elements`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5, 6]);
    const groups = list.groupBy((x) => (x % 2 === 0 ? 'even' : 'odd'));
    assert.deepStrictEqual([...groups.get('odd')], [1, 3, 5]);
    assert.deepStrictEqual([...groups.get('even')], [2, 4, 6]);
  });

  test(`${name}: groupBy returns Map of correct class`, () => {
    const list = ListClass.fromArray(['a', 'ab', 'abc', 'b', 'bc']);
    const groups = list.groupBy((s) => s.length);
    assert(groups instanceof Map);
    assert(groups.get(1) instanceof ListClass);
  });

  // Phase 12: Lazy Iterators

  test(`${name}: lazyMap returns iterator`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const iter = list.lazyMap((x) => x * 2);
    assert.strictEqual(iter.next().value, 2);
    assert.strictEqual(iter.next().value, 4);
    assert.strictEqual(iter.next().value, 6);
    assert.strictEqual(iter.next().done, true);
  });

  test(`${name}: lazyMap can be spread`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const result = [...list.lazyMap((x) => x * 2)];
    assert.deepStrictEqual(result, [2, 4, 6]);
  });

  test(`${name}: lazyFilter returns iterator`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const iter = list.lazyFilter((x) => x % 2 === 0);
    assert.strictEqual(iter.next().value, 2);
    assert.strictEqual(iter.next().value, 4);
    assert.strictEqual(iter.next().done, true);
  });

  test(`${name}: lazyFilter can be spread`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4, 5]);
    const result = [...list.lazyFilter((x) => x > 2)];
    assert.deepStrictEqual(result, [3, 4, 5]);
  });

  test(`${name}: lazyReduce yields running totals`, () => {
    const list = ListClass.fromArray([1, 2, 3, 4]);
    const iter = list.lazyReduce((acc, v) => acc + v, 0);
    assert.strictEqual(iter.next().value, 1);
    assert.strictEqual(iter.next().value, 3);
    assert.strictEqual(iter.next().value, 6);
    assert.strictEqual(iter.next().value, 10);
    assert.strictEqual(iter.next().done, true);
  });

  test(`${name}: lazyReduce can be spread`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const result = [...list.lazyReduce((acc, v) => acc + v, 0)];
    assert.deepStrictEqual(result, [1, 3, 6]);
  });

  // Phase 13: String/Output

  test(`${name}: join with default separator`, () => {
    const list = ListClass.fromArray([1, 2, 3]);
    assert.strictEqual(list.join(), '1,2,3');
  });

  test(`${name}: join with custom separator`, () => {
    const list = ListClass.fromArray(['a', 'b', 'c']);
    assert.strictEqual(list.join(' - '), 'a - b - c');
  });

  test(`${name}: join empty list`, () => {
    const list = new ListClass();
    assert.strictEqual(list.join(), '');
  });

  // Phase 14: Async Iterator

  test(`${name}: async iterator yields existing items`, async () => {
    const list = ListClass.fromArray([1, 2, 3]);
    const result = [];
    const iter = list[Symbol.asyncIterator]();
    result.push((await iter.next()).value);
    result.push((await iter.next()).value);
    result.push((await iter.next()).value);
    assert.deepStrictEqual(result, [1, 2, 3]);
  });

  test(`${name}: async iterator waits for new items`, async () => {
    const list = new ListClass();
    const result = [];

    const iter = list[Symbol.asyncIterator]();
    const promise = iter.next();

    setTimeout(() => list.append(42), 10);
    const item = await promise;
    result.push(item.value);

    assert.deepStrictEqual(result, [42]);
  });

  test(`${name}: async iterator can be aborted with return`, async () => {
    const list = new ListClass();
    const iter = list[Symbol.asyncIterator]();
    const result = await iter.return();
    assert.strictEqual(result.done, true);
  });
};
