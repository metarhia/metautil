'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert');
const metatests = require('metatests');
const metautil = require('..');
const { exists, directoryExists, fileExists, ensureDirectory } = metautil;

test('Fs: exists', async () => {
  const exists1 = await exists('./test');
  assert.strictEqual(exists1, true);
  const exists2 = await exists('./abrvalg');
  assert.strictEqual(exists2, false);
  const exists3 = await exists('./README.md');
  assert.strictEqual(exists3, true);
});

test('Fs: directoryExists', async () => {
  const exists1 = await directoryExists('./test');
  assert.strictEqual(exists1, true);
  const exists2 = await directoryExists('./abrvalg');
  assert.strictEqual(exists2, false);
  const exists3 = await directoryExists('./README.md');
  assert.strictEqual(exists3, false);
});

test('Fs: fileExists', async () => {
  const exists1 = await fileExists('./test');
  assert.strictEqual(exists1, false);
  const exists2 = await fileExists('./abrvalg');
  assert.strictEqual(exists2, false);
  const exists3 = await fileExists('./README.md');
  assert.strictEqual(exists3, true);
});

test('Fs: ensureDirectory', async () => {
  const created1 = await ensureDirectory('./abc');
  assert.strictEqual(created1, true);
  const created2 = await ensureDirectory('./abc');
  assert.strictEqual(created2, true);
  await fsp.rmdir('./abc');
  const created3 = await ensureDirectory('./LICENSE');
  assert.strictEqual(created3, false);
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
