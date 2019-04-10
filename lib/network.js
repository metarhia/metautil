'use strict';

const os = require('os');

// Convert IP string to number
// Signature: [ip]
//   ip - <string>, (optional), default: '127.0.0.1', IP address
// Returns: <number>
const ipToInt = (ip = '127.0.0.1') =>
  ip.split('.').reduce((res, item) => (res << 8) + +item, 0);

let LOCAL_IPS_CACHE;

// Get local network interfaces
// Returns: <string[]>
const localIPs = () => {
  if (LOCAL_IPS_CACHE) return LOCAL_IPS_CACHE;
  const ips = [];
  const ifHash = os.networkInterfaces();
  for (const ifName in ifHash) {
    const ifItem = ifHash[ifName];
    for (let i = 0; i < ifItem.length; i++) {
      const protocol = ifItem[i];
      if (protocol.family === 'IPv4') {
        ips.push(protocol.address);
      }
    }
  }
  LOCAL_IPS_CACHE = ips;
  return ips;
};

// Parse host string
//   host - <string>, host or empty string, may contain `:port`
// Returns: <string>, host without port but not empty
const parseHost = host => {
  if (!host) {
    return 'no-host-name-in-http-headers';
  }
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};

module.exports = {
  ipToInt,
  localIPs,
  parseHost,
};
