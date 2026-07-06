'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { LinkedList } = require('../lib/linked-list.js');

test('LinkedList: append and iterate', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.append(3);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('LinkedList: prepend and iterate', () => {
  const list = new LinkedList();
  list.prepend(3);
  list.prepend(2);
  list.prepend(1);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('LinkedList: appendAll on empty list', () => {
  const list = new LinkedList();
  list.appendAll([1, 2, 3]);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
  assert.strictEqual(list.head.value, 1);
  assert.strictEqual(list.tail.value, 3);
});

test('LinkedList: appendAll on non-empty list', () => {
  const list = new LinkedList();
  list.append(1);
  list.appendAll([2, 3]);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
  assert.strictEqual(list.tail.value, 3);
  assert.strictEqual(list.tail.prev.value, 2);
});

test('LinkedList: appendAll with empty array is a no-op', () => {
  const list = new LinkedList();
  list.append(1);
  list.appendAll([]);
  assert.strictEqual(list.size, 1);
  assert.deepStrictEqual([...list], [1]);
});

test('LinkedList: static fromArray builds a linked chain', () => {
  const list = LinkedList.fromArray([1, 2, 3]);
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
  assert.strictEqual(list.head.next.value, 2);
  assert.strictEqual(list.tail.prev.value, 2);
});

test('LinkedList: static fromIterable builds from any iterable', () => {
  const list = LinkedList.fromIterable(new Set([1, 2, 3]));
  assert.strictEqual(list.size, 3);
  assert.deepStrictEqual([...list], [1, 2, 3]);
});

test('LinkedList: delete(0) removes first', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.append(3);
  assert.strictEqual(list.delete(0), 1);
  assert.strictEqual(list.delete(0), 2);
  assert.strictEqual(list.size, 1);
  assert.deepStrictEqual([...list], [3]);
});

test('LinkedList: delete(size - 1) removes last', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.append(3);
  assert.strictEqual(list.delete(list.size - 1), 3);
  assert.strictEqual(list.delete(list.size - 1), 2);
  assert.strictEqual(list.size, 1);
  assert.deepStrictEqual([...list], [1]);
});

test('LinkedList: delete on empty returns null', () => {
  const list = new LinkedList();
  assert.strictEqual(list.delete(0), null);
  assert.strictEqual(list.delete(list.size - 1), null);
});

test('LinkedList: single element append and delete(0)', () => {
  const list = new LinkedList();
  list.append(42);
  assert.strictEqual(list.head, list.tail);
  assert.strictEqual(list.delete(0), 42);
  assert.strictEqual(list.head, null);
  assert.strictEqual(list.tail, null);
  assert.strictEqual(list.size, 0);
});

test('LinkedList: at', () => {
  const list = new LinkedList();
  list.append(10);
  list.append(20);
  list.append(30);
  assert.strictEqual(list.at(0).value, 10);
  assert.strictEqual(list.at(1).value, 20);
  assert.strictEqual(list.at(2).value, 30);
  assert.strictEqual(list.at(-1), null);
  assert.strictEqual(list.at(3), null);
});

test('LinkedList: insert at index', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(3);
  list.insert(1, 2);
  assert.deepStrictEqual([...list], [1, 2, 3]);
  assert.strictEqual(list.size, 3);
});

test('LinkedList: insert with count', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.insert(1, 9, 3);
  assert.deepStrictEqual([...list], [1, 9, 9, 9, 2]);
  assert.strictEqual(list.size, 5);
});

test('LinkedList: insert past end appends to back', () => {
  const list = new LinkedList();
  list.append(1);
  list.insert(5, 2);
  assert.deepStrictEqual([...list], [1, 2]);
  assert.strictEqual(list.size, 2);
});

test('LinkedList: insert at exact end index appends to back', () => {
  const list = new LinkedList();
  list.append(1);
  list.insert(1, 2);
  assert.deepStrictEqual([...list], [1, 2]);
  assert.strictEqual(list.size, 2);
});

test('LinkedList: insert at index 0 prepends', () => {
  const list = new LinkedList();
  list.append(2);
  list.insert(0, 1);
  assert.deepStrictEqual([...list], [1, 2]);
  assert.strictEqual(list.size, 2);
});

test('LinkedList: delete at index', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.append(3);
  list.delete(1);
  assert.deepStrictEqual([...list], [1, 3]);
  assert.strictEqual(list.size, 2);
});

test('LinkedList: delete with count', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.append(3);
  list.append(4);
  list.delete(1, 2);
  assert.deepStrictEqual([...list], [1, 4]);
  assert.strictEqual(list.size, 2);
});

test('LinkedList: delete past end does nothing', () => {
  const list = new LinkedList();
  list.append(1);
  list.delete(5);
  assert.deepStrictEqual([...list], [1]);
  assert.strictEqual(list.size, 1);
});

test('LinkedList: remove middle', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.append(3);
  const node = list.at(1);
  const value = list.remove(node);
  assert.strictEqual(value, 2);
  assert.deepStrictEqual([...list], [1, 3]);
  assert.strictEqual(list.size, 2);
});

test('LinkedList: remove head', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.remove(list.head);
  assert.deepStrictEqual([...list], [2]);
  assert.strictEqual(list.head.value, 2);
});

test('LinkedList: remove tail', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.remove(list.tail);
  assert.deepStrictEqual([...list], [1]);
  assert.strictEqual(list.tail.value, 1);
});

test('LinkedList: clear', () => {
  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.clear();
  assert.strictEqual(list.size, 0);
  assert.strictEqual(list.head, null);
  assert.strictEqual(list.tail, null);
  assert.deepStrictEqual([...list], []);
});
