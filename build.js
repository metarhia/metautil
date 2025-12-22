'use strict';

const fs = require('node:fs');
const path = require('node:path');

const fileOrder = [
  'error.js',
  'strings.js',
  'array.js',
  'async.js',
  'datetime.js',
  'objects.js',
  'collector.js',
  'events.js',
  'http.js',
  'pool.js',
  'semaphore.js',
  'units.js',
  'browser.js',
];

const libDir = path.join(__dirname, 'lib');
const outputFile = path.join(__dirname, 'metautil.mjs');

const processFile = (filename) => {
  const filePath = path.join(libDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(`'use strict';\n\n`, '');

  content = content.replace(
    /const\s*\{\s*Error\s*\}\s*=\s*require\(['"]\.\/error\.js['"]\);\s*\n?/,
    '',
  );

  content = content.replace(
    /const\s+strings\s*=\s*require\(['"]\.\/strings\.js['"]\);\s*\n?/,
    '',
  );

  content = content.replaceAll(/\bstrings\.(\w+)/g, '$1');

  const stringsRequirePattern = new RegExp(
    'const\\s+strings\\s*=\\s*require\\([\'"]\\./strings\\.js[\'"]\\);\\s*\\n' +
      '(?:[^\\n]*\\n)*?const\\s*\\{\\s*([^}]+)\\s*\\}\\s*=\\s*strings;\\s*\\n',
  );
  content = content.replace(stringsRequirePattern, '');

  content = content.replace(
    /const\s*\{\s*([^}]+)\s*\}\s*=\s*strings;\s*\n/,
    '',
  );

  content = content.replace(
    /module\.exports\s*=\s*\{([^}]+)\};?\s*$/m,
    (match, exports) => {
      const exportNames = [];
      const lines = exports
        .split(',')
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, value] = line.split(':').map((s) => s.trim());
          exportNames.push(`${value} as ${key}`);
        } else {
          exportNames.push(line);
        }
      }
      if (exportNames.length === 1) {
        return `export { ${exportNames[0]} };`;
      }
      const exportsList = exportNames.map((name) => `  ${name}`).join(',\n');
      return `export {\n${exportsList},\n};`;
    },
  );

  content = content.replace(
    /module\.exports\s*=\s*(\w+);?\s*$/m,
    'export { $1 };',
  );

  return content;
};

const build = () => {
  const bundle = [];
  for (const filename of fileOrder) {
    const content = processFile(filename);
    bundle.push(`// ${filename}\n`);
    bundle.push(content + '\n');
  }
  fs.writeFileSync(outputFile, bundle.join('\n'), 'utf8');
  console.log(`Bundle created: ${outputFile}`);
};

build();
