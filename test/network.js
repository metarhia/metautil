'use strict';

const http = require('node:http');
const metatests = require('metatests');
const metautil = require('..');

const RATES_HOST = 'openexchangerates.org';
const RATES_PATH = '/api/latest.json?app_id=';
const RATES_API_KEY = '1f43ea96b1e343fe94333dd2b97a109d';
const RATES_API_URL = `https://${RATES_HOST}/${RATES_PATH}${RATES_API_KEY}`;

const MATH_API_URL = 'https://api.mathjs.org/v4';

metatests.test('Newtork: receiveBody', async (test) => {
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
      ['0.0.0.0', 0],
      ['0.0.0.1', 1],
      ['0.0.1.0', 0x0000100],
      ['0.1.0.0', 0x0010000],
      ['1.0.0.0', 0x1000000],
      ['8.8.8.8', 0x08080808],
      ['10.0.0.1', 0x0a000001],
      ['127.0.0.1', 0x7f000001],
      ['192.168.1.10', 0xc0a8010a],
      ['165.225.133.150', 0xa5e18596],
      ['0.0.0.255', 0x000000ff],
      ['0.0.255.0', 0x0000ff00],
      ['0.255.0.0', 0x00ff0000],
      ['255.0.0.0', 0xff000000],
      ['255.255.255.255', 0xffffffff],
      ['wrong-string', Number.NaN],
      ['', Number.NaN],
      [undefined, Number.NaN],
    ],
    'metautil.intToIp': [
      [0, '0.0.0.0'],
      [1, '0.0.0.1'],
      [0x00000100, '0.0.1.0'],
      [0x00010000, '0.1.0.0'],
      [0x01000000, '1.0.0.0'],
      [0x08080808, '8.8.8.8'],
      [0x0a000001, '10.0.0.1'],
      [0x7f000001, '127.0.0.1'],
      [0xc0a8010a, '192.168.1.10'],
      [0xa5e18596, '165.225.133.150'],
      [0x000000ff, '0.0.0.255'],
      [0x0000ff00, '0.0.255.0'],
      [0x00ff0000, '0.255.0.0'],
      [0xff000000, '255.0.0.0'],
      [0xffffffff, '255.255.255.255'],
    ],
  },
);

metatests.test('Newtork: httpApiCall', async (test) => {
  const res1 = await metautil.httpApiCall(RATES_API_URL, { method: 'GET' });
  test.strictSame(typeof res1.disclaimer, 'string');
  test.strictSame(typeof res1.license, 'string');
  test.strictSame(typeof res1.timestamp, 'number');
  test.strictSame(res1.base, 'USD');
  test.strictSame(typeof res1.rates, 'object');
  test.strictSame(typeof res1.rates['UAH'], 'number');

  const body = '{"expr":"2+3*sqrt(4)","precision":3}';
  const options = { method: 'POST', body };
  const res2 = await metautil.httpApiCall(MATH_API_URL, options);
  test.strictSame(Object.keys(res2), ['result', 'error']);
  test.strictSame(res2.result, '8');
  test.strictSame(res2.error, null);

  const res3 = await metautil.httpApiCall(MATH_API_URL, { body });
  test.strictSame(Object.keys(res3), ['result', 'error']);
  test.strictSame(res3.result, '8');
  test.strictSame(res3.error, null);

  test.end();
});

metatests.test('Network: httpApiCall (POST)', (test) => {
  const expectedBody = '{"key": "value"}';
  const expectedLength = Buffer.byteLength(expectedBody).toString();

  const server = http.createServer();

  server.on('request', async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;

    test.strictSame(body, expectedBody);
    test.strictSame(req.headers['content-length'], expectedLength);
    test.strictSame(req.headers['content-type'], 'application/json');
    test.strictSame(req.headers['custom-header'], 'custom-value');
    test.strictSame(req.method, 'POST');

    res.end('{"key": "value"}');
  });

  server.listen(0, async () => {
    const url = `http://localhost:${server.address().port}`;
    try {
      const headers = { 'Custom-Header': 'custom-value' };
      const body = '{"key": "value"}';
      const method = 'POST';
      const res = await metautil.httpApiCall(url, { method, headers, body });
      test.strictSame(res, { key: 'value' });
    } catch (err) {
      test.error(err);
    } finally {
      server.close();
      test.end();
    }
  });
});

metatests.test('Network: httpApiCall (POST without body)', (test) => {
  const server = http.createServer();

  server.on('request', async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;

    test.strictSame(req.headers['content-length'], '0');
    test.strictSame(req.headers['content-type'], 'application/json');
    test.strictSame(req.headers['custom-header'], 'custom-value');
    test.strictSame(req.method, 'POST');
    test.strictSame(body, '');

    res.end('{"key": "value"}');
  });

  server.listen(0, async () => {
    const url = `http://localhost:${server.address().port}`;
    try {
      const headers = { 'Custom-Header': 'custom-value' };
      const res = await metautil.httpApiCall(url, { method: 'POST', headers });
      test.strictSame(res, { key: 'value' });
    } catch (err) {
      test.error(err);
    } finally {
      server.close();
      test.end();
    }
  });
});

metatests.test('Network: httpApiCall (GET)', (test) => {
  const server = http.createServer();

  server.on('request', async (req, res) => {
    test.strictSame(req.headers['content-length'], undefined);
    test.strictSame(req.headers['content-type'], 'application/json');
    test.strictSame(req.headers['custom-header'], 'custom-value');
    test.strictSame(req.method, 'GET');

    res.end('{"key": "value"}');
  });

  server.listen(0, async () => {
    const url = `http://localhost:${server.address().port}`;
    try {
      const headers = { 'Custom-Header': 'custom-value' };
      const res = await metautil.httpApiCall(url, { method: 'GET', headers });
      test.strictSame(res, { key: 'value' });
    } catch (err) {
      test.error(err);
    } finally {
      server.close();
      test.end();
    }
  });
});
