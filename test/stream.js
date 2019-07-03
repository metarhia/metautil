'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const metatests = require('metatests');
const common = require('..');

const fixturesPaths = ['empty', 'greetings'].map(f =>
  path.join(__dirname, 'fixtures', f)
);
const readFile = util.promisify(fs.readFile);

metatests.test(
  'MemoryWritable correctly works with no encoding specified',
  async test => {
    for (const path of fixturesPaths) {
      const originalReadable = fs.createReadStream(path);
      const memoryStream = new common.MemoryWritable();
      originalReadable.pipe(memoryStream);
      test.strictSame(await readFile(path), await memoryStream.getData());
    }
  }
);

metatests.test(
  'MemoryWritable correctly works the specified encoding',
  async test => {
    for (const path of fixturesPaths) {
      const originalReadable = fs.createReadStream(path);
      const memoryStream = new common.MemoryWritable();
      originalReadable.pipe(memoryStream);
      test.strictSame(
        await readFile(path, { encoding: 'utf8' }),
        await memoryStream.getData('utf8')
      );
    }
  }
);

metatests.test('MemoryWritable handles custom sizeLimit', async test => {
  for (const path of fixturesPaths) {
    const originalReadable = fs.createReadStream(path);
    const memoryStream = new common.MemoryWritable(40);
    originalReadable.pipe(memoryStream);
    const result = memoryStream.getData();
    if (path.includes('empty')) {
      await test.resolves(result, await readFile(path));
    } else {
      await test.rejects(
        result,
        new RangeError('size limit exceeded by 20 bytes')
      );
    }
  }
});
