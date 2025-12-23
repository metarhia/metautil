'use strict';

const fs = require('node:fs');
const path = require('node:path');

const buildConfigPath = path.join(__dirname, 'build.json');
const buildConfigContent = fs.readFileSync(buildConfigPath, 'utf8');
const buildConfig = JSON.parse(buildConfigContent);
const fileOrder = buildConfig.order;

const libDir = path.join(__dirname, 'lib');
const outputFile = path.join(__dirname, 'metautil.mjs');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonContent);
const licenseText = fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf8');
const licenseLines = licenseText.split('\n');
const licenseName = licenseLines[0];
const copyrightLine = licenseLines[2];

const moduleExportsPattern = /module\.exports\s*=\s*(\{([^}]+)\}|(\w+));?\s*$/m;

const convertModuleExports = (match, fullMatch, exports, identifier) => {
  if (identifier) return `export { ${identifier} };`;
  const exportNames = exports
    .split(',')
    .map((line) => line.trim())
    .filter((line) => line !== '');
  if (exportNames.length === 1) return `export { ${exportNames[0]} };`;
  const exportsList = exportNames.map((name) => `  ${name}`).join(',\n');
  return `export {\n${exportsList},\n};`;
};

const processFile = (filename) => {
  const filePath = path.join(libDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(`'use strict';\n\n`, '');
  const lines = content.split('\n');
  const filteredLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('require(')) continue;
    filteredLines.push(line);
  }
  content = filteredLines.join('\n');
  content = content.replace(moduleExportsPattern, convertModuleExports);
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
  const content = header + bundle.join('\n').replaceAll('\n\n\n', '\n\n');
  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`Bundle created: ${outputFile}`);
};

build();
