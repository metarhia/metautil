'use strict';

const http = require('node:http');
const https = require('node:https');

const prepareRequest = ({ body, headers = {} }) => {
  if (!body) return { headers };
  const content = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  };
  return { body, headers: { ...content, ...headers } };
};

const receiveBody = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const prepareResponse = (resolve, reject) => (res) => {
  const code = res.statusCode;
  if (code >= 400) return void reject(new Error(`HTTP status code ${code}`));
  res.on('error', reject);
  const parse = (data) => async () => JSON.parse(data.toString());
  const text = (data) => async () => data.toString();
  receiveBody(res)
    .then((data) => resolve({ json: parse(data), text: text(data) }))
    .catch(reject);
};

const fetchPolyfill = (url, options = {}) => {
  const protocol = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const { body, headers } = prepareRequest(options);
    const opt = { method: 'GET', ...options, headers };
    const callback = prepareResponse(resolve, reject);
    const req = protocol.request(url, opt, callback);
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
};

const ipToInt = (ip = '127.0.0.1') => {
  if (ip === '') return 0;
  const bytes = ip.split('.');
  let res = 0;
  for (const byte of bytes) {
    res = (res << 8) + parseInt(byte, 10);
  }
  return res;
};

const httpApiCall = (url, { method = 'POST', body }) => {
  const proto = url.startsWith('https') ? https : http;
  const mimeType = 'application/json';
  const len = body ? Buffer.byteLength(body) : 0;
  const headers = { 'Content-Type': mimeType, 'Content-Length': len };
  return new Promise((resolve, reject) => {
    const req = proto.request(url, { method, headers }, (res) => {
      const code = res.statusCode;
      if (code !== 200) {
        const dest = `for ${method} ${url}`;
        return void reject(new Error(`HTTP status code ${code} ${dest}`));
      }
      receiveBody(res).then((data) => {
        const json = data.toString();
        try {
          const object = JSON.parse(json);
          resolve(object);
        } catch (error) {
          reject(error);
        }
      }, reject);
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
};

module.exports = {
  fetch: global.fetch || fetchPolyfill,
  receiveBody,
  ipToInt,
  httpApiCall,
};
