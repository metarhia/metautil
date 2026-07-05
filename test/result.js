'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Result } = metautil;

test('Result: ok', () => {
  const result = Result.ok(42);
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.value, 42);
  assert.strictEqual(result.error, null);
  assert.strictEqual(result.unwrap(), 42);
  assert.strictEqual(result.unwrap(0), 42);
});

test('Result: ok default value', () => {
  const result = Result.ok();
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.value, null);
});

test('Result: fail', () => {
  const error = new Error('Something went wrong');
  const result = Result.fail(error);
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.value, null);
  assert.strictEqual(result.error, error);
  assert.throws(() => result.unwrap(), /Something went wrong/);
  assert.strictEqual(result.unwrap(0), 0);
});

test('Result: unwrap with falsy default', () => {
  const result = Result.fail(new Error('Boom'));
  assert.strictEqual(result.unwrap(null), null);
  assert.strictEqual(result.unwrap(''), '');
});

test('Result: fail stores non-Error values as-is', () => {
  const result = Result.fail('Bad input');
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.error, 'Bad input');
});

test('Result: from success', () => {
  const result = Result.from(() => JSON.parse('{"a":1}'));
  assert.strictEqual(result.ok, true);
  assert.deepStrictEqual(result.value, { a: 1 });
});

test('Result: from catches throw', () => {
  const result = Result.from(() => JSON.parse('not json'));
  assert.strictEqual(result.ok, false);
  assert(result.error instanceof Error);
});

test('Result: fromAsync success', async () => {
  const result = await Result.fromAsync(async () => 'data');
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.value, 'data');
});

test('Result: fromAsync catches rejection', async () => {
  const error = new Error('Network error');
  const result = await Result.fromAsync(async () => {
    throw error;
  });
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.error, error);
});

test('Result: map', () => {
  const doubled = Result.ok(21).map((value) => value * 2);
  assert.strictEqual(doubled.ok, true);
  assert.strictEqual(doubled.value, 42);

  const error = new Error('Failed');
  const failed = Result.fail(error).map((value) => value * 2);
  assert.strictEqual(failed.ok, false);
  assert.strictEqual(failed.error, error);
});

test('Result: map catches thrown errors', () => {
  const result = Result.ok(0).map((value) => {
    if (value === 0) throw new Error('Division by zero');
    return 1 / value;
  });
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.error.message, 'Division by zero');
});
