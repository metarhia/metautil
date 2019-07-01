'use strict';

const path = require('path');

const { getByPath } = require('./data');
const { nowDateTime } = require('./time');

const HTML_ESCAPE_REGEXP = new RegExp('[&<>"\'/]', 'g');

const HTML_ESCAPE_CHARS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

// Escape html characters
//   content - <string>, to escape
// Returns: <string>
//
// Example: htmlEscape('5>=5') = '5&lt;=5'
const htmlEscape = content =>
  content.replace(HTML_ESCAPE_REGEXP, char => HTML_ESCAPE_CHARS[char]);

// Substitute variables
//   tpl - <string>, template body
//   data - <Object>, hash, data structure to visualize
//   dataPath - <string>, current position in data structure
//   escapeHtml - <boolean>, escape html special characters if true
// Returns: <string>
const subst = (tpl, data, dataPath, escapeHtml) => {
  let start = 0;
  let end = tpl.indexOf('@');
  if (end === -1) return tpl;

  const defaultData = getByPath(data, dataPath);
  let result = '';
  while (end !== -1) {
    result += tpl.substring(start, end);
    start = end + 1;
    end = tpl.indexOf('@', start);
    if (end === -1) {
      start--;
      break;
    }

    const hasDot = tpl.charAt(start) === '.';
    const key = tpl.slice(hasDot ? start + 1 : start, end);
    let value = getByPath(hasDot ? defaultData : data, key);
    if (hasDot && value === undefined && key === 'value') {
      value = defaultData;
    }

    if (value === null) {
      value = '[null]';
    } else if (value === undefined) {
      value = '[undefined]';
    } else if (typeof value === 'object') {
      const parentName = value.constructor.name;
      if (parentName === 'Date') {
        value = nowDateTime(value);
      } else if (parentName === 'Array') {
        value = '[array]';
      } else {
        value = '[object]';
      }
    }
    result += escapeHtml ? htmlEscape(value) : value;
    start = end + 1;
    end = tpl.indexOf('@', start);
  }
  if (start < tpl.length) {
    result += tpl.substring(start);
  }
  return result;
};

// Extract file extension in lower case without dot
//   fileName - <string>, file name
// Returns: <string>
//
// Example: fileExt('/dir/file.txt')
// Result: 'txt'
const fileExt = fileName =>
  path
    .extname(fileName)
    .replace('.', '')
    .toLowerCase();

// Remove file extension from file name
//   fileName - <string>, file name
// Returns: <string>
//
// Example: fileExt('file.txt')
// Result: 'file'
const removeExt = fileName => fileName.substr(0, fileName.lastIndexOf('.'));

const CAPITALIZE_REGEXP = /\w+/g;

// Capitalize string
//   s - <string>
// Returns: <string>
const capitalize = s =>
  s.replace(
    CAPITALIZE_REGEXP,
    word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  );

const UNDERLINE_REGEXP = /_/g;

// Convert spinal case to camel case
//   name - <string>
// Returns: <string>
const spinalToCamel = name =>
  name
    .replace(UNDERLINE_REGEXP, '-')
    .split('-')
    .map((part, i) => (i > 0 ? capitalize(part) : part))
    .join('');

const ESCAPE_REGEXP_SPECIALS = [
  // order matters for these
  '-',
  '[',
  ']',
  // order doesn't matter for any of these
  '/',
  '{',
  '}',
  '(',
  ')',
  '*',
  '+',
  '?',
  '.',
  '\\',
  '^',
  '$',
  '|',
];

const ESCAPE_REGEXP = new RegExp(
  '[' + ESCAPE_REGEXP_SPECIALS.join('\\') + ']',
  'g'
);

// Escape regular expression control characters
//   s - <string>
// Returns: <string>
//
// Example: escapeRegExp('/path/to/res?search=this.that')
const escapeRegExp = s => s.replace(ESCAPE_REGEXP, '\\$&');

// Generate escaped regular expression
//   s - <string>
// Returns: <RegExp>
const newEscapedRegExp = s => new RegExp(escapeRegExp(s), 'g');

