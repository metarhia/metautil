'use strict';

const tap = require('tap');
const common = require('..');

tap.test('section normal', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.section(s, 'is');
  test.strictSame(result[0], 'All you need ');
  test.strictSame(result[1], ' JavaScript');
  test.end();
});

tap.test('section not found', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.section(s, 'not-found');
  test.strictSame(result[0], 'All you need is JavaScript');
  test.strictSame(result[1], '');
  test.end();
});

tap.test('section ends with', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.section(s, 'JavaScript');
  test.strictSame(result[0], 'All you need is ');
  test.strictSame(result[1], '');
  test.end();
});

tap.test('section strarts with', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.section(s, 'All');
  test.strictSame(result[0], '');
  test.strictSame(result[1], ' you need is JavaScript');
  test.end();
});

tap.test('section multiple', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.section(s, 'a');
  test.strictSame(result[0], 'All you need is J');
  test.strictSame(result[1], 'vaScript');
  test.end();
});

tap.test('rsection normal', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.rsection(s, 'is');
  test.strictSame(result[0], 'All you need ');
  test.strictSame(result[1], ' JavaScript');
  test.end();
});

tap.test('rsection not found', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.rsection(s, 'not-found');
  test.strictSame(result[0], 'All you need is JavaScript');
  test.strictSame(result[1], '');
  test.end();
});

tap.test('rsection ends with', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.rsection(s, 'JavaScript');
  test.strictSame(result[0], 'All you need is ');
  test.strictSame(result[1], '');
  test.end();
});

tap.test('rsection strarts with', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.rsection(s, 'All');
  test.strictSame(result[0], '');
  test.strictSame(result[1], ' you need is JavaScript');
  test.end();
});

tap.test('rsection multiple', (test) => {
  const s = 'All you need is JavaScript';
  const result = common.rsection(s, 'a');
  test.strictSame(result[0], 'All you need is Jav');
  test.strictSame(result[1], 'Script');
  test.end();
});
