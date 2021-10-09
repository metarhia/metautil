'use strict';

const http = require('http');
const https = require('https');

const fetch = async (url) => {
  const transport = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    transport.get(url, async (res) => {
      const code = res.statusCode;
      if (code !== 200) return reject(new Error(`HTTP status code ${code}`));
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
  });
};

module.exports = { fetch };
