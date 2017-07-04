'use strict';

module.exports = (api) => {

  const SUBST_REGEXP = /@([-.0-9a-zA-Z]+)@/g;

  api.common.subst = (
    // Substitute variables
    tpl, // template body
    data, // global data structure to visualize
    dataPath, // current position in data structure
    escapeHtml // escape html special characters if true
    // Returns string
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
    // Escape html characters
    content // string to escape
    // Example: api.common.htmlEscape('5>=5') : '5&lt;=5'
  ) => (
    content.replace(HTML_ESCAPE_REGEXP, char => HTML_ESCAPE_CHARS[char])
  );

  api.common.fileExt = (
    // Extract file extension in lower case with no dot
    fileName // string, file name
    // Example: api.common.fileExt('/dir/file.txt')
    // Result: 'txt'
  ) => (
    api.path.extname(fileName).replace('.', '').toLowerCase()
  );

  api.common.removeExt = (
    // Remove file extension from file name
    fileName // string, file name
    // Example: api.common.fileExt('file.txt')
    // Result: 'file'
  ) => (
    fileName.substr(0, fileName.lastIndexOf('.'))
  );

  const UNDERLINE_REGEXP = /_/g;

  api.common.spinalToCamel = (
    // convert spinal case to camel case
    name // string
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
    // Escape regular expression control characters
    s // string
    // Example: escapeRegExp('/path/to/res?search=this.that')
  ) => (
    s.replace(ESCAPE_REGEXP, '\\$&')
  );

  api.common.newEscapedRegExp = (
    // Generate escaped regular expression
    s // string
    // Returns: instance of RegExp
  ) => (
    new RegExp(api.common.escapeRegExp(s), 'g')
  );

  api.common.addTrailingSlash = (s) => s + (s.endsWith('/') ? '' : '/');

  api.common.stripTrailingSlash = (
    // Remove trailing slash from string
    s // string
  ) => (
    s.endsWith('/') ? s.substr(0, s.length - 1) : s
  );

  api.common.dirname = (
    // Get directory name with trailing slash from path
    path // string
  ) => {
    let dir = api.path.dirname(path);
    if (dir !== '/') dir += '/';
    return dir;
  };

  const CAPITALIZE_REGEXP = /\w+/g;

  api.common.capitalize = (
    // Capitalize string
    s // string
  ) => (
    s.replace(CAPITALIZE_REGEXP, (word) => (
      word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    ))
  );

  api.common.between = (
    // Extract substring between prefix and suffix
    s, // source string
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
    // Remove UTF-8 BOM
    s // string possibly starts with BOM
  ) => (
    typeof(s) === 'string' ? s.replace(BOM_REGEXP, '') : s
  );

  const ITEM_ESCAPE_REGEXP = /\\\*/g;

  api.common.arrayRegExp = (
    // Generate RegExp from array with '*' wildcards
    items // array of strings
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
