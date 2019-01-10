'use strict';

const { BTree } = require('..');
const metatests = require('metatests');

metatests.test('basic set', test => {
  const bTree = new BTree(2);

  test.strictSame(bTree.root, [
    {
      key: undefined,
      data: undefined,
      child: null,
    },
  ]);

  bTree.set(40, { city: 'Abu Dhabi' });

  test.strictSame(bTree.root.length, 2);
  test.strictSame(bTree.root[0].key, 40);
  test.strictSame(bTree.root[0].data, { city: 'Abu Dhabi' });
  test.strictSame(bTree.root[0].child, null);

  bTree.set(30, { city: 'Ankara' });
  bTree.set(50, { city: 'Jerusalem' });
  test.strictSame(bTree.root.length, 4);
  test.strictSame(bTree.root[0].key, 30);
  test.strictSame(bTree.root[0].data, { city: 'Ankara' });
  test.strictSame(bTree.root[1].key, 40);
  test.strictSame(bTree.root[2].key, 50);
  test.strictSame(bTree.root[3].key, undefined); // Special empty element
  test.end();
});

metatests.test('set with spliting root', test => {
  const bTree = new BTree(2);
  bTree
    .set(40, { city: 'Abu Dhabi' })
    .set(100, { city: 'Ankara' })
    .set(20, { city: 'Jerusalem' })
    .set(0, { city: 'Seoul' });
  //        40
  //      /    \
  //  0 20      100
  test.strictSame(bTree.root[0].key, 40);
  test.strictSame(bTree.root[1].key, undefined);
  test.strictSame(bTree.root[0].child[0].key, 0);
  test.strictSame(bTree.root[0].child[0].data, { city: 'Seoul' });
  test.strictSame(bTree.root[0].child[1].key, 20);
  test.strictSame(bTree.root[0].child[2].key, undefined);
  test.strictSame(bTree.root[1].child[0].key, 100);
  test.strictSame(bTree.root[1].child[1].key, undefined);
  test.end();
});

metatests.test('Insert key, which already are in', test => {
  const bTree = new BTree(2);
  bTree
    .set('first', { data: 'first set' })
    .set('second', { data: 'second set' })
    .set('third', { data: 'third set' })
    .set('fouth', { data: 'fouth set' })
    .set('fouth')
    .set('fifth', { data: 'fifth set' })
    .set('first');

  let result = bTree.get('first');
  test.strictSame(result, undefined);

  result = bTree.get('fouth');
  test.strictSame(result, undefined);
  test.end();
});

metatests.test('set with spliting internal node', test => {
  const bTree = new BTree(3);

  bTree
    .set(20, { city: 'Abu Dhabi' })
    .set(50, { city: 'Ankara' })
    .set(100, { city: 'Jerusalem' })
    .set(150, { city: 'Seoul' })
    .set(200, { city: 'Kiev' })
    .set(0, { city: 'Luxembourg' })
    .set(160, { city: 'Minsk' })
    .set(180, { city: 'Oslo' })
    .set(170, { city: 'Stockholm' });
  //          100
  //      /          \
  //  0 20 50      150 160 170 180 200
  bTree.set(190, { city: 'Washington' }); // splitting left node
  //          100          170
  //       /          \           \
  //  0 20 50      150 160      180 190 200

  test.strictSame(bTree.root.length, 3);
  test.strictSame(bTree.root[0].key, 100);
  test.strictSame(bTree.root[1].key, 170);
  test.strictSame(bTree.root[0].child[0].key, 0);
  test.strictSame(bTree.root[0].child[2].key, 50);
  test.strictSame(bTree.root[1].child[1].key, 160);
  test.strictSame(bTree.root[2].child[1].key, 190);
  test.end();
});

metatests.test('get / number keys', test => {
  const bTree = new BTree(3);

  bTree
    .set(20, { city: 'Abu Dhabi' })
    .set(50, { city: 'Ankara' })
    .set(100, { city: 'Jerusalem' })
    .set(150, { city: 'Seoul' })
    .set(200, { city: 'Kiev' })
    .set(0, { city: 'Luxembourg' })
    .set(160, { city: 'Minsk' })
    .set(180, { city: 'Oslo' })
    .set(170, { city: 'Stockholm' });

  test.strictSame(bTree.get(20), { city: 'Abu Dhabi' });
  test.strictSame(bTree.get(50), { city: 'Ankara' });
  test.strictSame(bTree.get(100), { city: 'Jerusalem' });
  test.strictSame(bTree.get(150), { city: 'Seoul' });
  test.strictSame(bTree.get(0), { city: 'Luxembourg' });
  test.strictSame(bTree.get(170), { city: 'Stockholm' });
  test.end();
});

metatests.test('get / string keys', test => {
  const bTree = new BTree(3);

  bTree
    .set('Abu Dhabi', { country: 'UAE' })
    .set('Ankara', { country: 'Turkey' })
    .set('Jerusalem', { country: 'Israel' })
    .set('Seoul', { country: 'South Korea' })
    .set('Kiev', { country: 'Ukraine' })
    .set('Luxembourg', { country: 'Luxembourg' })
    .set('Minsk', { country: 'Belarus' })
    .set('Oslo', { country: 'Norway' })
    .set('Stockholm', { country: 'Sweden' });

  test.strictSame(bTree.get('Abu Dhabi'), { country: 'UAE' });
  test.strictSame(bTree.get('Ankara'), { country: 'Turkey' });
  test.strictSame(bTree.get('Kiev'), { country: 'Ukraine' });
  test.strictSame(bTree.get('Minsk'), { country: 'Belarus' });
  test.strictSame(bTree.get('Oslo'), { country: 'Norway' });
  test.strictSame(bTree.get('Stockholm'), { country: 'Sweden' });
  test.end();
});

