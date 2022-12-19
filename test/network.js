'use strict';

const metatests = require('metatests');
const metautil = require('..');

const getRate = async (currency) => {
  const host = 'openexchangerates.org';
  const path = '/api/latest.json?app_id=';
  const key = '1f43ea96b1e343fe94333dd2b97a109d';
  const url = `https://${host}/${path}${key}`;
  const res = await metautil.fetch(url);
  const data = await res.json();
  const rate = data.rates[currency];
  return rate;
};

metatests.test('Fetch', async (test) => {
  const rate = await getRate('USD');
  test.strictSame(rate, 1);
  const method = 'POST';
  const body = { name: 'Aurelia', age: 43 };
  const headers = { Authorization: 'Bearer sometoken' };
  const url = 'https://httpbin.org/anything';
  const res = await metautil.fetch(url, { headers, body, method });
  const json = await res.json();
  test.strictEqual(json, json);
  test.end();
});

metatests.test('receiveBody', async (test) => {
  const value = Buffer.from('{ "a": 5 }');
  let done = false;
  const body = {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          const res = { value, done };
          done = true;
          return res;
        },
      };
    },
  };
  const data = await metautil.receiveBody(body);
  test.strictSame(data.toString(), '{ "a": 5 }');
  test.end();
});
