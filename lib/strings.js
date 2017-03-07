'use strict';

module.exports = function(api) {

  const SUBST_REGEXP = /@([-.0-9a-zA-Z]+)@/g;

  api.common.subst = (
    // Substitute variables
    tpl, // template body
    data, // global data structure to visualize
    dataPath, // current position in data structure
    escapeHtml // escape html special characters if true
    // Return: string
  ) => (
    tpl.replace(SUBST_REGEXP, (s, key) => {
      const pos = key.indexOf('.');
      const name = pos === 0 ? dataPath + key : key;
      let value = api.common.getByPath(data, name);
      if (value === undefined) {
        if (key === '.value') {
          value = api.common.getByPath(data, dataPath);
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
          value = api.common.nowDateTime(value);
        } else if (value.constructor.name === 'Array') {
          value = '[array]';
        } else {
          value = '[object]';
        }
      }
      if (escapeHtml) value = api.common.htmlEscape(value);
      return value;
    })
  );

  const HTML_ESCAPE_REGEXP = new RegExp('[&<>"\'/]', 'g');
  const HTML_ESCAPE_CHARS = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'
  };

  api.common.htmlEscape = (
    content // string to escape
    // Example: api.common.htmlEscape('5>=5') : '5&lt;=5'
  ) => (
    content.replace(HTML_ESCAPE_REGEXP, char => HTML_ESCAPE_CHARS[char])
  );

  api.common.fileExt = (
    fileName // extract file extension in lower case with no dot
    // Example: api.common.fileExt('/dir/file.txt')
    // Return: 'txt'
  ) => (
    api.path.extname(fileName).replace('.', '').toLowerCase()
  );

  api.common.removeExt = (
    fileName // remove ext from fileName
    // Example: api.common.fileExt('file.txt')
    // Return: 'file'
  ) => (
    fileName.substr(0, fileName.lastIndexOf('.'))
  );

  const UNDERLINE_REGEXP = /_/g;

  api.common.spinalToCamel = (
    name // convert spinal case to camel case
  ) => (
    name
      .replace(UNDERLINE_REGEXP, '-')
      .split('-')
      .map((part, i) => (i > 0 ? api.common.capitalize(part) : part))
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

  api.common.escapeRegExp = (
    s // escapeRegExp('/path/to/res?search=this.that')
  ) => (
    s.replace(ESCAPE_REGEXP, '\\$&')
  );

  api.common.newEscapedRegExp = (s) => (
    new RegExp(api.common.escapeRegExp(s), 'g')
  );

  api.common.addTrailingSlash = (s) => s + (s.endsWith('/') ? '' : '/');

  api.common.stripTrailingSlash = (s) => (
    s.endsWith('/') ? s.substr(0, s.length - 1) : s
  );

  api.common.dirname = (path) => {
    let dir = api.path.dirname(path);
    if (dir !== '/') dir += '/';
    return dir;
  };

  const CAPITALIZE_REGEXP = /\w+/g;

  api.common.capitalize = (s) => (
    s.replace(CAPITALIZE_REGEXP, (word) => (
      word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    ))
  );

  api.common.between = (
    s, // string to extract substring between prefix and suffix
    prefix, // substring before needed fragment
    suffix // substring after needed fragment
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

  api.common.removeBOM = (
    s // string possibly starts with UTF-8 BOM
  ) => (
    typeof(s) === 'string' ? s.replace(BOM_REGEXP, '') : s
  );

  const ITEM_ESCAPE_REGEXP = /\\\*/g;

  api.common.arrayRegExp = (
    items // array of strings with '*' wildcards to be converted into one RegExp
    // Example: ['/css/*', '/index.html']
  ) => {
    if (!items || items.length === 0) return null;
    items = items.map(
      item => api.common.escapeRegExp(item).replace(ITEM_ESCAPE_REGEXP, '.*')
    );
    const ex = items.length === 1 ? items[0] : '((' + items.join(')|(') + '))';
    return new RegExp('^' + ex + '$');
  };

};
