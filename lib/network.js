'use strict';

const http = require('http');
const https = require('https');

const prepareRequest = ({ body, headers = {} }) => {
  if (!body) return { headers };
  const data = JSON.stringify(body);
  const content = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  };
  return { body: data, headers: { ...content, ...headers } };
};

const receiveBody = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const prepareResponse = (resolve, reject) => (res) => {
  const code = res.statusCode;
  if (code >= 400) {
    reject(new Error(`HTTP status code ${code}`));
    return;
  }
  res.on('error', reject);
  const parse = (data) => async () => JSON.parse(data.toString());
  receiveBody(res)
    .then((data) => resolve({ json: parse(data) }))
    .catch(reject);
};

const fetchPolyfill = (url, options = {}) => {
  const protocol = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const { body, headers } = prepareRequest(options);
    const opt = { method: 'GET', ...options, headers };
    const callback = prepareResponse(resolve, reject);
    const req = protocol.request(url, opt, callback);
    if (body) req.write(body);
    req.end();
  });
};

module.exports = { fetch: global.fetch || fetchPolyfill, receiveBody };
