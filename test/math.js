'use strict';

api.metatests.test('random', (test) => {
  const min = 10;
  const max = 20;
  const num = api.common.random(min, max);
  test.assert(num >= min);
  test.assert(num <= max);
  test.end();
});

api.metatests.test('random max only', (test) => {
  const max = 20;
  const num = api.common.random(max);
  test.assert(num >= 0);
  test.assert(num <= max);
  test.end();
});

api.metatests.test('cryptoRandom', (test) => {
  const num = api.common.cryptoRandom();
  test.assert(num >= 0);
  test.assert(num < 1);
  test.end();
});
