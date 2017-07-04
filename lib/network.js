'use strict';

module.exports = (api) => {

  api.common.ip2int = (
    // Pack IP string to single int
    ip = '127.0.0.1'
  ) => (
    ip.split('.').reduce((res, item) => (res << 8) + (+item), 0)
  );

  api.common.localIPs = (
    // Get local network interfaces
    // Returns array of strings
  ) => {
    let ips = api.common.localIPs.cache;
    if (ips) return ips;
    ips = [];
    let protocol, ifName, ifItem, i, len;
    const ifHash = api.os.networkInterfaces();
    for (ifName in ifHash) {
      ifItem = ifHash[ifName];
      for (i = 0, len = ifItem.length; i < len; i++) {
        protocol = ifItem[i];
        if (protocol.family === 'IPv4') {
          ips.push(protocol.address);
        }
      }
    }
    api.common.localIPs.cache = ips;
    return ips;
  };

  api.common.parseHost = (
    // Parse host string
    host // host or empty string, may contain :port
    // Returns host without port but not empty
  ) => {
    if (!host) host = 'no-host-name-in-http-headers';
    const portOffset = host.indexOf(':');
    if (portOffset > -1) host = host.substr(0, portOffset);
    return host;
  };

};
