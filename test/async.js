'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { toBool, timeout, delay, timeoutify } = require('..');

test('Async: toBool', async () => {
  const success = await Promise.resolve('success').then(...toBool);
  assert.strictEqual(success, true);
  const rejected = await Promise.reject(new Error('Ups')).then(...toBool);
  assert.strictEqual(rejected, false);
});

test('Async: Abortable timeout', async () => {
  try {
    await timeout(10);
    assert.ifError(new Error('Should not be executed'));
  } catch (err) {
    assert.strictEqual(err.code, 'ETIMEOUT');
    assert.strictEqual(err.message, 'Timeout of 10ms reached');
  }
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await timeout(100, ac.signal);
    assert.ifError(new Error('Should not be executed'));
  } catch (err) {
    assert.strictEqual(err.message, 'Timeout aborted');
  }
});

test('Async: Abortable delay', async () => {
  try {
    const res = await delay(10);
    assert.strictEqual(res, undefined);
  } catch {
    assert.ifError(new Error('Should not be executed'));
  }
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await delay(100, ac.signal);
    assert.ifError(new Error('Should not be executed'));
  } catch (err) {
    assert.strictEqual(err.message, 'Delay aborted');
  }
});

test('Async: timeoutify', async () => {
  try {
    const request = delay(1000);
    await timeoutify(request, 10);
    assert.ifError(new Error('Should not be executed'));
  } catch (err) {
    assert.strictEqual(err.code, 'ETIMEOUT');
    assert.strictEqual(err.message, 'Timeout of 10ms reached');
  }
  try {
    const request = delay(10);
    const response = await timeoutify(request, 1000);
    assert.strictEqual(response, undefined);
  } catch {
    assert.ifError(new Error('Should not be executed'));
  }
});
