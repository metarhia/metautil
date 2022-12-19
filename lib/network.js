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

const prepareResponse = (resolve, reject) => async (res) => {
  const code = res.statusCode;
  if (code >= 400) {
    reject(new Error(`HTTP status code ${code}`));
    return;
  }
  res.on('error', reject);
  const chunks = [];
  try {
    for await (const chunk of res) chunks.push(chunk);
  } catch (error) {
    reject(error);
  }
  resolve({
    async json() {
      const data = Buffer.concat(chunks).toString();
      return JSON.parse(data);
    },
  });
};

const fetch = (url, options = {}) => {
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

const receiveBody = async (req) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers);
};

module.exports = { fetch, receiveBody };
