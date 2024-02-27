'use strict';

const receiveBody = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const IPV4_OCTETS = 4;

const ipToInt = (ip) => {
  if (typeof ip !== 'string') return Number.NaN;
  const bytes = ip.split('.');
  if (bytes.length !== IPV4_OCTETS) return Number.NaN;
  let res = 0;
  for (const byte of bytes) {
    res = res * 256 + parseInt(byte, 10);
  }
  return res;
};

const MAX_32_BIT = 0xffffffff;

const intToIp = (int) => {
  if (!Number.isInteger(int) || int < 0 || int > MAX_32_BIT) {
    throw new Error('Invalid integer for IPv4 address');
  }
  const octets = new Array(IPV4_OCTETS);
  for (let i = 0; i < IPV4_OCTETS; i++) {
    const shift = 8 * (IPV4_OCTETS - 1 - i);
    octets[i] = (int >>> shift) & 0xff;
  }
  return octets.join('.');
};

const httpApiCall = async (url, { method = 'POST', headers = {}, body }) => {
  const mimeType = 'application/json';
  const custom = { 'Content-Type': mimeType, ...headers };
  if (body) headers['Content-Length'] = Buffer.byteLength(body);
  const options = { method, headers: custom, body };
  return await fetch(url, options).then(async (res) => {
    const code = res.status;
    if (code === 200) return await res.json();
    await res.body.cancel();
    const dest = `for ${method} ${url}`;
    throw new Error(`HTTP status code ${code} ${dest}`);
  });
};

module.exports = {
  receiveBody,
  ipToInt,
  intToIp,
  httpApiCall,
};
