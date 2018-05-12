'use strict';

api.metatests.test('generateStorageKey', (test) => {
  const key = api.common.generateStorageKey();
  test.strictSame(Array.isArray(key), true);
  test.strictSame(key.length, 3);
  const [dir1, dir2, file] = key;
  test.strictSame(dir1.length, 2);
  test.strictSame(dir2.length, 2);
  test.strictSame(file.length, 8);
  test.strictSame(key.join('/').length, 14);
  test.end();
});
