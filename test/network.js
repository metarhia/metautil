'use strict';

const metatests = require('metatests');
const metautil = require('..');

const API_EXCHANGE = {
  host: 'openexchangerates.org',
  path: '/api/latest.json?app_id=',
  key: '1f43ea96b1e343fe94333dd2b97a109d',
};

const getRate = async (currency) => {
  const { host, path, key } = API_EXCHANGE;
  const url = `https://${host}/${path}${key}`;
  const data = await metautil.fetch(url);
  const rate = data.rates[currency];
  return rate;
};

metatests.test('Fetch', async (test) => {
  const rate = await getRate('USD');
  test.strictSame(rate, 1);
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
