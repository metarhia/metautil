'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const metatests = require('metatests');
const metautil = require('..');
const { directoryExists, ensureDirectory } = metautil;

metatests.test('Fs: directoryExists', async (test) => {
  const exists1 = await directoryExists('./test');
  test.strictSame(exists1, true);
  const exists2 = await directoryExists('./abrvalg');
  test.strictSame(exists2, false);
  test.end();
});

metatests.test('Fs: ensureDirectory', async (test) => {
  const created1 = await ensureDirectory('./abc');
  test.strictSame(created1, true);
  const created2 = await ensureDirectory('./abc');
  test.strictSame(created2, true);
  await fsp.rmdir('./abc');
  const created3 = await ensureDirectory('./LICENSE');
  test.strictSame(created3, false);
  test.end();
});

metatests.case(
  'Path functions',
  { metautil },
  {
    'metautil.parsePath': [
      ['', ['']],
      ['file', ['file']],
      ['file.js', ['file']],
      [`example${path.sep}stop`, ['example', 'stop']],
      [`example${path.sep}stop.js`, ['example', 'stop']],
      [`example${path.sep}sub2${path.sep}do.js`, ['example', 'sub2', 'do']],
    ],
  },
);
