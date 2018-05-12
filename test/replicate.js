'use strict';

api.metatests.test('replicate', (test) => {
  const expected = [true, true, true, true, true];
  const result = api.common.replicate(5, true);
  test.strictSame(result, expected);
  test.end();
});
