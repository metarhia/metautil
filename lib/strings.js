'use strict';

const path = require('path');

const { getByPath } = require('./data');
const { nowDateTime } = require('./time');

const HTML_ESCAPE_REGEXP = new RegExp('[&<>"\'/]', 'g');

const HTML_ESCAPE_CHARS = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'
};

const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

const htmlEscape = (
  // Escape html characters
  content // string, to escape
  // Returns: string
  // Example: htmlEscape('5>=5') = '5&lt;=5'
) => (
  content.replace(HTML_ESCAPE_REGEXP, char => HTML_ESCAPE_CHARS[char])
);

const SUBST_REGEXP = /@([-.0-9a-zA-Z]+)@/g;

const subst = (
  // Substitute variables
  tpl, // string, template body
  data, // hash, data structure to visualize
  dataPath, // string, current position in data structure
  escapeHtml // boolean, escape html special characters if true
  // Returns: string
) => (
  tpl.replace(SUBST_REGEXP, (s, key) => {
    const pos = key.indexOf('.');
    const name = pos === 0 ? dataPath + key : key;
    let value = getByPath(data, name);
    if (value === undefined) {
      if (key === '.value') {
        value = getByPath(data, dataPath);
      } else {
        value = '[undefined]';
      }
    }
    if (value === null) {
      value = '[null]';
    } else if (value === undefined) {
      value = '[undefined]';
    } else if (typeof(value) === 'object') {
      if (value.constructor.name === 'Date') {
        value = nowDateTime(value);
      } else if (value.constructor.name === 'Array') {
        value = '[array]';
      } else {
        value = '[object]';
      }
    }
    if (escapeHtml) value = htmlEscape(value);
    return value;
  })
);

const fileExt = (
  // Extract file extension in lower case with no dot
  fileName // string, file name
  // Returns: string
  // Example: fileExt('/dir/file.txt')
  // Result: 'txt'
) => (
  path.extname(fileName).replace('.', '').toLowerCase()
);

const removeExt = (
  // Remove file extension from file name
  fileName // string, file name
  // Returns: string
  // Example: fileExt('file.txt')
  // Result: 'file'
) => (
  fileName.substr(0, fileName.lastIndexOf('.'))
);

const CAPITALIZE_REGEXP = /\w+/g;

const capitalize = (
  // Capitalize string
  s // string
) => (
  s.replace(CAPITALIZE_REGEXP, (word) => (
    word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  ))
);

const UNDERLINE_REGEXP = /_/g;

const spinalToCamel = (
  // Convert spinal case to camel case
  name // string
  // Returns: string
) => (
  name
    .replace(UNDERLINE_REGEXP, '-')
    .split('-')
    .map((part, i) => (i > 0 ? capitalize(part) : part))
    .join('')
);

const ESCAPE_REGEXP_SPECIALS = [
  // order matters for these
  '-', '[', ']',
  // order doesn't matter for any of these
  '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'
];

const ESCAPE_REGEXP = new RegExp(
  '[' + ESCAPE_REGEXP_SPECIALS.join('\\') + ']', 'g'
);

const escapeRegExp = (
  // Escape regular expression control characters
  s // string
  // Returns: string
  // Example: escapeRegExp('/path/to/res?search=this.that')
) => (
  s.replace(ESCAPE_REGEXP, '\\$&')
);

const newEscapedRegExp = (
  // Generate escaped regular expression
  s // string
  // Returns: RegExp, instance
) => (
  new RegExp(escapeRegExp(s), 'g')
);

const addTrailingSlash = (
  // Add trailing slash at the end if it has no
  s // string
  // Returns: string
) => s + (s.endsWith('/') ? '' : '/');

const stripTrailingSlash = (
  // Remove trailing slash from string
  s // string
  // Returns: string
) => (
  s.endsWith('/') ? s.substr(0, s.length - 1) : s
);

const dirname = (
  // Get directory name with trailing slash from path
  filePath // string
  // Returns: string
) => {
  let dir = path.dirname(filePath);
  if (dir !== '/') dir += '/';
  return dir;
};

const between = (
  // Extract substring between prefix and suffix
  s, // string, source
  prefix, // string, before needed fragment
  suffix // string, after needed fragment
  // Returns: string
) => {
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

const BOM_REGEXP = /^[\uBBBF\uFEFF]*/;

const removeBOM = (
  // Remove UTF-8 BOM
  s // string, possibly starts with BOM
  // Returns: string
) => (
  typeof(s) === 'string' ? s.replace(BOM_REGEXP, '') : s
);

const ITEM_ESCAPE_REGEXP = /\\\*/g;

const arrayRegExp = (
  // Generate RegExp from array with '*' wildcards
  items // array of string
  // Returns: RegExp, instance
  // Example: ['/css/*', '/index.html']
) => {
  if (!items || items.length === 0) return null;
  items = items.map(
    item => escapeRegExp(item).replace(ITEM_ESCAPE_REGEXP, '.*')
  );
  const ex = items.length === 1 ? items[0] : '((' + items.join(')|(') + '))';
  return new RegExp('^' + ex + '$');
};

const section = (
  // Splits string by the first occurrence of separator
  s, // string
  separator // string, or char
  // Example: rsection('All you need is JavaScript', 'is')
  // Returns: ['All you need ', ' JavaScript']
) => {
  const i = s.indexOf(separator);
  if (i < 0) return [s, ''];
  return [s.slice(0, i), s.slice(i + separator.length)];
};

const rsection = (
  // Splits string by the last occurrence of separator
  s, // string
  separator // string, or char
  // Example: rsection('All you need is JavaScript', 'a')
  // Returns: ['All you need is Jav', 'Script']
) => {
  const i = s.lastIndexOf(separator);
  if (i < 0) return [s, ''];
  return [s.slice(0, i), s.slice(i + separator.length)];
};

const split = (
  // Splits string by multiple occurrence of separator
  s, // string
  separator = ',', // string (optional), default: ','
  limit = -1 // number (optional), // max length of result array
  // Example: split('a,b,c,d')
  // Result: ['a', 'b', 'c', 'd']
  // Example: split('a,b,c,d', ',', 2)
  // Result: ['a', 'b']
) => (
  s.split(separator, limit)
);

const rsplit = (
  // Splits string by multiple occurrence of separator
  s, // string
  separator = ',', // string (optional), default: ','
  limit = -1 // number (optional), // max length of result array
  // Example: split('a,b,c,d', ',', 2)
  // Result: ['c', 'd']
) => {
  const result = [];
  if (limit === -1) limit = Number.MAX_VALUE;
  let i;
  let count = 0;
  while (limit > count) {
    i = s.lastIndexOf(separator);
    if (i < 0) {
      result.unshift(s);
      return result;
    }
    result.unshift(s.slice(i + separator.length));
    s = s.slice(0, i);
    count++;
  }
  return result;
};

module.exports = {
  subst,
  htmlEscape,
  fileExt,
  removeExt,
  spinalToCamel,
  escapeRegExp,
  newEscapedRegExp,
  addTrailingSlash,
  stripTrailingSlash,
  dirname,
  capitalize,
  between,
  removeBOM,
  arrayRegExp,
  section,
  rsection,
  split,
  rsplit,
  ALPHA_UPPER,
  ALPHA_LOWER,
  ALPHA,
  DIGIT,
  ALPHA_DIGIT,
};
