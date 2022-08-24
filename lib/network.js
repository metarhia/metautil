'use strict';

const http = require('http');
const https = require('https');

const prepareRequest = ({ body, headers = {} }) => {
  if (!body) return { headers };
  const data = JSON.stringify(body);
  return {
    body: data,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };
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
    const json = Buffer.concat(chunks).toString();
    const object = JSON.parse(json);
    resolve(object);
  } catch (error) {
    reject(error);
  }
};

const fetch = (url, options = {}) => {
  const transport = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const { body, headers } = prepareRequest(options);
    const opt = { method: 'GET', ...options, headers };
    const callback = prepareResponse(resolve, reject);
    const req = transport.request(url, opt, callback);
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
