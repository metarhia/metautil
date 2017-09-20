'use strict';

const os = require('os');
const { alias } = require('./utilities');

const ipToInt = (
  // Convert IP string to number
  ip = '127.0.0.1' // string, IP address
  // Returns: number
) => (
  ip.split('.').reduce((res, item) => (res << 8) + (+item), 0)
);

let LOCAL_IPS_CACHE;

const localIPs = (
  // Get local network interfaces
  // Returns: srray of strings
) => {
  if (LOCAL_IPS_CACHE) return LOCAL_IPS_CACHE;
  const ips = [];
  let protocol, ifName, ifItem, i, len;
  const ifHash = os.networkInterfaces();
  for (ifName in ifHash) {
    ifItem = ifHash[ifName];
    for (i = 0, len = ifItem.length; i < len; i++) {
      protocol = ifItem[i];
      if (protocol.family === 'IPv4') {
        ips.push(protocol.address);
      }
    }
  }
  LOCAL_IPS_CACHE = ips;
  return ips;
};

const parseHost = (
  // Parse host string
  host // string, host or empty string, may contain `:port`
  // Returns: string, host without port but not empty
) => {
  if (!host) {
    return 'no-host-name-in-http-headers';
  }
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};

module.exports = {
  ip2int: alias(ipToInt),
  ipToInt,
  localIPs,
  parseHost,
};
