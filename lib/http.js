'use strict';

const parseRange = (range) => {
  if (!range) return {};
  const bytes = range.split('=').pop().split('-');
  const [start, end] = bytes.map((n) => parseInt(n));
  return { start, end };
};

module.exports = { parseRange };