metatests.test('iterator / numer key', test => {
  const bTree = new BTree(2);

  bTree
    .set(40, 'G')
    .set(30, 'F')
    .set(72, 'M')
    .set(24, 'E')
    .set(20, 'D')
    .set(18, 'B')
    .set(50, 'I')
    .set(60, 'L')
    .set(90, 'N')
    .set(45, 'H')
    .set(55, 'K')
    .set(52, 'J')
    .set(100, 'O')
    .set(120, 'P')
    .set(130, 'Q')
    .set(140, 'R')
    .set(19, 'C')
    .set(-20, 'A');

  let res = [...bTree.iterator()].join(''); // All nodes
  test.strictSame(res, 'ABCDEFGHIJKLMNOPQR');

  res = [...bTree.iterator(undefined, 10000)].join(''); // All nodes
  test.strictSame(res, 'ABCDEFGHIJKLMNOPQR');

  res = [...bTree.iterator(-10000)].join(''); // All nodes
  test.strictSame(res, 'ABCDEFGHIJKLMNOPQR');

  res = [...bTree.iterator(100, 0)].join(''); // Empty
  test.strictSame(res, '');

  res = [...bTree.iterator(-200, -100)].join(''); // Empty
  test.strictSame(res, '');

  res = [...bTree.iterator(20, 50)].join('');
  test.strictSame(res, 'DEFGH');

  res = [...bTree.iterator(100, 1000)].join('');
  test.strictSame(res, 'OPQR');

  res = [...bTree.iterator(10, 99)].join('');
  test.strictSame(res, 'BCDEFGHIJKLMN');

  res = [...bTree.iterator(10)].join('');
  test.strictSame(res, 'BCDEFGHIJKLMNOPQR');

  res = [...bTree.iterator(126, 128)].join('');
  test.strictSame(res, '');
  test.end();
});

metatests.test('iterator / string keys', test => {
  const bTree = new BTree();

  bTree
    .set('Abu Dhabi', 1)
    .set('Ankara', 2)
    .set('Jerusalem', 3)
    .set('Seoul', 8)
    .set('Kiev', 4)
    .set('Luxembourg', 5)
    .set('Minsk', 6)
    .set('Oslo', 7)
    .set('Stockholm', 9);

  let res = [...bTree.iterator('A', 'C')];
  test.strictSame(res, [1, 2]);

  res = [...bTree.iterator('Abu Dhabi', 'C')];
  test.strictSame(res, [1, 2]);

  res = [...bTree.iterator('D', 'Z')];
  test.strictSame(res, [3, 4, 5, 6, 7, 8, 9]);

  res = [...bTree.iterator()];
  test.strictSame(res, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  res = [...bTree.iterator('Oslo')];
  test.strictSame(res, [7, 8, 9]);
  test.end();
});

metatests.test('remove', test => {
  const bTree = new BTree(2);
  bTree
    .set(40, { city: 'Abu Dhabi' })
    .set(30, { city: 'Ankara' })
    .set(80, { city: 'Jerusalem' })
    .set(20, { city: 'Seoul' })
    .set(100, { city: 'Kiev' })
    .set(110, { city: 'Luxembourg' })
    .set(18, { city: 'Minsk' })
    .set(135, { city: 'Oslo' })
    .set(50, { city: 'Stockholm' })
    .set(25, { city: 'Washington' })
    .set(62, { city: 'Lima' })
    .set(64, { city: 'Beijing' });

  bTree.remove(40);
  let res = bTree.get(40); // Remove root
  test.strictSame(res, undefined);
  test.strictSame(bTree.root[0].key, 50);

  res = bTree.remove(50); // Remove root
  test.strictSame(res.city, 'Stockholm');
  test.strictSame(bTree.root[0].key, 62);

  res = bTree.remove(100);
  test.strictSame(res.city, 'Kiev');
  test.strictSame(bTree.root.length, 4);

  res = bTree.remove(62);
  test.strictSame(res.city, 'Lima');
  test.strictSame(bTree.root.length, 4);

  res = bTree.remove(18);
  test.strictSame(res.city, 'Minsk');

  bTree.remove(80);
  bTree.remove(64);
  bTree.remove(135);

  res = bTree.remove(0); // Try to remove nonexistent node
  test.strictSame(res, undefined);

  bTree.remove(25);
  bTree.remove(30);
  bTree.remove(20);
  bTree.remove(110);
  // Now bTree is empty
  test.strictSame(bTree.root.length, 1);
  test.strictSame(bTree.root[0].key, undefined);
  test.strictSame(bTree.root[0].child, null);
  res = bTree.remove(0); // Try to remove nonexistent node
  test.strictSame(res, undefined);

  bTree
    .set(40, { city: 'Abu Dhabi' })
    .set(50, { city: 'Ankara' })
    .set(60, { city: 'Jerusalem' })
    .set(30, { city: 'Seoul' })
    .set(20, { city: 'Kiev' })
    .set(19, { city: 'Luxembourg' })
    .set(18, { city: 'Minsk' })
    .set(17, { city: 'Oslo' })
    .set(16, { city: 'Stockholm' })
    .set(15, { city: 'Washington' })
    .set(22, { city: 'Lima' })
    .set(23, { city: 'Beijing' });

  res = bTree.remove(30);
  test.strictSame(res, { city: 'Seoul' });

  res = bTree.remove(23);
  test.strictSame(res, { city: 'Beijing' });

  res = bTree.remove(22);
  test.strictSame(res, { city: 'Lima' });

  res = bTree.remove(100);
  test.strictSame(res, undefined);
  test.end();
});
