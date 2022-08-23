'use strict';

const http = require('http');
const https = require('https');

const fetch = async (url) => {
  const transport = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    transport.get(url, async (res) => {
      const code = res.statusCode;
      if (code !== 200) {
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
    });
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
