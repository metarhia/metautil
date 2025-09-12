const DIGITS = '0123456789';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const CHARS = '-' + DIGITS + UPPER + '_' + LOWER;
const CHARS_LENGTH = CHARS.length;

const POSSIBLE = new Uint8Array(256);
const CHAR_MAP = {};
for (let i = 0; i < CHARS_LENGTH; i++) {
  const char = CHARS.charCodeAt(i);
  CHAR_MAP[CHARS[i]] = i;
  POSSIBLE[i] = char;
  POSSIBLE[i + 64] = char;
  POSSIBLE[i + 128] = char;
  POSSIBLE[i + 192] = char;
}

const DEFAULT_LENGTH = 24;
const BUF_SIZE = 65536; // Web crypto limit

const randomBuffer = new Uint8Array(BUF_SIZE);
crypto.getRandomValues(randomBuffer);

let bufferPos = 0;

const resultBuffer = [];
resultBuffer[DEFAULT_LENGTH] = new Uint8Array(DEFAULT_LENGTH);

const TIMESTAMP_BYTES = 6;
const TIMESTAMP_CHARS = 8;

const timestampBuffer = new ArrayBuffer(TIMESTAMP_BYTES);
const timestampView = new DataView(timestampBuffer);
const timestamp = new Uint8Array(timestampBuffer);

const encodeTimestamp48 = (msec, target) => {
  const hi = Math.floor(msec / 0x100000000);
  const lo = msec % 0x100000000;
  timestampView.setUint32(0, lo, false);
  timestampView.setUint16(4, hi, false);
  target[0] = POSSIBLE[timestamp[0] >>> 2];
  target[1] = POSSIBLE[((timestamp[0] & 0x03) << 4) | (timestamp[1] >>> 4)];
  target[2] = POSSIBLE[((timestamp[1] & 0x0f) << 2) | (timestamp[2] >>> 6)];
  target[3] = POSSIBLE[timestamp[2] & 0x3f];
  target[4] = POSSIBLE[timestamp[3] >>> 2];
  target[5] = POSSIBLE[((timestamp[3] & 0x03) << 4) | (timestamp[4] >>> 4)];
  target[6] = POSSIBLE[((timestamp[4] & 0x0f) << 2) | (timestamp[5] >>> 6)];
  target[7] = POSSIBLE[timestamp[5] & 0x3f];
};

const decodeTimestamp48 = (encoded) => {
  if (encoded.length < TIMESTAMP_CHARS) {
    throw new Error('Encoded timestamp too short');
  }
  const c0 = CHAR_MAP[encoded[0]];
  const c1 = CHAR_MAP[encoded[1]];
  const c2 = CHAR_MAP[encoded[2]];
  const c3 = CHAR_MAP[encoded[3]];
  const c4 = CHAR_MAP[encoded[4]];
  const c5 = CHAR_MAP[encoded[5]];
  const c6 = CHAR_MAP[encoded[6]];
  const c7 = CHAR_MAP[encoded[7]];
  if (
    c0 === undefined ||
    c1 === undefined ||
    c2 === undefined ||
    c3 === undefined ||
    c4 === undefined ||
    c5 === undefined ||
    c6 === undefined ||
    c7 === undefined
  ) {
    throw new Error('Invalid characters in timestamp');
  }
  timestamp[0] = (c0 << 2) | (c1 >>> 4);
  timestamp[1] = ((c1 & 0x0f) << 4) | (c2 >>> 2);
  timestamp[2] = ((c2 & 0x03) << 6) | c3;
  timestamp[3] = (c4 << 2) | (c5 >>> 4);
  timestamp[4] = ((c5 & 0x0f) << 4) | (c6 >>> 2);
  timestamp[5] = ((c6 & 0x03) << 6) | c7;
  return timestampView.getUint32(0, false) +
         (timestampView.getUint16(4, false) * 0x100000000);
};

const generateId = ({ length = DEFAULT_LENGTH, time = false } = {}) => {
  if (length < 1 || length > 256) {
    throw new Error(`Incorrect GSID length ${length} (expected 1..256)`);
  }
  let result = resultBuffer[length];
  if (!result) {
    result = new Uint8Array(length);
    resultBuffer[length] = result;
  }
  let randomLength = length;
  let randomStart = 0;
  if (time) {
    if (length < TIMESTAMP_CHARS + 1) {
      const reason = `for time=true (minimum ${TIMESTAMP_CHARS + 1}`;
      throw new Error(`Incorrect GSID length ${length} (${reason})`);
    }
    encodeTimestamp48(Date.now(), result);
    randomLength = length - TIMESTAMP_CHARS;
    randomStart = TIMESTAMP_CHARS;
  }
  if (bufferPos + randomLength > randomBuffer.length) {
    crypto.getRandomValues(randomBuffer);
    bufferPos = 0;
  }
  const start = bufferPos;
  bufferPos += randomLength;
  for (let i = 0; i < randomLength; i++) {
    result[i + randomStart] = POSSIBLE[randomBuffer[start + i]];
  }
  return new TextDecoder().decode(result);
};

export { generateId, encodeTimestamp48, decodeTimestamp48 };
