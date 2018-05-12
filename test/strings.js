'use strict';

api.metatests.test('section normal', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.section(s, 'is');
  test.strictSame(result[0], 'All you need ');
  test.strictSame(result[1], ' JavaScript');
  test.end();
});

api.metatests.test('section not found', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.section(s, 'not-found');
  test.strictSame(result[0], 'All you need is JavaScript');
  test.strictSame(result[1], '');
  test.end();
});

api.metatests.test('section ends with', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.section(s, 'JavaScript');
  test.strictSame(result[0], 'All you need is ');
  test.strictSame(result[1], '');
  test.end();
});

api.metatests.test('section strarts with', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.section(s, 'All');
  test.strictSame(result[0], '');
  test.strictSame(result[1], ' you need is JavaScript');
  test.end();
});

api.metatests.test('section multiple', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.section(s, 'a');
  test.strictSame(result[0], 'All you need is J');
  test.strictSame(result[1], 'vaScript');
  test.end();
});

api.metatests.test('rsection normal', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.rsection(s, 'is');
  test.strictSame(result[0], 'All you need ');
  test.strictSame(result[1], ' JavaScript');
  test.end();
});

api.metatests.test('rsection not found', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.rsection(s, 'not-found');
  test.strictSame(result[0], 'All you need is JavaScript');
  test.strictSame(result[1], '');
  test.end();
});

api.metatests.test('rsection ends with', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.rsection(s, 'JavaScript');
  test.strictSame(result[0], 'All you need is ');
  test.strictSame(result[1], '');
  test.end();
});

api.metatests.test('rsection strarts with', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.rsection(s, 'All');
  test.strictSame(result[0], '');
  test.strictSame(result[1], ' you need is JavaScript');
  test.end();
});

api.metatests.test('rsection multiple', (test) => {
  const s = 'All you need is JavaScript';
  const result = api.common.rsection(s, 'a');
  test.strictSame(result[0], 'All you need is Jav');
  test.strictSame(result[1], 'Script');
  test.end();
});

api.metatests.test('split', (test) => {
  const s = 'a,b,c,d';
  const result = api.common.split(s, ',', 2);
  test.strictSame(result, ['a', 'b']);
  test.end();
});

api.metatests.test('split all', (test) => {
  const s = 'a,b,c,d';
  const result = api.common.split(s);
  test.strictSame(result, ['a', 'b', 'c', 'd']);
  test.end();
});

api.metatests.test('rsplit', (test) => {
  const s = 'a,b,c,d';
  const result = api.common.rsplit(s, ',', 2);
  test.strictSame(result, ['c', 'd']);
  test.end();
});

api.metatests.test('rsplit all', (test) => {
  const s = 'a,b,c,d';
  const result = api.common.rsplit(s);
  test.strictSame(result, ['a', 'b', 'c', 'd']);
  test.end();
});
