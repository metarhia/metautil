'use strict';

/*eslint max-len: ["error", { "code": 120 }]*/

const CONFIG_FILES_PRIORITY = [
  'sandbox.js',
  'log.js',
  'scale.js',
  'servers.js',
  'databases.js',
  'sessions.js',
  'tasks.js',
  'application.js',
  'files.js',
  'filestorage.js',
  'mail.js',
  'hosts.js',
  'routes.js'
];

api.metatests.case('Common / sort', {
  'common.sortComparePriority': [
    [CONFIG_FILES_PRIORITY, 'files.js', 'sandbox.js',       1],
    [CONFIG_FILES_PRIORITY, 'filestorage.js', 'routes.js', -1],
    [CONFIG_FILES_PRIORITY, 'unknown.js', 'sandbox.js',     1],
    [CONFIG_FILES_PRIORITY, 'log.js', 'sandbox.js',         1],
    [CONFIG_FILES_PRIORITY, 'sandbox.js', 'sandbox.js',     0],
    [CONFIG_FILES_PRIORITY, 'log.js', 'log.js',             0],
    [CONFIG_FILES_PRIORITY, 'tasks.js', 'application.js',  -1],
  ],
  'common.sortCompareDirectories': [
    [{ name: '/abc' },     { name: 'abc.ext' },  -1],
    [{ name: 'ABC.ext' },  { name: '/abc' },      1],
    [{ name: 'abc' },      { name: 'ABC.ext' },   1],
    [{ name: '/ABC' },     { name: '/abc.ext' }, -1],
    [{ name: '/abc.ext' }, { name: '/ABC' },      1],
    [{ name: '/abc.ext' }, { name: '/ABC' },      1],
    [{ name: '/ABC' },     { name: '/ABC' },      0],
    [{ name: 'abc.ext' },  { name: 'abc.ext' },   0],
    [{ name: 'abc.ext' },  { name: 'def.ext' },  -1],
    [{ name: 'def.ext' },  { name: 'abc.ext' },   1],
  ],
  'common.sortCompareByName': [
    [{ name: 'abc' }, { name: 'def' },  -1],
    [{ name: 'def' }, { name: 'abc' },   1],
    [{ name: 'abc' }, { name: 'abc' },   0],
    [{ name: 'def' }, { name: 'def' },   0],
    [{ name: 'abc' }, { name: 'a' },     1],
    [{ name: 'a' },   { name: 'abc' },  -1],
    [{ name: '123' }, { name: 'name' }, -1],
  ],
});

api.metatests.test('sortCompareDirectories', (test) => {
  const array = [
    { name: 'file0.txt' },
    { name: '/dir' },
    { name: 'file1.txt' },
    { name: 'file0.txt' },
    { name: '/foo' }
  ];
  const sorted = [
    { name: '/dir' },
    { name: '/foo' },
    { name: 'file0.txt' },
    { name: 'file0.txt' },
    { name: 'file1.txt' },
  ];
  test.strictSame(array.sort(api.common.sortCompareDirectories), sorted);
  test.end();
});

api.metatests.test('sortCompareByName', (test) => {
  const array = [{ name: 'c' }, { name: 'a' }, { name: 'a' }, { name: 'b' }];
  const sorted = [{ name: 'a' }, { name: 'a' }, { name: 'b' }, { name: 'c' }];
  test.strictSame(array.sort(api.common.sortCompareByName), sorted);
  test.end();
});
