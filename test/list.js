'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { List, ListNode } = metautil;

// --- ListNode ---

test('ListNode: append and prepend', () => {
  const a = new ListNode(1);
  const b = a.append(2);
  const c = b.append(3);
  const zero = a.prepend(0);
  assert.strictEqual(zero.next, a);
  assert.strictEqual(a.prev, zero);
  assert.strictEqual(a.next, b);
  assert.strictEqual(b.prev, a);
  assert.strictEqual(b.next, c);
  assert.strictEqual(c.prev, b);
  assert.strictEqual(c.next, null);
});

test('ListNode: unlink middle', () => {
  const a = new ListNode(1);
  const b = a.append(2);
  const c = b.append(3);
  const { prev, next } = b.unlink();
  assert.strictEqual(prev, a);
  assert.strictEqual(next, c);
  assert.strictEqual(a.next, c);
  assert.strictEqual(c.prev, a);
  assert.strictEqual(b.prev, null);
  assert.strictEqual(b.next, null);
});

test('ListNode: unlink ends', () => {
  const a = new ListNode(1);
  const b = a.append(2);
  a.unlink();
  assert.strictEqual(b.prev, null);
  b.unlink();
  assert.strictEqual(b.next, null);
});

test('ListNode: seek forward and backward', () => {
  const a = new ListNode(1);
  const b = a.append(2);
  const c = b.append(3);
  assert.strictEqual(a.seek(0), a);
  assert.strictEqual(a.seek(1), b);
  assert.strictEqual(a.seek(2), c);
  assert.strictEqual(a.seek(3), null);
  assert.strictEqual(c.seek(-1), b);
  assert.strictEqual(c.seek(-2), a);
  assert.strictEqual(c.seek(-3), null);
});

test('ListNode: seek returns null for non-integer steps', () => {
  const a = new ListNode(1);
  a.append(2);
  assert.strictEqual(a.seek(1.5), null);
  assert.strictEqual(a.seek(NaN), null);
  assert.strictEqual(a.seek(Infinity), null);
});

test('ListNode: fromArray and link', () => {
  const empty = ListNode.fromArray([]);
  assert.strictEqual(empty.head, null);
  assert.strictEqual(empty.tail, null);
  assert.strictEqual(empty.size, 0);
  const chain = ListNode.fromArray([1, 2, 3]);
  assert.strictEqual(chain.size, 3);
  assert.strictEqual(chain.head.value, 1);
  assert.strictEqual(chain.tail.value, 3);
  assert.strictEqual(chain.head.next.value, 2);
  assert.strictEqual(chain.tail.prev.value, 2);
  const a = new ListNode(10);
  const b = new ListNode(20);
  ListNode.link(a, b);
  assert.strictEqual(a.next, b);
  assert.strictEqual(b.prev, a);
  ListNode.link(b, null);
  assert.strictEqual(b.next, null);
  ListNode.link(null, a);
  assert.strictEqual(a.prev, null);
});

test('ListNode: copy', () => {
  const source = ListNode.fromArray([1, 2, 3, 4]);
  const copied = ListNode.copy(source.head.next, 2);
  assert.strictEqual(copied.head.value, 2);
  assert.strictEqual(copied.tail.value, 3);
  assert.strictEqual(copied.size, 2);
  assert.strictEqual(copied.head.next, copied.tail);
  assert.strictEqual(copied.next, source.head.next.next.next);
  assert.strictEqual(copied.next.value, 4);
  assert.notStrictEqual(copied.head, source.head.next);
  const empty = ListNode.copy(source.head, 0);
  assert.strictEqual(empty.head, null);
  assert.strictEqual(empty.tail, null);
  assert.strictEqual(empty.size, 0);
  assert.strictEqual(empty.next, source.head);
});

test('ListNode: create wires neighbors', () => {
  const a = new ListNode(1);
  const c = new ListNode(3);
  ListNode.link(a, c);
  const b = ListNode.create(2, a, c);
  assert.strictEqual(a.next, b);
  assert.strictEqual(b.prev, a);
  assert.strictEqual(b.next, c);
  assert.strictEqual(c.prev, b);
  assert.strictEqual(b.value, 2);
});

