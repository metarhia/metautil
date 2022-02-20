'use strict';

const http = require('http');
const https = require('https');

const makeRequestOptions = (url, options = {}) => {
  const { hostname, port, pathname, search } = new URL(url);
  const path = `${pathname}${search}`;
const { method = 'GET', headers = {} } = options;
  const result = { hostname, port, path, method, headers };
  if (options.body) {
    result.body = JSON.stringify(options.body);
    result.headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(result.body),
      ...headers,
    };
  }
  return result;
};

const fetch = async (url, options = {}) => {
  const transport = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const requestOptions = makeRequestOptions(url, options);
    const req = transport.request(requestOptions, async (res) => {
      const code = res.statusCode;
      if (code >= 400) return reject(new Error(`HTTP status code ${code}`));
      res.on('error', reject);
      const chunks = [];
      try {
        for await (const chunk of res) chunks.push(chunk);
        const json = Buffer.concat(chunks).toString();
        const object = JSON.parse(json);
        resolve(object);
      } catch (error) {
        return reject(error);
      }
    });
    if (requestOptions.body) req.write(requestOptions.body);
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

module.exports = { fetch, receiveBody, makeRequestOptions };