// Add trailing slash at the end if there isn't one
//   s - <string>
// Returns: <string>
const addTrailingSlash = s => s + (s.endsWith('/') ? '' : '/');

// Remove trailing slash from string
//   s - <string>
// Returns: <string>
const stripTrailingSlash = s =>
  s.endsWith('/') ? s.substr(0, s.length - 1) : s;

// Get directory name with trailing slash from path
//   filePath - <string>
// Returns: <string>
const dirname = filePath => {
  let dir = path.dirname(filePath);
  if (dir !== '/') dir += '/';
  return dir;
};

// Extract substring between prefix and suffix
//   s - <string>, source
//   prefix - <string>, before needed fragment
//   suffix - <string>, after needed fragment
// Returns: <string>
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

const BOM_REGEXP = /^[\uBBBF\uFEFF]*/;

// Remove UTF-8 BOM
//   s - <string>, possibly starts with BOM
// Returns: <string>
const removeBOM = s => (typeof s === 'string' ? s.replace(BOM_REGEXP, '') : s);

const ITEM_ESCAPE_REGEXP = /\\\*/g;

// Generate RegExp from array with '*' wildcards
//   items - <string[]>
// Returns: <RegExp>
//
// Example: ['/css/*', '/index.html']
const arrayRegExp = items => {
  if (!items || items.length === 0) return null;
  items = items.map(item =>
    escapeRegExp(item).replace(ITEM_ESCAPE_REGEXP, '.*')
  );
  const ex = items.length === 1 ? items[0] : '((' + items.join(')|(') + '))';
  return new RegExp('^' + ex + '$');
};

// Split string by the first occurrence of separator
//   s - <string>
//   separator - <string>, or char
// Returns: <string[]>
//
// Example: rsection('All you need is JavaScript', 'is')
// Result: ['All you need ', ' JavaScript']
const section = (s, separator) => {
  const i = s.indexOf(separator);
  if (i < 0) return [s, ''];
  return [s.slice(0, i), s.slice(i + separator.length)];
};

// Split string by the last occurrence of separator
//   s - <string>
//   separator - <string>, or char
// Returns: <string[]>
//
// Example: rsection('All you need is JavaScript', 'a')
// Result: ['All you need is Jav', 'Script']
const rsection = (s, separator) => {
  const i = s.lastIndexOf(separator);
  if (i < 0) return [s, ''];
  return [s.slice(0, i), s.slice(i + separator.length)];
};

// Split string by multiple occurrence of separator
// Signature: s[, separator[, limit]]
//   s - <string>
//   separator - <string>, (optional), default: ','
//   limit - <number>, (optional), default: `-1`, max length of result array
// Returns: <string[]>
//
// Example: split('a,b,c,d')
// Result: ['a', 'b', 'c', 'd']
// Example: split('a,b,c,d', ',', 2)
// Result: ['a', 'b']
const split = (s, separator = ',', limit = -1) => s.split(separator, limit);

// Split string by multiple occurrences of separator
// Signature: s[, separator[, limit]]
//   s - <string>
//   separator - <string>, (optional), default: ','
//   limit - <number>, (optional), default: `-1`, max length of result array
// Returns: <string[]>
//
// Example: split('a,b,c,d', ',', 2)
// Result: ['c', 'd']
const rsplit = (s, separator = ',', limit = -1) => {
  const result = [];
  if (limit === -1) limit = Number.MAX_VALUE;
  let count = 0;
  while (limit > count) {
    const i = s.lastIndexOf(separator);
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

// Normalize email address according to OWASP recommendations
//   email - <string>, email address to normalize
// Returns: <string>, normalized email address
const normalizeEmail = email => {
  const at = email.lastIndexOf('@');
  const domain = email.slice(at).toLowerCase();
  return email.slice(0, at) + domain;
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
  normalizeEmail,
  ALPHA_UPPER,
  ALPHA_LOWER,
  ALPHA,
  DIGIT,
  ALPHA_DIGIT,
};
