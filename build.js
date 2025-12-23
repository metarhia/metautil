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
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonContent);
const licenseText = fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf8');
const licenseLines = licenseText.split('\n');
const licenseName = licenseLines[0];
const copyrightLine = licenseLines[2];

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
  const header =
    `// ${copyrightLine}\n` +
    `// Version ${packageJson.version} metautil ${licenseName}\n\n`;
  const bundle = [];
  for (const filename of fileOrder) {
    const content = processFile(filename);
    bundle.push(`// ${filename}\n`);
    bundle.push(content + '\n');
  }
  const content = header + bundle.join('\n');
  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`Bundle created: ${outputFile}`);
};

build();
