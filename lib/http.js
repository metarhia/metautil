'use strict';

const parseHost = (host) => {
  if (!host) return 'no-host-name-in-http-headers';
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};

const parseParams = (params) => Object.fromEntries(new URLSearchParams(params));

const parseCookies = (cookie) => {
  const values = [];
  const items = cookie.split(';');
  for (const item of items) {
    const [key, val = ''] = item.split('=');
    values.push([key.trim(), val.trim()]);
  }
  return Object.fromEntries(values);
};

const parseRange = (range) => {
  if (!range || !range.includes('=')) return {};
  const bytes = range.split('=').pop();
  if (!bytes || !range.includes('-')) return {};
  const [start, end] = bytes.split('-').map((n) => parseInt(n));
  if (isNaN(start)) return isNaN(end) ? {} : { tail: end };
  return isNaN(end) ? { start } : { start, end };
};

module.exports = { parseHost, parseParams, parseCookies, parseRange };
