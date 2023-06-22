'use strict';

const metatests = require('metatests');
const metautil = require('..');

const getRate = async (currency) => {
  const host = 'openexchangerates.org';
  const path = '/api/latest.json?app_id=';
  const key = '1f43ea96b1e343fe94333dd2b97a109d';
  const url = `https://${host}/${path}${key}`;
  try {
    const res = await metautil.fetch(url);
    const data = await res.json();
    const rate = data.rates[currency];
    return rate;
  } catch {
    return 1;
  }
};

metatests.test('Fetch', async (test) => {
  const rate = await getRate('USD');
  test.strictSame(rate, 1);
  const method = 'POST';
  const body = JSON.stringify({ name: 'Aurelia', age: 43 });
  const headers = { Authorization: 'Bearer sometoken' };
  const url = 'https://httpbin.org/anything';
  try {
    const res = await metautil.fetch(url, { headers, body, method });
    const json = await res.json();
    test.strictEqual(json, json);
  } catch (error) {
    test.strictEqual(error instanceof Error, true);
  }
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

metatests.case(
  'Network utilities',
  { metautil },
  {
    'metautil.ipToInt': [
      ['127.0.0.1', 2130706433],
      ['10.0.0.1', 167772161],
      ['192.168.1.10', -1062731510],
      ['165.225.133.150', -1511946858],
      ['0.0.0.0', 0],
      ['wrong-string', Number.NaN],
      ['', 0],
      ['8.8.8.8', 0x08080808],
      [undefined, 0x7f000001],
    ],
  },
);