// --- Construction ---

test('List: of', () => {
  const empty = List.of();
  assert.strictEqual(empty.size, 0);
  const list = List.of(1, 2, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: fromArray and toArray roundtrip', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  assert.strictEqual(list.size, 3);
});

test('List: merge', () => {
  const a = List.fromArray([1, 2]);
  const b = List.fromArray([3, 4]);
  const c = List.merge(a, b, new List());
  assert.deepStrictEqual(c.toArray(), [1, 2, 3, 4]);
  assert.strictEqual(a.size, 2);
  assert.deepStrictEqual(a.toArray(), [1, 2]);
  assert.deepStrictEqual(b.toArray(), [3, 4]);
});

// --- CRUD ---

test('List: append and prepend', () => {
  const list = new List();
  list.append(2);
  list.prepend(1);
  list.append(3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: append multiple values', () => {
  const list = List.fromArray([1, 2]);
  list.append(3, 4, 5);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: append with no args is a no-op', () => {
  const list = List.fromArray([1, 2]);
  list.append();
  assert.deepStrictEqual(list.toArray(), [1, 2]);
  assert.strictEqual(list.size, 2);
});

test('List: append on empty list', () => {
  const list = new List();
  list.append(1, 2, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: prepend multiple values', () => {
  const list = List.fromArray([4, 5]);
  list.prepend(1, 2, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
});

test('List: prepend on empty list', () => {
  const list = new List();
  list.prepend(1, 2, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: prepend with no args is a no-op', () => {
  const list = List.of(1, 2);
  list.prepend();
  assert.deepStrictEqual(list.toArray(), [1, 2]);
  assert.strictEqual(list.size, 2);
});

test('List: insert at index', () => {
  const list = List.fromArray([1, 3]);
  list.insert(1, 2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: insert multiple values', () => {
  const list = List.fromArray([1, 4]);
  list.insert(1, 2, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4]);
});

test('List: insert at end', () => {
  const list = List.fromArray([1, 2]);
  list.insert(5, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: insert at exact end index', () => {
  const list = List.fromArray([1, 2]);
  list.insert(2, 3);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: insert at index 0 prepends', () => {
  const list = List.fromArray([2, 3]);
  list.insert(0, 1);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: insert with no values is a no-op', () => {
  const list = List.of(1, 2, 3);
  list.insert(1);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  assert.strictEqual(list.size, 3);
});

test('List: delete ignores non-integer count', () => {
  const list = List.of(1, 2, 3, 4, 5);
  list.delete(1, 2.9);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
  assert.strictEqual(list.size, 5);
});

test('List: ignores NaN index and count', () => {
  const list = List.of(1, 2, 3);
  list.insert(NaN, 9);
  list.delete(0, NaN);
  assert.strictEqual(list.at(NaN), undefined);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  assert.strictEqual(list.size, 3);
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

test('List: delete past end is a no-op', () => {
  const list = List.fromArray([1, 2, 3]);
  list.delete(5);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: delete on empty is a no-op', () => {
  const list = new List();
  list.delete(0);
  assert.strictEqual(list.size, 0);
});

test('List: at and set', () => {
  const list = List.fromArray([10, 20, 30]);
  assert.strictEqual(list.at(0), 10);
  assert.strictEqual(list.at(2), 30);
  assert.strictEqual(list.at(-1), 30);
  assert.strictEqual(list.at(-2), 20);
  assert.strictEqual(list.at(3), undefined);
  list.set(1, 99);
  assert.strictEqual(list.at(1), 99);
  list.set(-1, 77);
  assert.strictEqual(list.at(2), 77);
});

test('List: insert at negative index', () => {
  const list = List.fromArray([1, 3]);
  list.insert(-1, 2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: delete at negative index', () => {
  const list = List.fromArray([1, 2, 3]);
  list.delete(-1);
  assert.deepStrictEqual(list.toArray(), [1, 2]);
});

// --- Slicing ---

test('List: take first n', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.take(3).toArray(), [1, 2, 3]);
});

test('List: take last n (negative)', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.take(-2).toArray(), [4, 5]);
});

test('List: take(0) and take on empty return null', () => {
  const list = List.of(1, 2, 3);
  assert.strictEqual(list.take(0), null);
  assert.strictEqual(new List().take(3), null);
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

test('List: drop clears when |n| covers size; drop(0) is a no-op', () => {
  const list = List.of(1, 2, 3);
  list.drop(0);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  list.drop(10);
  assert.strictEqual(list.size, 0);
  assert.deepStrictEqual(list.toArray(), []);
  const other = List.of(1, 2);
  other.drop(-5);
  assert.strictEqual(other.size, 0);
});

test('List: slice', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.deepStrictEqual(list.slice(1, 4).toArray(), [2, 3, 4]);
  assert.deepStrictEqual(list.slice(2).toArray(), [3, 4, 5]);
  assert.deepStrictEqual(list.slice(-2).toArray(), [4, 5]);
  assert.strictEqual(list.size, 5);
});

test('List: slice empty range returns null', () => {
  const list = List.of(1, 2, 3);
  assert.strictEqual(list.slice(2, 2), null);
  assert.strictEqual(list.slice(3, 1), null);
});

test('List: drop/take/slice ignore non-integer n', () => {
  const list = List.of(1, 2, 3, 4, 5);
  assert.strictEqual(list.take(2.9), null);
  assert.strictEqual(list.slice(1.5, 3), null);
  list.drop(1.9);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
  assert.strictEqual(list.size, 5);
});

// --- Rearranging ---

test('List: rotate', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  list.rotate(2);
  assert.deepStrictEqual(list.toArray(), [3, 4, 5, 1, 2]);
  list.rotate(-2);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
  list.rotate(-2);
  assert.deepStrictEqual(list.toArray(), [4, 5, 1, 2, 3]);
});

test('List: rotate default is 1', () => {
  const list = List.fromArray([1, 2, 3]);
  list.rotate();
  assert.deepStrictEqual(list.toArray(), [2, 3, 1]);
});

test('List: rotate uses modulo for large n', () => {
  const list = List.of(1, 2, 3, 4, 5);
  list.rotate(1e15);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3, 4, 5]);
  list.rotate(7);
  assert.deepStrictEqual(list.toArray(), [3, 4, 5, 1, 2]);
  list.rotate(Infinity);
  assert.deepStrictEqual(list.toArray(), [3, 4, 5, 1, 2]);
  assert.strictEqual(list.size, 5);
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

test('List: move with negative indexes; same/oob is a no-op', () => {
  const list = List.of(1, 2, 3, 4);
  list.move(-1, 0);
  assert.deepStrictEqual(list.toArray(), [4, 1, 2, 3]);
  list.move(1, 1);
  assert.deepStrictEqual(list.toArray(), [4, 1, 2, 3]);
  list.move(0, 9);
  assert.deepStrictEqual(list.toArray(), [4, 1, 2, 3]);
  list.move(1.5, 0);
  assert.deepStrictEqual(list.toArray(), [4, 1, 2, 3]);
});

test('List: splitAt', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const { before, after } = list.splitAt(3);
  assert.deepStrictEqual(before.toArray(), [1, 2, 3]);
  assert.deepStrictEqual(after.toArray(), [4, 5]);
});

test('List: splitAt edges and non-integer index', () => {
  const list = List.of(1, 2, 3);
  const atStart = list.splitAt(0);
  assert.deepStrictEqual(atStart.before.toArray(), []);
  assert.deepStrictEqual(atStart.after.toArray(), [1, 2, 3]);
  const atEnd = list.splitAt(3);
  assert.deepStrictEqual(atEnd.before.toArray(), [1, 2, 3]);
  assert.deepStrictEqual(atEnd.after.toArray(), []);
  const negative = list.splitAt(-1);
  assert.deepStrictEqual(negative.before.toArray(), [1, 2]);
  assert.deepStrictEqual(negative.after.toArray(), [3]);
  const invalid = list.splitAt(1.5);
  assert.deepStrictEqual(invalid.before.toArray(), []);
  assert.deepStrictEqual(invalid.after.toArray(), [1, 2, 3]);
  const empty = new List().splitAt(0);
  assert.deepStrictEqual(empty.before.toArray(), []);
  assert.deepStrictEqual(empty.after.toArray(), []);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
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

// --- Bulk mutations ---

test('List: remove', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  assert.strictEqual(list.remove(2, 4), 2);
  assert.deepStrictEqual(list.toArray(), [1, 3, 5]);
});

test('List: remove single value', () => {
  const list = List.fromArray([1, 2, 3, 2, 4]);
  assert.strictEqual(list.remove(2), 2);
  assert.deepStrictEqual(list.toArray(), [1, 3, 4]);
});

test('List: remove returns 0 when nothing matches', () => {
  const list = List.of(1, 2, 3);
  assert.strictEqual(list.remove(), 0);
  assert.strictEqual(list.remove(9), 0);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('List: replace', () => {
  const list = List.fromArray([1, 2, 3, 2, 1]);
  list.replace(2, 99);
  assert.deepStrictEqual(list.toArray(), [1, 99, 3, 99, 1]);
});

test('List: replace defaults newValue to undefined', () => {
  const list = List.of(1, 2, 1);
  list.replace(1);
  assert.deepStrictEqual(list.toArray(), [undefined, 2, undefined]);
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

test('List: reduce', () => {
  const list = List.fromArray([1, 2, 3, 4]);
  const sum = list.reduce((acc, v) => acc + v, 0);
  assert.strictEqual(sum, 10);
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

test('List: clone', () => {
  const list = List.fromArray([1, 2, 3]);
  const clone = list.clone();
  clone.append(4);
  assert.strictEqual(list.size, 3);
  assert.strictEqual(clone.size, 4);
});

test('List: clone empty returns empty List', () => {
  const clone = new List().clone();
  assert.ok(clone instanceof List);
  assert.strictEqual(clone.size, 0);
  assert.deepStrictEqual(clone.toArray(), []);
});

test('List: Symbol.iterator', () => {
  const list = List.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});
// --- Argument validation ---

test('List: map throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.map(42), TypeError);
  assert.throws(() => list.map('x'), TypeError);
  assert.throws(() => list.map(null), TypeError);
});

test('List: flatMap throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.flatMap(42), TypeError);
  assert.throws(() => list.flatMap(null), TypeError);
});

test('List: filter throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.filter(42), TypeError);
  assert.throws(() => list.filter(null), TypeError);
});

test('List: reduce throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.reduce(42, 0), TypeError);
  assert.throws(() => list.reduce(null, 0), TypeError);
});

test('List: some throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.some(42), TypeError);
  assert.throws(() => list.some(null), TypeError);
});

test('List: every throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.every(42), TypeError);
  assert.throws(() => list.every(null), TypeError);
});

test('List: find throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.find(42), TypeError);
  assert.throws(() => list.find(null), TypeError);
});

test('List: findIndex throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.findIndex(42), TypeError);
  assert.throws(() => list.findIndex(null), TypeError);
});

test('List: groupBy throws TypeError if getKey is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.groupBy(42), TypeError);
  assert.throws(() => list.groupBy(null), TypeError);
});

test('List: sum throws TypeError if fn is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.sum(42), TypeError);
  assert.throws(() => list.sum('x'), TypeError);
  assert.doesNotThrow(() => list.sum());
});

test('List: min throws TypeError if compare is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.min(42), TypeError);
  assert.throws(() => list.min('x'), TypeError);
  assert.doesNotThrow(() => list.min());
});

test('List: max throws TypeError if compare is not a function', () => {
  const list = List.of(1, 2, 3);
  assert.throws(() => list.max(42), TypeError);
  assert.throws(() => list.max('x'), TypeError);
  assert.doesNotThrow(() => list.max());
});

test('List: sort throws TypeError if compare is not a function', () => {
  const list = List.of(3, 1, 2);
  assert.throws(() => list.sort(42), TypeError);
  assert.throws(() => list.sort('x'), TypeError);
  assert.doesNotThrow(() => list.sort());
});

test('List: toSorted throws TypeError if compare is not a function', () => {
  const list = List.of(3, 1, 2);
  assert.throws(() => list.toSorted(42), TypeError);
  assert.throws(() => list.toSorted('x'), TypeError);
  assert.doesNotThrow(() => list.toSorted());
});