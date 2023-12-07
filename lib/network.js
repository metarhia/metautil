'use strict';

const { fetch } = require('undici');

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

const httpApiCall = (url, { method = 'POST', body }) => {
  const mimeType = 'application/json';
  const len = body ? Buffer.byteLength(body) : 0;
  const headers = { 'Content-Type': mimeType, 'Content-Length': len };
  return fetch(url, { method, headers, body })
    .then(async (res) => {
      const code = res.status;
      if (code !== 200) {
        const dest = `for ${method} ${url}`;
        throw new Error(`HTTP status code ${code} ${dest}`);
      }
      try {
        return await res.json();
      } catch (error) {
        throw new Error(error);
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = {
  receiveBody,
  ipToInt,
  intToIp,
  httpApiCall,
};
