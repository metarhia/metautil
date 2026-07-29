'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Trie } = metautil;

test('Trie: insert, has, get', () => {
  const trie = new Trie();
  trie.insert('cat');
  trie.insert('car', 42);
  assert.strictEqual(trie.has('cat'), true);
  assert.strictEqual(trie.has('car'), true);
  assert.strictEqual(trie.has('ca'), false);
  assert.strictEqual(trie.has('dog'), false);
  assert.strictEqual(trie.get('cat'), true);
  assert.strictEqual(trie.get('car'), 42);
  assert.strictEqual(trie.get('dog'), undefined);
});

test('Trie: stores undefined value', () => {
  const trie = new Trie();
  trie.insert('key', undefined);
  assert.strictEqual(trie.has('key'), true);
  assert.strictEqual(trie.get('key'), undefined);
  assert.strictEqual(trie.size, 1);
});

test('Trie: insert rejects non-string', () => {
  const trie = new Trie();
  assert.throws(() => trie.insert(1), TypeError);
  assert.throws(() => trie.insert(null), TypeError);
  assert.strictEqual(trie.size, 0);
});

test('Trie: has and get reject non-string', () => {
  const trie = new Trie();
  trie.insert('a');
  assert.strictEqual(trie.has(1), false);
  assert.strictEqual(trie.get(1), undefined);
});

test('Trie: size and isEmpty', () => {
  const trie = new Trie();
  assert.strictEqual(trie.size, 0);
  assert.strictEqual(trie.isEmpty(), true);
  trie.insert('a');
  trie.insert('b');
  assert.strictEqual(trie.size, 2);
  assert.strictEqual(trie.isEmpty(), false);
  trie.insert('a', false);
  assert.strictEqual(trie.size, 2);
});

test('Trie: delete and prune', () => {
  const trie = new Trie();
  trie.insert('cat');
  trie.insert('car');
  trie.insert('card');
  assert.strictEqual(trie.delete('car'), true);
  assert.strictEqual(trie.has('car'), false);
  assert.strictEqual(trie.has('card'), true);
  assert.strictEqual(trie.has('cat'), true);
  assert.strictEqual(trie.size, 2);
  assert.strictEqual(trie.delete('missing'), false);
  assert.strictEqual(trie.delete(1), false);
});

test('Trie: delete empty string and clear', () => {
  const trie = new Trie();
  trie.insert('');
  trie.insert('a');
  assert.strictEqual(trie.delete(''), true);
  assert.strictEqual(trie.has(''), false);
  assert.strictEqual(trie.has('a'), true);
  trie.clear();
  assert.strictEqual(trie.size, 0);
  assert.strictEqual(trie.isEmpty(), true);
  assert.strictEqual(trie.has('a'), false);
});

test('Trie: complete', () => {
  const trie = new Trie();
  trie.insert('cat');
  trie.insert('car');
  trie.insert('card');
  trie.insert('dog');
  assert.deepStrictEqual(trie.complete('ca').sort(), ['car', 'card', 'cat']);
  assert.deepStrictEqual(trie.complete('card'), ['card']);
  assert.deepStrictEqual(trie.complete('z'), []);
  assert.deepStrictEqual(trie.complete(1), []);
});

test('Trie: insert chains', () => {
  const trie = new Trie();
  assert.strictEqual(trie.insert('a').insert('b'), trie);
  assert.strictEqual(trie.size, 2);
});
