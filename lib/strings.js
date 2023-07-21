'use strict';

const path = require('node:path');

const replace = (str, substr, newstr) => {
  if (substr === '') return str;
  let src = str;
  let res = '';
  do {
    const index = src.indexOf(substr);
    if (index === -1) return res + src;
    const start = src.substring(0, index);
    src = src.substring(index + substr.length, src.length);
    res += start + newstr;
  } while (true);
};

const between = (s, prefix, suffix) => {
  let i = s.indexOf(prefix);
  if (i === -1) return '';
  s = s.substring(i + prefix.length);
  if (suffix) {
    i = s.indexOf(suffix);
    if (i === -1) return '';
    s = s.substring(0, i);
  }
  return s;
};

const split = (s, separator) => {
  const i = s.indexOf(separator);
  if (i < 0) return [s, ''];
  return [s.slice(0, i), s.slice(i + separator.length)];
};

const inRange = (x, min, max) => x >= min && x <= max;

const isFirstUpper = (s) => !!s && inRange(s[0], 'A', 'Z');

const isFirstLower = (s) => !!s && inRange(s[0], 'a', 'z');

const isFirstLetter = (s) => isFirstUpper(s) || isFirstLower(s);

const toLowerCamel = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const toUpperCamel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const toLower = (s) => s.toLowerCase();

const toCamel = (separator) => (s) => {
  const words = s.split(separator);
  const first = words.length > 0 ? words.shift().toLowerCase() : '';
  return first + words.map(toLower).map(toUpperCamel).join('');
};

const spinalToCamel = toCamel('-');

const snakeToCamel = toCamel('_');

const isConstant = (s) => s === s.toUpperCase();

const fileExt = (fileName) => {
  const dot = fileName.lastIndexOf('.');
  const slash = fileName.lastIndexOf('/');
  if (slash > dot) return '';
  return fileName.substring(dot + 1, fileName.length).toLowerCase();
};

const parsePath = (relPath) => {
  const name = path.basename(relPath, '.js');
  const names = relPath.split(path.sep);
  names[names.length - 1] = name;
  return names;
};

const trimLines = (s) => {
  const chunks = s.split('\n').map((d) => d.trim());
  return chunks.filter((d) => d !== '').join('\n');
};

module.exports = {
  replace,
  between,
  split,
  isFirstUpper,
  isFirstLower,
  isFirstLetter,
  toLowerCamel,
  toUpperCamel,
  toLower,
  toCamel,
  spinalToCamel,
  snakeToCamel,
  isConstant,
  fileExt,
  parsePath,
  trimLines,
};
