'use strict';

const ipToInt = (ip = '127.0.0.1') =>
  ip.split('.').reduce((res, item) => (res << 8) + +item, 0);

const parseHost = (host) => {
  if (!host) {
    return 'no-host-name-in-http-headers';
  }
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};

module.exports = {
  ipToInt,
  parseHost,
};
