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

metatests.test('MemoryWritable rejects invalid encoding', async test => {
  const memoryStream = new common.MemoryWritable();
  memoryStream.end('hello');
  await test.rejects(memoryStream.getData('invalid encoding'));
});

metatests.test('MemoryWritable handles custom sizeLimit', async test => {
  const totalSize = 60;
  const limitSize = 40;
  const memoryStream = new common.MemoryWritable(limitSize);
  test.rejects(() => {
    const result = memoryStream.getData();
    memoryStream.write(Buffer.alloc(totalSize));
    return result;
  }, new RangeError(`size limit exceeded by ${totalSize - limitSize} bytes`));
});
