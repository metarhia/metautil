// error.js

class Error extends globalThis.Error {
  constructor(message, options = {}) {
    super(message);
    const hasOptions = options !== null && typeof options === 'object';
    const opts = hasOptions ? options : { code: options };
    const { code, cause, name = new.target.name } = opts;
    this.code = code;
    this.cause = cause;
    this.name = name;
  }
}

class DomainError extends Error {
  constructor(code, options = {}) {
    const hasCode = typeof code !== 'object';
    const opt = hasCode ? { ...options, code } : code;
    super('Domain error', opt);
  }

  toError(errors) {
    const { code, cause } = this;
    const message = errors[this.code] ?? this.message;
    return new Error(message, { code, cause });
  }
}

const isError = (err) => err?.constructor?.name?.includes('Error') === true;

// strings.js

const replace = (str, substr, newstr) => {
  if (substr === '') return str;
  let index = str.indexOf(substr);
  if (index === -1) return str;
  const step = substr.length;
  let result = '';
  let from = 0;
  while (index !== -1) {
    result += str.substring(from, index);
    result += newstr;
    from = index + step;
    index = str.indexOf(substr, from);
  }
  return result + str.substring(from);
};

const between = (s, prefix, suffix) => {
  let i = s.indexOf(prefix);
  if (i === -1) return '';
  s = s.substring(i + prefix.length);
  if (suffix !== undefined && suffix !== '') {
    i = s.indexOf(suffix);
    if (i === -1) return '';
    s = s.substring(0, i);
  }
  return s;
};

const split = (s, separator) => {
  const i = s.indexOf(separator);
  if (i < 0) return [s, ''];
  return [s.slice(0, i), s.slice(i + separator.length)];
};

const inRange = (x, min, max) => x >= min && x <= max;

const isFirstUpper = (s) => s.length > 0 && inRange(s[0], 'A', 'Z');

const isFirstLower = (s) => s.length > 0 && inRange(s[0], 'a', 'z');

const isFirstLetter = (s) => isFirstUpper(s) || isFirstLower(s);

const toLowerCamel = (s) => s.charAt(0).toLowerCase() + s.slice(1);

const toUpperCamel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const toLower = (s) => s.toLowerCase();

const toCamel = (separator) => (s) => {
  const words = s.split(separator);
  const first = words.length > 0 ? words.shift().toLowerCase() : '';
  return first + words.map(toLower).map(toUpperCamel).join('');
};

const spinalToCamel = toCamel('-');

const snakeToCamel = toCamel('_');

const isConstant = (s) => s === s.toUpperCase();

const fileExt = (fileName) => {
  const dot = fileName.lastIndexOf('.');
  const slash = fileName.lastIndexOf('/');
  if (slash > dot) return '';
  return fileName.substring(dot + 1).toLowerCase();
};

const trimLines = (s) => {
  const chunks = s.split('\n').map((d) => d.trim());
  return chunks.filter((d) => d !== '').join('\n');
};

// array.js

const sample = (array, random = Math.random) => {
  const index = Math.floor(random() * array.length);
  return array[index];
};

const shuffle = (array, random = Math.random) => {
  // Based on Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const projection = (source, fields) => {
  const result = {};
  for (const key of fields) {
    if (Object.hasOwn(source, key)) {
      result[key] = source[key];
    }
  }
  return result;
};

// async.js

const toBool = [() => true, () => false];

const timeoutError = (msec) =>
  new Error(`Timeout of ${String(msec)}ms reached`, 'ETIMEOUT');

const abortable = (msec, signal, label, onElapsed) =>
  new Promise((resolve, reject) => {
    const message = `${label} aborted`;
    if (signal !== null && signal.aborted) {
      return void reject(new Error(message, { name: 'AbortError' }));
    }
    let timer = null;
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error(message, { name: 'AbortError' }));
    };
    timer = setTimeout(() => {
      if (signal !== null) signal.removeEventListener('abort', onAbort);
      onElapsed(resolve, reject);
    }, msec);
    if (signal !== null) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });

const timeout = (msec, signal = null) =>
  abortable(msec, signal, 'Timeout', (resolve, reject) => {
    reject(timeoutError(msec));
  });

const delay = (msec, signal = null) =>
  abortable(msec, signal, 'Delay', (resolve) => {
    resolve();
  });

const timeoutify = (promise, msec) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(timeoutError(msec));
    }, msec);
    promise.then(resolve, reject).finally(() => {
      clearTimeout(timer);
    });
  });

const createDeferred = (fn) => ({ fn, timer: null, args: null });

const invokeDeferred = (deferred) => {
  deferred.fn(...deferred.args);
  deferred.args = null;
};

const deferredControls = (deferred, wrapped) => ({
  fn: wrapped,
  cancel: () => {
    clearTimeout(deferred.timer);
    deferred.timer = null;
    deferred.args = null;
  },
  flush: () => {
    if (deferred.timer === null) return;
    clearTimeout(deferred.timer);
    deferred.timer = null;
    if (deferred.args !== null) invokeDeferred(deferred);
  },
});

const throttle = (fn, msec) => {
  const deferred = createDeferred(fn);

  const tick = () => {
    deferred.timer = null;
    if (deferred.args === null) return;
    invokeDeferred(deferred);
    deferred.timer = setTimeout(tick, msec);
  };

  const wrapped = (...args) => {
    deferred.args = args;
    if (deferred.timer !== null) return;
    invokeDeferred(deferred);
    deferred.timer = setTimeout(tick, msec);
  };

  return deferredControls(deferred, wrapped);
};

const debounce = (fn, msec) => {
  const deferred = createDeferred(fn);

  const elapsed = () => {
    deferred.timer = null;
    invokeDeferred(deferred);
  };

  const wrapped = (...args) => {
    deferred.args = args;
    clearTimeout(deferred.timer);
    deferred.timer = setTimeout(elapsed, msec);
  };

  return deferredControls(deferred, wrapped);
};

// datetime.js

const DURATION_UNITS = {
  d: 86400,
  h: 3600,
  m: 60,
  s: 1,
};

const duration = (s) => {
  if (typeof s === 'number') return s;
  if (typeof s !== 'string') return 0;
  let result = 0;
  const parts = s.split(' ');
  for (const part of parts) {
    const unit = part.slice(-1);
    const digits = part.slice(0, -1);
    const value = parseInt(digits, 10);
    const mult = DURATION_UNITS[unit];
    if (!Number.isNaN(value) && mult !== undefined) result += value * mult;
  }
  return result * 1000;
};

const twoDigit = (n) => n.toString().padStart(2, '0');

const utcDate = (date) => {
  const yyyy = date.getUTCFullYear().toString();
  const mm = twoDigit(date.getUTCMonth() + 1);
  const dd = twoDigit(date.getUTCDate());
  return `${yyyy}-${mm}-${dd}`;
};

const nowDate = (date = new Date()) => utcDate(date);

const nowDateTimeUTC = (date = new Date(), timeSep = ':') => {
  const hh = twoDigit(date.getUTCHours());
  const min = twoDigit(date.getUTCMinutes());
  const ss = twoDigit(date.getUTCSeconds());
  return `${utcDate(date)}T${hh}${timeSep}${min}${timeSep}${ss}`;
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const NAME_LEN = 3;

const parseName = (names) => (s) => {
  const name = s.substring(0, NAME_LEN);
  const i = names.indexOf(name);
  return i >= 0 ? i + 1 : -1;
};

const parseMonth = parseName(MONTHS);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseDay = parseName(DAYS);

const ORDINAL = ['st', 'nd', 'rd', 'th'];

const isOrdinal = (s) => ORDINAL.some((d) => s.endsWith(d));

const YEAR_LEN = 4;

const parseEvery = (s = '') => {
  let YY = -1;
  let MM = -1;
  let DD = -1;
  let wd = -1;
  let hh = -1;
  let mm = -1;
  let ms = 0;
  const parts = s.split(' ');
  for (const part of parts) {
    if (part.includes(':')) {
      const hm = split(part, ':');
      const h = hm[0];
      const m = hm[1];
      if (h !== '') hh = parseInt(h, 10);
      mm = m === '' ? 0 : parseInt(m, 10);
      continue;
    }
    if (isOrdinal(part)) {
      DD = parseInt(part, 10);
      continue;
    }
    if (part.length === YEAR_LEN) {
      YY = parseInt(part, 10);
      continue;
    }
    if (MM === -1) {
      MM = parseMonth(part);
      if (MM > -1) continue;
    }
    if (wd === -1) {
      wd = parseDay(part);
      if (wd > -1) continue;
    }
    const unit = part.slice(-1);
    const mult = DURATION_UNITS[unit];
    if (typeof mult === 'number') {
      const value = parseInt(part, 10);
      if (!Number.isNaN(value)) ms += value * mult;
    }
  }
  return { YY, MM, DD, wd, hh, mm, ms: ms > 0 ? ms * 1000 : -1 };
};

const nextEvent = (ev, d = new Date()) => {
  let ms = 0;
  const Y = d.getUTCFullYear();
  const M = d.getUTCMonth() + 1;
  const D = d.getUTCDate();
  const w = d.getUTCDay() + 1;
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();

  const iY = ev.YY > -1;
  const iM = ev.MM > -1;
  const iD = ev.DD > -1;
  const iw = ev.wd > -1;
  const ih = ev.hh > -1;
  const im = ev.mm > -1;
  const ims = ev.ms > -1;

  if (iY && ev.YY !== Y) return ev.YY < Y ? -1 : 0;
  if (iM && ev.MM !== M) return ev.MM < M ? -1 : 0;
  if (iD && ev.DD !== D) return ev.DD < D ? -1 : 0;
  if (iw && ev.wd !== w) return 0;
  const hourPassed = ev.hh < h;
  const minutePassed = ev.hh === h && im && ev.mm < m;
  if (ih && (hourPassed || minutePassed)) return -1;

  if (ih) ms += (ev.hh - h) * DURATION_UNITS.h;
  if (im) ms += (ev.mm - m) * DURATION_UNITS.m;

  ms *= 1000;
  if (ims) ms += ev.ms;
  return ms;
};

// objects.js

const makePrivate = (instance) => {
  const iface = {};
  const fields = Object.keys(instance);
  for (const fieldName of fields) {
    const field = instance[fieldName];
    if (isConstant(fieldName)) {
      iface[fieldName] = field;
    } else if (typeof field === 'function') {
      const boundMethod = field.bind(instance);
      iface[fieldName] = boundMethod;
      instance[fieldName] = boundMethod;
    }
  }
  return iface;
};

const protect = (allowMixins, ...namespaces) => {
  for (const namespace of namespaces) {
    const names = Object.keys(namespace);
    for (const name of names) {
      const target = namespace[name];
      if (!allowMixins.includes(name)) Object.freeze(target);
    }
  }
};

const jsonParse = (data = null) => {
  if (data === null) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const isHashObject = (o) =>
  typeof o === 'object' && o !== null && !Array.isArray(o);

const flatObject = (source, fields = []) => {
  const target = {};
  for (const entry of Object.entries(source)) {
    const key = entry[0];
    const value = entry[1];
    if (!isHashObject(value)) {
      target[key] = value;
      continue;
    }
    if (fields.length > 0 && !fields.includes(key)) {
      target[key] = { ...value };
      continue;
    }
    for (const childEntry of Object.entries(value)) {
      const childKey = childEntry[0];
      const childValue = childEntry[1];
      const combined = `${key}${toUpperCamel(childKey)}`;
      if (source[combined] !== undefined) {
        const error = `Can not combine keys: key "${combined}" already exists`;
        throw new Error(error);
      }
      target[combined] = childValue;
    }
  }
  return target;
};

const unflatObject = (source, fields) => {
  const result = {};
  for (const entry of Object.entries(source)) {
    const key = entry[0];
    const value = entry[1];
    const prefix = fields.find((name) => key.startsWith(name));
    if (prefix !== undefined) {
      if (Object.hasOwn(source, prefix)) {
        throw new Error(`Can not combine keys: key "${prefix}" already exists`);
      }
      const newKey = key.substring(prefix.length).toLowerCase();
      const section = result[prefix];
      if (section !== undefined) section[newKey] = value;
      else result[prefix] = { [newKey]: value };
      continue;
    }
    result[key] = value;
  }
  return result;
};

const getSignature = (method) => {
  const src = method.toString();
  const signature = between(src, '({', '})');
  if (signature === '') return [];
  return signature.split(',').map((s) => s.trim());
};

const namespaceByPath = (namespace, path) => {
  const parts = split(path, '.');
  const key = parts[0];
  const rest = parts[1];
  const step = namespace[key];
  if (step === undefined || step === null) return null;
  if (rest === '') return step;
  return namespaceByPath(step, rest);
};

const serializeArguments = (fields, args) => {
  if (fields === undefined || fields === null) return '';
  const data = {};
  for (const par of fields) {
    data[par] = args[par];
  }
  return JSON.stringify(data);
};

const firstKey = (obj) => Object.keys(obj).find(isFirstLetter);

const isInstanceOf = (obj, constrName) => obj?.constructor?.name === constrName;

// collector.js

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  reassign = false;
  timeout = 0;
  defaults = {};
  validate = null;
  #fulfill = null;
  #reject = null;
  #cause = null;
  #controller = null;
  #signal = null;

  constructor(keys, options = {}) {
    const { exact = true, reassign = false } = options;
    const { timeout = 0, defaults = {}, validate = null } = options;
    this.validate = validate;
    this.keys = keys;
    this.exact = Boolean(exact);
    this.reassign = Boolean(reassign);
    if (typeof defaults === 'object') this.defaults = defaults;
    this.#controller = new AbortController();
    this.#signal = this.#controller.signal;
    if (typeof timeout === 'number') {
      this.timeout = timeout;
      if (timeout > 0) {
        const timer = AbortSignal.timeout(timeout);
        this.#signal = AbortSignal.any([this.#signal, timer]);
        this.#signal.addEventListener('abort', () => {
          this.#default();
          if (this.done) return;
          this.fail(this.#signal.reason);
        });
      }
    }
  }

  #default() {
    const { defaults, data } = this;
    const keys = Object.keys(defaults);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (data[key] === undefined) this.set(key, defaults[key]);
    }
  }

  get signal() {
    return this.#signal;
  }

  set(key, value) {
    if (this.done) return;
    const expected = this.keys.includes(key);
    if (!expected && this.exact) {
      this.fail(new Error(`Unexpected key: ${key}`));
      return;
    }
    const has = this.data[key] !== undefined;
    if (has && !this.reassign) {
      const error = new Error('Collector reassign mode is off');
      return void this.fail(error);
    }
    if (!has && expected) this.count++;
    this.data[key] = value;
    if (this.count === this.keys.length) {
      this.done = true;
      if (this.validate !== null) {
        try {
          this.validate(this.data);
        } catch (error) {
          this.#cause = error;
        }
      }
      this.#finish();
    }
  }

  take(key, fn, ...args) {
    fn(...args, (error, data) => {
      if (error !== null && error !== undefined) this.fail(error);
      else this.set(key, data);
    });
  }

  wait(key, fn, ...args) {
    const promise = fn instanceof Promise ? fn : fn(...args);
    this.#await(key, promise);
  }

  collect(sources) {
    const keys = Object.keys(sources);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this.#await(key, sources[key]);
    }
  }

  #await(key, thenable) {
    thenable.then(
      (data) => this.set(key, data),
      (error) => this.fail(error),
    );
  }

  fail(error) {
    this.done = true;
    const cause = error ?? new Error('Collector aborted');
    this.#cause = cause;
    this.#controller.abort();
    if (this.#reject !== null) this.#reject(cause);
  }

  abort() {
    this.fail();
  }

  #finish() {
    if (this.#cause !== null) {
      if (this.#reject !== null) this.#reject(this.#cause);
    } else if (this.#fulfill !== null) {
      this.#fulfill(this.data);
    }
  }

  then(onFulfilled, onRejected = null) {
    return new Promise((resolve, reject) => {
      this.#fulfill = resolve;
      this.#reject = reject;
      if (this.done) this.#finish();
    }).then(onFulfilled, onRejected);
  }
}

const collect = (keys, options) => new Collector(keys, options);

// events.js

const DONE = { done: true, value: undefined };
const DEFAULT_MAX_LISTENERS = 10;

class EventIterator {
  #resolvers = [];
  #emitter = null;
  #eventName = '';
  #listener = null;
  #onerror = null;
  #done = false;

  constructor(emitter, eventName) {
    this.#emitter = emitter;
    this.#eventName = eventName;

    this.#listener = (value) => {
      const resolvers = this.#resolvers;
      this.#resolvers = [];
      for (const resolver of resolvers) {
        resolver.resolve({ done: false, value });
      }
    };
    emitter.on(eventName, this.#listener);

    this.#onerror = (error) => {
      const resolvers = this.#resolvers;
      this.#resolvers = [];
      for (const resolver of resolvers) {
        resolver.reject(error);
      }
      this.#finalize();
    };
    emitter.on('error', this.#onerror);
  }

  next() {
    return new Promise((resolve, reject) => {
      if (this.#done) return void resolve(DONE);
      this.#resolvers.push({ resolve, reject });
    });
  }

  #finalize() {
    if (this.#done) return;
    this.#done = true;
    this.#emitter.off(this.#eventName, this.#listener);
    this.#emitter.off('error', this.#onerror);
    for (const resolver of this.#resolvers) {
      resolver.resolve(DONE);
    }
    this.#resolvers.length = 0;
  }

  async return() {
    this.#finalize();
    return DONE;
  }

  async throw() {
    this.#finalize();
    return DONE;
  }
}

class EventIterable {
  #emitter = null;
  #eventName = '';

  constructor(emitter, eventName) {
    this.#emitter = emitter;
    this.#eventName = eventName;
  }

  [Symbol.asyncIterator]() {
    return new EventIterator(this.#emitter, this.#eventName);
  }
}

class Emitter {
  #events = new Map();
  #maxListeners = DEFAULT_MAX_LISTENERS;

  constructor(options = {}) {
    this.#maxListeners = options.maxListeners ?? DEFAULT_MAX_LISTENERS;
  }

  emit(eventName, value) {
    const event = this.#events.get(eventName);
    if (event === undefined) {
      if (eventName !== 'error') return Promise.resolve();
      throw new Error('Unhandled error');
    }
    const listeners = event.on.slice();
    const promises = listeners.map(async (fn) => fn(value));
    const { on, once } = event;
    if (once.size > 0) {
      const remaining = [];
      for (let i = 0; i < on.length; i++) {
        const listener = on[i];
        if (!once.has(listener)) remaining.push(listener);
      }
      if (remaining.length === 0) {
        this.#events.delete(eventName);
      } else {
        this.#events.set(eventName, { on: remaining, once: new Set() });
      }
    }
    return Promise.all(promises).then(() => undefined);
  }

  #addListener(eventName, listener, once) {
    let event = this.#events.get(eventName);
    if (event === undefined) {
      event = { on: [], once: new Set() };
      this.#events.set(eventName, event);
    } else if (event.on.includes(listener)) {
      throw new Error('Duplicate listeners detected');
    }
    event.on.push(listener);
    if (once) event.once.add(listener);
    if (event.on.length > this.#maxListeners) {
      const max = String(this.#maxListeners);
      throw new Error(
        `MaxListenersExceededWarning: Possible memory leak. ` +
          `Current maxListeners is ${max}.`,
      );
    }
  }

  on(eventName, listener) {
    this.#addListener(eventName, listener, false);
  }

  once(eventName, listener) {
    this.#addListener(eventName, listener, true);
  }

  off(eventName, listener) {
    if (listener === undefined || listener === null) {
      return void this.#events.delete(eventName);
    }
    const event = this.#events.get(eventName);
    if (event === undefined) return;
    const index = event.on.indexOf(listener);
    if (index > -1) event.on.splice(index, 1);
    event.once.delete(listener);
  }

  toPromise(eventName) {
    return new Promise((resolve) => {
      this.once(eventName, resolve);
    });
  }

  toAsyncIterable(eventName) {
    return new EventIterable(this, eventName);
  }

  clear(eventName) {
    if (eventName === undefined) return void this.#events.clear();
    this.#events.delete(eventName);
  }

  listeners(eventName) {
    if (eventName === undefined) throw new Error('Expected eventName');
    const event = this.#events.get(eventName);
    return event === undefined ? [] : event.on;
  }

  listenerCount(eventName) {
    return this.listeners(eventName).length;
  }

  eventNames() {
    const names = this.#events.keys();
    return Array.from(names);
  }
}

// http.js

const parseHost = (host) => {
  if (host === undefined || host === '') return 'no-host-name-in-http-headers';
  if (host.startsWith('[')) {
    const end = host.indexOf(']');
    if (end === -1) return host;
    return host.substring(1, end);
  }
  const portOffset = host.indexOf(':');
  if (portOffset > -1) return host.substring(0, portOffset);
  return host;
};

const parseParams = (params) => {
  const searchParams = new URLSearchParams(params);
  return Object.fromEntries(searchParams);
};

const parseCookies = (cookie) => {
  const values = [];
  const items = cookie.split(';');
  for (const item of items) {
    const parts = item.split('=');
    const key = parts[0].trim();
    const val = (parts[1] ?? '').trim();
    values.push([key, val]);
  }
  return Object.fromEntries(values);
};

const parseRange = (range) => {
  if (range?.includes('=') !== true) return {};
  const bytes = range.split('=').pop();
  if (bytes === '' || !range.includes('-')) return {};
  const bounds = bytes.split('-');
  const start = parseInt(bounds[0], 10);
  const end = parseInt(bounds[1], 10);
  if (Number.isNaN(start)) return Number.isNaN(end) ? {} : { tail: end };
  return Number.isNaN(end) ? { start } : { start, end };
};

// pool.js

class Lease {
  #resource = null;
  #release = null;
  #released = false;

  constructor(resource, release) {
    this.#resource = resource;
    this.#release = release;
  }

  get resource() {
    return this.#resource;
  }

  release() {
    if (this.#released) {
      throw new Error('Pool: release already released');
    }
    this.#released = true;
    this.#release();
  }
}

class Pool {
  #items = [];
  #free = [];
  #queue = [];
  #leases = new WeakSet();
  #timeout = 0;
  #current = 0;
  #available = 0;

  constructor(options = {}) {
    if (typeof options.timeout === 'number') {
      this.#timeout = options.timeout;
    }
  }

  next() {
    const index = this.#nextFreeIndex();
    return index === -1 ? null : this.#items[index];
  }

  capture() {
    if (this.#items.length === 0) return null;
    if (this.#available === 0) {
      return new Promise((resolve, reject) => {
        const waiting = { resolve, timer: null };
        if (this.#timeout > 0) {
          waiting.timer = setTimeout(() => {
            const position = this.#queue.indexOf(waiting);
            this.#queue.splice(position, 1);
            reject(new Error('Pool next item timeout'));
          }, this.#timeout);
        }
        this.#queue.push(waiting);
      });
    }
    return this.#takeLease();
  }

  release(lease) {
    if (!this.#leases.has(lease)) {
      throw new Error('Pool: release unexpected lease');
    }
    lease.release();
  }

  isFree(resource) {
    const index = this.#items.indexOf(resource);
    return index === -1 ? false : this.#free[index];
  }

  add(resource) {
    if (this.#items.indexOf(resource) !== -1) {
      throw new Error('Pool: add duplicates');
    }
    this.#items.push(resource);
    this.#free.push(true);
    this.#available++;
  }

  #nextFreeIndex() {
    if (this.#available === 0) return -1;
    const size = this.#items.length;
    for (let attempts = 0; attempts < size; attempts++) {
      const index = this.#current;
      this.#current = index + 1 === size ? 0 : index + 1;
      if (this.#free[index]) return index;
    }
    return -1;
  }

  #takeLease() {
    const index = this.#nextFreeIndex();
    if (index === -1) return null;
    this.#free[index] = false;
    this.#available--;
    return this.#createLease(this.#items[index], index);
  }

  #createLease(resource, index) {
    const lease = new Lease(resource, () => {
      this.#releaseResource(resource, index);
    });
    this.#leases.add(lease);
    return lease;
  }

  #releaseResource(resource, index) {
    const waiting = this.#queue.shift();
    if (waiting !== undefined) {
      clearTimeout(waiting.timer);
      const lease = this.#createLease(resource, index);
      waiting.resolve(lease);
      return;
    }
    this.#free[index] = true;
    this.#available++;
  }
}

// result.js

const NO_DEFAULT = Symbol('NoDefault');

class Result {
  #value = null;
  #error = null;

  constructor(value = null, error = null) {
    this.#value = value;
    this.#error = error;
  }

  static ok(value = null) {
    return new Result(value, null);
  }

  static fail(error) {
    return new Result(null, error);
  }

  static from(fn) {
    try {
      const value = fn();
      return Result.ok(value);
    } catch (error) {
      return Result.fail(error);
    }
  }

  static async fromAsync(fn) {
    try {
      const value = await fn();
      return Result.ok(value);
    } catch (error) {
      return Result.fail(error);
    }
  }

  get value() {
    return this.#value;
  }

  get error() {
    return this.#error;
  }

  get ok() {
    return this.#error === null;
  }

  match({ ok, fail }) {
    if (this.#error !== null) return fail(this.#error);
    return ok(this.#value);
  }

  [Symbol.toPrimitive]() {
    return this.#error === null;
  }

  unwrap(defaultValue = NO_DEFAULT) {
    if (this.#error === null) return this.#value;
    if (defaultValue === NO_DEFAULT) throw this.#error;
    return defaultValue;
  }

  map(fn) {
    if (this.#error !== null) return this;
    return Result.from(() => fn(this.#value));
  }
}

// semaphore.js

class Semaphore {
  constructor({ concurrency, size = 0, timeout = 0 }) {
    this.concurrency = concurrency;
    this.counter = concurrency;
    this.timeout = timeout;
    this.size = size;
    this.queue = [];
  }

  get empty() {
    return this.queue.length === 0 && this.counter === this.concurrency;
  }

  enter() {
    return new Promise((resolve, reject) => {
      if (this.counter > 0) {
        this.counter--;
        return void resolve();
      }
      if (this.queue.length >= this.size) {
        return void reject(new Error('Semaphore queue is full'));
      }
      const waiting = { resolve, timer: null };
      if (this.timeout > 0) {
        waiting.timer = setTimeout(() => {
          const position = this.queue.indexOf(waiting);
          this.queue.splice(position, 1);
          reject(new Error('Semaphore timeout'));
        }, this.timeout);
      }
      this.queue.push(waiting);
    });
  }

  leave() {
    if (this.queue.length === 0) {
      this.counter++;
      return;
    }
    const { resolve, timer } = this.queue.shift();
    clearTimeout(timer);
    resolve();
  }
}

// units.js

const SIZE_UNITS = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const bytesToSize = (bytes) => {
  if (bytes === 0) return '0';
  const exp = Math.floor(Math.log(bytes) / Math.log(1000));
  const size = bytes / 1000 ** exp;
  const short = Math.round(size);
  const unit = exp === 0 ? '' : ` ${SIZE_UNITS[exp - 1]}`;
  return `${String(short)}${unit}`;
};

const UNIT_SIZES = {
  yb: 24, // yottabyte
  zb: 21, // zettabyte
  eb: 18, // exabyte
  pb: 15, // petabyte
  tb: 12, // terabyte
  gb: 9, // gigabyte
  mb: 6, // megabyte
  kb: 3, // kilobyte
};

const sizeToBytes = (size) => {
  const unit = size.slice(-2).toLowerCase();
  const value = parseInt(size, 10);
  const exp = UNIT_SIZES[unit];
  if (exp === undefined) return value;
  return value * 10 ** exp;
};

// circular.js

const INITIAL_CAPACITY = 16;

class CircularBuffer {
  #buffer = new Array(INITIAL_CAPACITY);
  #head = 0;
  #size = 0;

  get size() {
    return this.#size;
  }

  static fromArray(values) {
    const circular = new CircularBuffer();
    const { length } = values;
    let capacity = INITIAL_CAPACITY;
    while (capacity <= length) capacity *= 2;
    const buffer = new Array(capacity);
    for (let i = 0; i < length; i++) buffer[i] = values[i];
    circular.#buffer = buffer;
    circular.#size = length;
    return circular;
  }

  #grow() {
    const buffer = this.#buffer;
    const capacity = buffer.length;
    const mask = capacity - 1;
    const head = this.#head;
    const next = new Array(capacity * 2);
    for (let i = 0; i < this.#size; i++) {
      next[i] = buffer[(head + i) & mask];
    }
    this.#buffer = next;
    this.#head = 0;
  }

  unshift(value = undefined) {
    if (this.#size === this.#buffer.length) this.#grow();
    const head = (this.#head - 1) & (this.#buffer.length - 1);
    this.#buffer[head] = value;
    this.#head = head;
    this.#size++;
  }

  push(value = undefined) {
    if (this.#size === this.#buffer.length) this.#grow();
    const tail = (this.#head + this.#size) & (this.#buffer.length - 1);
    this.#buffer[tail] = value;
    this.#size++;
  }

  shift() {
    let value;
    if (this.#size > 0) {
      const head = this.#head;
      value = this.#buffer[head];
      this.#buffer[head] = undefined;
      this.#head = (head + 1) & (this.#buffer.length - 1);
      this.#size--;
    }
    return value;
  }

  pop() {
    let value;
    if (this.#size > 0) {
      const mask = this.#buffer.length - 1;
      const tail = (this.#head + this.#size - 1) & mask;
      value = this.#buffer[tail];
      this.#buffer[tail] = undefined;
      this.#size--;
    }
    return value;
  }

  at(index) {
    const size = this.#size;
    const i = index < 0 ? size + index : index;
    const inRange = i >= 0 && i < size;
    const mask = this.#buffer.length - 1;
    return inRange ? this.#buffer[(this.#head + i) & mask] : undefined;
  }

  isEmpty() {
    return this.#size === 0;
  }

  includes(value) {
    const buffer = this.#buffer;
    const mask = buffer.length - 1;
    const head = this.#head;
    for (let i = 0; i < this.#size; i++) {
      if (buffer[(head + i) & mask] === value) return true;
    }
    return false;
  }

  every(fn) {
    const buffer = this.#buffer;
    const mask = buffer.length - 1;
    const head = this.#head;
    for (let i = 0; i < this.#size; i++) {
      const offset = (head + i) & mask;
      const value = buffer[offset];
      if (!fn(value, i)) return false;
    }
    return true;
  }

  reduce(fn, acc) {
    const size = this.#size;
    const buffer = this.#buffer;
    const mask = buffer.length - 1;
    const head = this.#head;
    let index = 0;
    let result = acc;
    if (acc === undefined) {
      if (size === 0) throw new TypeError('CircularBuffer is empty');
      result = buffer[head];
      index = 1;
    }
    for (; index < size; index++) {
      const offset = (head + index) & mask;
      const value = buffer[offset];
      result = fn(result, value, index);
    }
    return result;
  }

  clear() {
    this.#buffer = new Array(INITIAL_CAPACITY);
    this.#head = 0;
    this.#size = 0;
  }

  toArray() {
    const buffer = this.#buffer;
    const mask = buffer.length - 1;
    const head = this.#head;
    const size = this.#size;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = buffer[(head + i) & mask];
    }
    return result;
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index >= this.#size) return { done: true, value: undefined };
        const mask = this.#buffer.length - 1;
        const value = this.#buffer[(this.#head + index) & mask];
        index++;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

// deque.js

class Deque {
  #buffer = new CircularBuffer();

  get size() {
    return this.#buffer.size;
  }

  static fromArray(values) {
    const deque = new Deque();
    deque.#buffer = CircularBuffer.fromArray(values);
    return deque;
  }

  unshift(value = undefined) {
    this.#buffer.unshift(value);
  }

  push(value = undefined) {
    this.#buffer.push(value);
  }

  shift() {
    return this.#buffer.shift();
  }

  pop() {
    return this.#buffer.pop();
  }

  isEmpty() {
    return this.#buffer.isEmpty();
  }

  includes(value) {
    return this.#buffer.includes(value);
  }

  every(fn) {
    return this.#buffer.every(fn);
  }

  reduce(fn, acc) {
    return this.#buffer.reduce(fn, acc);
  }

  clear() {
    this.#buffer.clear();
  }

  toArray() {
    return this.#buffer.toArray();
  }

  [Symbol.iterator]() {
    return this.#buffer[Symbol.iterator]();
  }
}

// queue.js

class Queue {
  #buffer = new CircularBuffer();

  get size() {
    return this.#buffer.size;
  }

  static fromArray(values) {
    const queue = new Queue();
    queue.#buffer = CircularBuffer.fromArray(values);
    return queue;
  }

  enqueue(value = undefined) {
    this.#buffer.push(value);
  }

  dequeue() {
    return this.#buffer.shift();
  }

  peek() {
    return this.#buffer.at(0);
  }

  isEmpty() {
    return this.#buffer.isEmpty();
  }

  includes(value) {
    return this.#buffer.includes(value);
  }

  clear() {
    this.#buffer.clear();
  }

  toArray() {
    return this.#buffer.toArray();
  }

  [Symbol.iterator]() {
    return this.#buffer[Symbol.iterator]();
  }
}

// stack.js

class Stack {
  #buffer = new CircularBuffer();

  get size() {
    return this.#buffer.size;
  }

  static fromArray(values) {
    const stack = new Stack();
    stack.#buffer = CircularBuffer.fromArray(values);
    return stack;
  }

  push(value = undefined) {
    this.#buffer.push(value);
  }

  pop() {
    return this.#buffer.pop();
  }

  peek() {
    return this.#buffer.at(-1);
  }

  isEmpty() {
    return this.#buffer.isEmpty();
  }

  includes(value) {
    return this.#buffer.includes(value);
  }

  every(fn) {
    return this.#buffer.every(fn);
  }

  reduce(fn, acc) {
    return this.#buffer.reduce(fn, acc);
  }

  clear() {
    this.#buffer.clear();
  }

  toArray() {
    return this.#buffer.toArray();
  }

  [Symbol.iterator]() {
    return this.#buffer[Symbol.iterator]();
  }
}

// list.js

const compareAsc = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const clampIndex = (index, size) => {
  const at = index < 0 ? index + size : index;
  if (at < 0) return 0;
  return at > size ? size : at;
};

class ListNode {
  static fromArray(values) {
    const { length } = values;
    if (length === 0) return { head: null, tail: null, size: 0 };
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    return { head, tail, size: length };
  }

  static copy(node, count) {
    if (!Number.isInteger(count) || count <= 0) {
      return { head: null, tail: null, next: node, size: 0 };
    }
    const head = new ListNode(node.value);
    let tail = head;
    let current = node.next;
    for (let i = 1; i < count; i++) {
      const copied = new ListNode(current.value);
      copied.prev = tail;
      tail.next = copied;
      tail = copied;
      current = current.next;
    }
    return { head, tail, next: current, size: count };
  }

  static link(left, right) {
    if (left !== null) left.next = right;
    if (right !== null) right.prev = left;
  }

  static create(value, prev = null, next = null) {
    const node = new ListNode(value);
    node.prev = prev;
    node.next = next;
    if (prev !== null) prev.next = node;
    if (next !== null) next.prev = node;
    return node;
  }

  constructor(value = undefined) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }

  append(value = undefined) {
    return ListNode.create(value, this, this.next);
  }

  prepend(value = undefined) {
    return ListNode.create(value, this.prev, this);
  }

  unlink() {
    const prev = this.prev;
    const next = this.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    this.prev = null;
    this.next = null;
    return { prev, next };
  }

  seek(n = 0) {
    if (!Number.isInteger(n)) return null;
    let node = this;
    if (n > 0) {
      for (let i = 0; i < n && node !== null; i++) node = node.next;
    } else if (n < 0) {
      for (let i = 0; i > n && node !== null; i--) node = node.prev;
    }
    return node;
  }
}

class List {
  #head = null;
  #tail = null;
  #size = 0;

  static #create(head, tail, size) {
    const list = new List();
    list.#head = head;
    list.#tail = tail;
    list.#size = size;
    return list;
  }

  get size() {
    return this.#size;
  }

  static of(...values) {
    return List.fromArray(values);
  }

  static fromArray(values) {
    const { head, tail, size } = ListNode.fromArray(values);
    return List.#create(head, tail, size);
  }

  static merge(...lists) {
    const result = new List();
    const { length } = lists;
    for (let i = 0; i < length; i++) {
      let node = lists[i].#head;
      while (node !== null) {
        const item = new ListNode(node.value);
        const tail = result.#tail;
        if (tail === null) {
          result.#head = item;
        } else {
          tail.next = item;
          item.prev = tail;
        }
        result.#tail = item;
        result.#size++;
        node = node.next;
      }
    }
    return result;
  }

  #nodeAt(index) {
    if (!Number.isInteger(index)) return null;
    const size = this.#size;
    const at = index < 0 ? index + size : index;
    if (at < 0 || at >= size) return null;
    const fromEnd = size - 1 - at;
    if (at <= fromEnd) {
      let node = this.#head;
      for (let i = 0; i < at; i++) node = node.next;
      return node;
    }
    let node = this.#tail;
    for (let i = 0; i < fromEnd; i++) node = node.prev;
    return node;
  }

  #detachRange(first, last, count) {
    const prev = first.prev;
    const next = last.next;
    if (prev === null) this.#head = next;
    else prev.next = next;
    if (next === null) this.#tail = prev;
    else next.prev = prev;
    first.prev = null;
    last.next = null;
    this.#size -= count;
  }

  // `before === null` attaches the chain at the tail
  #attach(head, tail, count, before) {
    const prev = before === null ? this.#tail : before.prev;
    if (prev === null) {
      this.#head = head;
    } else {
      prev.next = head;
      head.prev = prev;
    }
    if (before === null) {
      this.#tail = tail;
    } else {
      tail.next = before;
      before.prev = tail;
    }
    this.#size += count;
  }

  static #copyFrom(node, count) {
    const { head, tail, size } = ListNode.copy(node, count);
    return List.#create(head, tail, size);
  }

  append(...values) {
    const { length } = values;
    if (length === 0) return;
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    const last = this.#tail;
    if (last === null) {
      this.#head = head;
    } else {
      last.next = head;
      head.prev = last;
    }
    this.#tail = tail;
    this.#size += length;
  }

  prepend(...values) {
    const { length } = values;
    if (length === 0) return;
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    const first = this.#head;
    if (first === null) {
      this.#tail = tail;
    } else {
      tail.next = first;
      first.prev = tail;
    }
    this.#head = head;
    this.#size += length;
  }

  insert(index, ...values) {
    if (!Number.isInteger(index)) return;
    const { length } = values;
    if (length === 0) return;
    const size = this.#size;
    const at = clampIndex(index, size);
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    const before = at === size ? null : this.#nodeAt(at);
    this.#attach(head, tail, length, before);
  }

  delete(index, count = 1) {
    if (!Number.isInteger(index)) return;
    if (!Number.isInteger(count) || count <= 0) return;
    const size = this.#size;
    const from = index < 0 ? index + size : index;
    if (from < 0 || from >= size) return;
    const actual = Math.min(count, size - from);
    const first = this.#nodeAt(from);
    let last = first;
    for (let i = 1; i < actual; i++) last = last.next;
    this.#detachRange(first, last, actual);
  }

  at(index) {
    const node = this.#nodeAt(index);
    return node === null ? undefined : node.value;
  }

  set(index, value) {
    const node = this.#nodeAt(index);
    if (node !== null) node.value = value;
  }

  drop(n) {
    if (!Number.isInteger(n) || n === 0) return;
    const size = this.#size;
    if (size === 0) return;
    if (n > 0) {
      if (n >= size) return void this.clear();
      const lastDropped = this.#nodeAt(n - 1);
      this.#detachRange(this.#head, lastDropped, n);
      return;
    }
    const count = -n;
    if (count >= size) return void this.clear();
    const firstDropped = this.#nodeAt(size - count);
    this.#detachRange(firstDropped, this.#tail, count);
  }

  take(n) {
    if (!Number.isInteger(n) || n === 0) return null;
    const size = this.#size;
    if (size === 0) return null;
    if (n > 0) {
      const count = Math.min(n, size);
      return List.#copyFrom(this.#head, count);
    }
    const count = Math.min(-n, size);
    const firstTaken = this.#nodeAt(size - count);
    return List.#copyFrom(firstTaken, count);
  }

  slice(start = 0, end) {
    if (!Number.isInteger(start)) return null;
    if (end !== undefined && !Number.isInteger(end)) return null;
    const size = this.#size;
    const from = clampIndex(start, size);
    const to = end === undefined ? size : clampIndex(end, size);
    if (from >= to) return null;
    const first = this.#nodeAt(from);
    return List.#copyFrom(first, to - from);
  }

  rotate(n = 1) {
    const size = this.#size;
    if (size <= 1 || !Number.isInteger(n)) return;
    const steps = ((n % size) + size) % size;
    if (steps === 0) return;
    const node = this.#nodeAt(steps);
    const head = this.#head;
    const tail = this.#tail;
    const prev = node.prev;
    tail.next = head;
    head.prev = tail;
    node.prev = null;
    prev.next = null;
    this.#head = node;
    this.#tail = prev;
  }

  swap(i, j) {
    const nodeI = this.#nodeAt(i);
    const nodeJ = this.#nodeAt(j);
    if (nodeI === null || nodeJ === null) return;
    const value = nodeI.value;
    nodeI.value = nodeJ.value;
    nodeJ.value = value;
  }

  move(from, to) {
    if (!Number.isInteger(from) || !Number.isInteger(to)) return;
    const size = this.#size;
    const f = from < 0 ? from + size : from;
    const t = to < 0 ? to + size : to;
    if (f < 0 || f >= size || t < 0 || t >= size || f === t) return;
    const node = this.#nodeAt(f);
    let before = null;
    if (t < size - 1) {
      const beforeIndex = f < t ? t + 1 : t;
      before = this.#nodeAt(beforeIndex);
    }
    this.#detachRange(node, node, 1);
    this.#attach(node, node, 1, before);
  }

  splitAt(index) {
    const size = this.#size;
    const at = Number.isInteger(index) ? clampIndex(index, size) : 0;
    const splitNode = this.#nodeAt(at);
    const before = List.#copyFrom(this.#head, at);
    const after = List.#copyFrom(splitNode, size - at);
    return { before, after };
  }

  groupBy(getKey) {
    const groups = new Map();
    let node = this.#head;
    while (node !== null) {
      const key = getKey(node.value);
      let group = groups.get(key);
      if (group === undefined) {
        group = new List();
        groups.set(key, group);
      }
      const item = new ListNode(node.value);
      const tail = group.#tail;
      if (tail === null) {
        group.#head = item;
      } else {
        tail.next = item;
        item.prev = tail;
      }
      group.#tail = item;
      group.#size++;
      node = node.next;
    }
    return groups;
  }

  includes(value) {
    let node = this.#head;
    while (node !== null) {
      if (node.value === value) return true;
      node = node.next;
    }
    return false;
  }

  indexOf(value) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (node.value === value) return index;
      node = node.next;
      index++;
    }
    return -1;
  }

  lastIndexOf(value) {
    let node = this.#tail;
    let index = this.#size - 1;
    while (node !== null) {
      if (node.value === value) return index;
      node = node.prev;
      index--;
    }
    return -1;
  }

  remove(...values) {
    const { length } = values;
    if (length === 0) return 0;
    let removed = 0;
    let node = this.#head;
    if (length === 1) {
      const target = values[0];
      while (node !== null) {
        const next = node.next;
        if (node.value === target) {
          this.#detachRange(node, node, 1);
          removed++;
        }
        node = next;
      }
      return removed;
    }
    while (node !== null) {
      const next = node.next;
      for (let i = 0; i < length; i++) {
        if (node.value === values[i]) {
          this.#detachRange(node, node, 1);
          removed++;
          break;
        }
      }
      node = next;
    }
    return removed;
  }

  replace(oldValue, newValue) {
    let node = this.#head;
    while (node !== null) {
      if (node.value === oldValue) {
        node.value = newValue;
      }
      node = node.next;
    }
  }

  reverse() {
    let node = this.#head;
    this.#head = this.#tail;
    this.#tail = node;
    while (node !== null) {
      const next = node.next;
      node.next = node.prev;
      node.prev = next;
      node = next;
    }
  }

  toReversed() {
    let node = this.#tail;
    if (node === null) return new List();
    const head = new ListNode(node.value);
    let tail = head;
    node = node.prev;
    while (node !== null) {
      const copied = new ListNode(node.value);
      copied.prev = tail;
      tail.next = copied;
      tail = copied;
      node = node.prev;
    }
    return List.#create(head, tail, this.#size);
  }

  sort(compare) {
    const array = this.toArray();
    array.sort(compare);
    const { length } = array;
    let node = this.#head;
    for (let i = 0; i < length; i++) {
      node.value = array[i];
      node = node.next;
    }
  }

  toSorted(compare) {
    const array = this.toArray();
    array.sort(compare);
    return List.fromArray(array);
  }

  map(fn) {
    let node = this.#head;
    if (node === null) return new List();
    const size = this.#size;
    const first = fn(node.value, 0);
    const head = new ListNode(first);
    let tail = head;
    node = node.next;
    for (let index = 1; index < size; index++) {
      const mapped = fn(node.value, index);
      const item = new ListNode(mapped);
      item.prev = tail;
      tail.next = item;
      tail = item;
      node = node.next;
    }
    return List.#create(head, tail, size);
  }

  flatMap(fn) {
    let head = null;
    let tail = null;
    let size = 0;
    let node = this.#head;
    while (node !== null) {
      const values = fn(node.value);
      for (const value of values) {
        const item = new ListNode(value);
        if (tail === null) {
          head = item;
        } else {
          tail.next = item;
          item.prev = tail;
        }
        tail = item;
        size++;
      }
      node = node.next;
    }
    return List.#create(head, tail, size);
  }

  filter(fn) {
    let head = null;
    let tail = null;
    let size = 0;
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      const value = node.value;
      if (fn(value, index)) {
        const item = new ListNode(value);
        if (tail === null) {
          head = item;
        } else {
          tail.next = item;
          item.prev = tail;
        }
        tail = item;
        size++;
      }
      node = node.next;
      index++;
    }
    return List.#create(head, tail, size);
  }

  reduce(fn, initial) {
    let acc = initial;
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      acc = fn(acc, node.value, index);
      node = node.next;
      index++;
    }
    return acc;
  }

  some(fn) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (fn(node.value, index)) return true;
      node = node.next;
      index++;
    }
    return false;
  }

  every(fn) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (!fn(node.value, index)) return false;
      node = node.next;
      index++;
    }
    return true;
  }

  find(fn) {
    const result = undefined;
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      const value = node.value;
      if (fn(value, index)) return value;
      node = node.next;
      index++;
    }
    return result;
  }

  findIndex(fn) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (fn(node.value, index)) return index;
      node = node.next;
      index++;
    }
    return -1;
  }

  sum(fn) {
    let total = 0;
    let node = this.#head;
    if (fn !== undefined) {
      while (node !== null) {
        total += fn(node.value);
        node = node.next;
      }
      return total;
    }
    while (node !== null) {
      total += node.value;
      node = node.next;
    }
    return total;
  }

  avg(fn) {
    const size = this.#size;
    return size === 0 ? 0 : this.sum(fn) / size;
  }

  min(compare = compareAsc) {
    let result = undefined;
    let node = this.#head;
    if (node === null) return result;
    result = node.value;
    node = node.next;
    while (node !== null) {
      if (compare(node.value, result) < 0) result = node.value;
      node = node.next;
    }
    return result;
  }

  max(compare = compareAsc) {
    let result = undefined;
    let node = this.#head;
    if (node === null) return result;
    result = node.value;
    node = node.next;
    while (node !== null) {
      if (compare(node.value, result) > 0) result = node.value;
      node = node.next;
    }
    return result;
  }

  isEmpty() {
    return this.#size === 0;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }

  toArray() {
    const size = this.#size;
    const array = new Array(size);
    let node = this.#head;
    for (let i = 0; i < size; i++) {
      array[i] = node.value;
      node = node.next;
    }
    return array;
  }

  clone() {
    return List.#copyFrom(this.#head, this.#size);
  }

  [Symbol.iterator]() {
    let node = this.#head;
    return {
      next() {
        if (node === null) return { done: true, value: undefined };
        const value = node.value;
        node = node.next;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

// cons-list.js

class ConsList {
  #value = undefined;
  #next = null;
  #size = 0;

  static #EMPTY = new ConsList();

  constructor(value = undefined, next = null, size = 0) {
    this.#value = value;
    this.#next = next;
    this.#size = size;
  }

  static get empty() {
    return ConsList.#EMPTY;
  }

  static of(...values) {
    return ConsList.fromArray(values);
  }

  static fromArray(values) {
    return ConsList.#prependAll(values, ConsList.empty);
  }

  static #prependAll(values, list) {
    let result = list;
    for (let i = values.length - 1; i >= 0; i--) {
      result = result.prepend(values[i]);
    }
    return result;
  }

  static fromIterable(iterable) {
    const values = Array.from(iterable);
    return ConsList.fromArray(values);
  }

  static merge(...lists) {
    const count = lists.length;
    if (count === 0) return ConsList.empty;
    let result = lists[count - 1];
    for (let i = count - 2; i >= 0; i--) {
      const list = lists[i];
      if (list.isEmpty()) continue;
      if (result.isEmpty()) {
        result = list;
        continue;
      }
      const values = list.toArray();
      result = ConsList.#prependAll(values, result);
    }
    return result;
  }

  get value() {
    return this.#value;
  }

  get tail() {
    if (this.#next === null) return ConsList.empty;
    return this.#next;
  }

  get size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  prepend(value = undefined) {
    const next = this.isEmpty() ? null : this;
    return new ConsList(value, next, this.#size + 1);
  }

  uncons() {
    return { value: this.#value, tail: this.tail };
  }

  equals(other) {
    if (this === other) return true;
    if (!(other instanceof ConsList)) return false;
    const size = this.#size;
    if (size !== other.#size) return false;
    let current = this;
    let compared = other;
    for (let i = 0; i < size; i++) {
      if (current.#value !== compared.#value) return false;
      current = current.#next;
      compared = compared.#next;
    }
    return true;
  }

  includes(value) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (current.#value === value) return true;
      current = current.#next;
    }
    return false;
  }

  member(value) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (current.#value === value) return current;
      current = current.#next;
    }
    return ConsList.empty;
  }

  toReversed() {
    let result = ConsList.empty;
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      result = result.prepend(current.#value);
      current = current.#next;
    }
    return result;
  }

  map(fn) {
    const size = this.#size;
    const values = new Array(size);
    let current = this;
    for (let i = 0; i < size; i++) {
      values[i] = fn(current.#value, i);
      current = current.#next;
    }
    return ConsList.fromArray(values);
  }

  filter(fn) {
    const values = [];
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      const value = current.#value;
      if (fn(value, i)) values.push(value);
      current = current.#next;
    }
    return ConsList.fromArray(values);
  }

  find(fn) {
    const result = undefined;
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      const value = current.#value;
      if (fn(value, i)) return value;
      current = current.#next;
    }
    return result;
  }

  some(fn) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (fn(current.#value, i)) return true;
      current = current.#next;
    }
    return false;
  }

  every(fn) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (!fn(current.#value, i)) return false;
      current = current.#next;
    }
    return true;
  }

  reduce(fn, acc) {
    const size = this.#size;
    let current = this;
    let index = 0;
    let result = acc;
    if (acc === undefined) {
      if (size === 0) throw new TypeError('ConsList is empty');
      result = current.#value;
      current = current.#next;
      index = 1;
    }
    for (; index < size; index++) {
      result = fn(result, current.#value, index);
      current = current.#next;
    }
    return result;
  }

  toArray() {
    const size = this.#size;
    const result = new Array(size);
    let current = this;
    for (let i = 0; i < size; i++) {
      result[i] = current.#value;
      current = current.#next;
    }
    return result;
  }

  [Symbol.iterator]() {
    let current = this;
    let remaining = this.#size;
    return {
      next: () => {
        if (remaining === 0) return { done: true, value: undefined };
        const value = current.#value;
        current = current.#next;
        remaining--;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

const cons = (value, tail = ConsList.empty) => tail.prepend(value);
const uncons = (list) => list.uncons();

// trie.js

const VALUE = Symbol('value');

// for-in instead of Object.keys to avoid allocating an array
const hasChildren = (node) => {
  for (const key in node) return true;
  return false;
};

class Trie {
  #root = Object.create(null);
  #size = 0;

  get size() {
    return this.#size;
  }

  insert(word, ...args) {
    if (typeof word !== 'string') {
      throw new TypeError('Word must be a string');
    }
    const value = args.length === 0 ? true : args[0];
    let node = this.#root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      let child = node[char];
      if (child === undefined) {
        child = Object.create(null);
        node[char] = child;
      }
      node = child;
    }
    if (!Object.hasOwn(node, VALUE)) this.#size++;
    node[VALUE] = value;
    return this;
  }

  delete(word) {
    if (typeof word !== 'string') return false;
    const path = [];
    let node = this.#root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const child = node[char];
      if (child === undefined) return false;
      path.push(node, char);
      node = child;
    }
    if (!Object.hasOwn(node, VALUE)) return false;
    Reflect.deleteProperty(node, VALUE);
    this.#size--;
    for (let i = path.length - 2; i >= 0; i -= 2) {
      const parent = path[i];
      const char = path[i + 1];
      const child = parent[char];
      if (Object.hasOwn(child, VALUE)) break;
      if (hasChildren(child)) break;
      Reflect.deleteProperty(parent, char);
    }
    return true;
  }

  clear() {
    this.#root = Object.create(null);
    this.#size = 0;
  }

  isEmpty() {
    return this.#size === 0;
  }

  has(word) {
    const node = this.#find(word);
    return node !== null && Object.hasOwn(node, VALUE);
  }

  get(word) {
    const node = this.#find(word);
    return node === null ? undefined : node[VALUE];
  }

  complete(prefix) {
    const node = this.#find(prefix);
    if (node === null) return [];
    return this.#collect(node, prefix);
  }

  #find(word) {
    if (typeof word !== 'string') return null;
    let node = this.#root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      node = node[char];
      if (node === undefined) return null;
    }
    return node;
  }

  #collect(node, path, words = []) {
    if (Object.hasOwn(node, VALUE)) words.push(path);
    const keys = Object.keys(node);
    for (let i = 0; i < keys.length; i++) {
      const char = keys[i];
      this.#collect(node[char], `${path}${char}`, words);
    }
    return words;
  }
}

// unrolled.js

class UnrolledNode {
  constructor(size) {
    this.length = 0;
    this.size = size;
    this.buffer = new Array(size);
    this.readIndex = 0;
    this.writeIndex = 0;
    this.next = null;
  }

  reset() {
    this.readIndex = 0;
    this.writeIndex = 0;
    this.length = 0;
    this.next = null;
  }

  clear() {
    const buffer = this.buffer;
    const end = this.writeIndex;
    for (let i = this.readIndex; i < end; i++) {
      buffer[i] = undefined;
    }
    this.reset();
  }

  enqueue(item) {
    if (this.writeIndex >= this.size) return false;
    this.buffer[this.writeIndex++] = item;
    this.length++;
    return true;
  }

  dequeue() {
    let item = undefined;
    if (this.length === 0) return item;
    const index = this.readIndex++;
    item = this.buffer[index];
    this.buffer[index] = undefined;
    this.length--;
    return item;
  }
}

class NodePool {
  constructor(count, factory) {
    const instances = new Array(count);
    for (let i = 0; i < count; i++) instances[i] = factory();
    this.count = count;
    this.instances = instances;
    this.factory = factory;
  }

  acquire() {
    return this.instances.shift() ?? this.factory();
  }

  release(instance) {
    const { instances, count } = this;
    if (instances.length < count) instances.push(instance);
  }
}

class UnrolledList {
  #size = 0;
  #head = null;
  #tail = null;
  #pool = null;

  constructor(options = {}) {
    const { nodeSize = 1024, poolSize = 2 } = options;
    const pool = new NodePool(poolSize, () => new UnrolledNode(nodeSize));
    this.#pool = pool;
    const node = pool.acquire();
    this.#head = node;
    this.#tail = node;
  }

  get size() {
    return this.#size;
  }

  static fromArray(values, options) {
    const list = new UnrolledList(options);
    const { length } = values;
    for (let i = 0; i < length; i++) list.enqueue(values[i]);
    return list;
  }

  enqueue(item) {
    const head = this.#head;
    if (!head.enqueue(item)) {
      const node = this.#pool.acquire();
      head.next = node;
      this.#head = node;
      node.enqueue(item);
    }
    this.#size++;
  }

  dequeue() {
    let item;
    if (this.#size > 0) {
      const tail = this.#tail;
      item = tail.dequeue();
      this.#size--;
      if (tail.length === 0) {
        const next = tail.next;
        if (next !== null) {
          this.#tail = next;
          this.#pool.release(tail);
        }
        tail.reset();
      }
    }
    return item;
  }

  peek() {
    let item = undefined;
    if (this.#size > 0) {
      const tail = this.#tail;
      item = tail.buffer[tail.readIndex];
    }
    return item;
  }

  isEmpty() {
    return this.#size === 0;
  }

  clear() {
    const pool = this.#pool;
    let node = this.#tail.next;
    this.#tail.clear();
    while (node !== null) {
      const next = node.next;
      node.clear();
      pool.release(node);
      node = next;
    }
    this.#head = this.#tail;
    this.#size = 0;
  }
}

// struct.js

const typeOf = (value) => {
  if (value === undefined) return 'unknown';
  if (value === null) return 'ref';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

const matchesType = (expected, value) => {
  if (expected === 'unknown') return true;
  if (expected === 'ref') {
    const type = typeof value;
    return type === 'object' || type === 'function';
  }
  return typeOf(value) === expected;
};

const createDefault = (type, value) => {
  if (type === 'array') return value.slice();
  if (type === 'object') return { ...value };
  return value;
};

class Struct {
  static immutable(className, defaults) {
    return Struct.#build(className, defaults, false);
  }

  static mutable(className, defaults) {
    return Struct.#build(className, defaults, true);
  }

  static #build(className, defaults, isMutable) {
    const fields = Object.keys(defaults);
    const schema = Object.create(null);
    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      schema[key] = typeOf(defaults[key]);
    }
    Object.freeze(schema);

    const validate = (data) => {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const expected = schema[key];
        if (expected === undefined) {
          throw new TypeError(`Unknown field "${key}"`);
        }
        const value = data[key];
        if (!matchesType(expected, value)) {
          const actual = typeOf(value);
          throw new TypeError(
            `Invalid type for "${key}": expected ${expected}, got ${actual}`,
          );
        }
      }
    };

    const { [className]: Entity } = {
      [className]: class {
        static fields = fields.slice();
        static schema = schema;
        static mutable = isMutable;

        constructor(data = {}) {
          validate(data);
          for (let i = 0; i < fields.length; i++) {
            const key = fields[i];
            this[key] = Object.hasOwn(data, key)
              ? data[key]
              : createDefault(schema[key], defaults[key]);
          }
          if (isMutable) Object.seal(this);
          else Object.freeze(this);
        }

        static create(data) {
          return new Entity(data);
        }

        update(updates) {
          if (!isMutable) {
            throw new Error(
              'Cannot update immutable Struct, use fork or branch',
            );
          }
          validate(updates);
          return Object.assign(this, updates);
        }

        fork(updates = {}) {
          const data = { ...this.toObject(), ...updates };
          return new Entity(data);
        }

        branch(updates = {}) {
          validate(updates);
          const obj = Object.create(this);
          const keys = Object.keys(updates);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            Reflect.defineProperty(obj, key, {
              value: updates[key],
              writable: isMutable,
              configurable: false,
              enumerable: true,
            });
          }
          return isMutable ? Object.seal(obj) : Object.freeze(obj);
        }

        toObject() {
          const obj = {};
          for (let i = 0; i < fields.length; i++) {
            const key = fields[i];
            obj[key] = this[key];
          }
          return obj;
        }
      },
    };

    return Entity;
  }
}

// browser.js

const UINT32_MAX = 0xffffffff;
const BUF_LEN = 1024;
const BUF_SIZE = BUF_LEN * Uint32Array.BYTES_PER_ELEMENT;

const randomBuffer = crypto.getRandomValues(new Uint8Array(BUF_SIZE));

const randomPrefetcher = {
  buf: randomBuffer,
  view: new DataView(
    randomBuffer.buffer,
    randomBuffer.byteOffset,
    randomBuffer.byteLength,
  ),
  pos: 0,
  next() {
    const { buf, view, pos } = this;
    let start = pos;
    if (start === buf.length) {
      start = 0;
      crypto.getRandomValues(buf);
    }
    const rnd = view.getUint32(start, true) / (UINT32_MAX + 1);
    this.pos = start + Uint32Array.BYTES_PER_ELEMENT;
    return rnd;
  },
};

const toRange = (rnd, min, max) => {
  if (min === undefined) return rnd;
  const hasMax = max !== undefined;
  const a = hasMax ? min : 0;
  const b = hasMax ? max : min;
  return a + Math.floor(rnd * (b - a + 1));
};

const cryptoRandom = (min, max) => {
  const rnd = randomPrefetcher.next();
  return toRange(rnd, min, max);
};

const random = (min, max) => {
  const rnd = Math.random();
  return toRange(rnd, min, max);
};

const generateUUID = () => crypto.randomUUID();

const latin1Decoder = new TextDecoder('latin1');

const generateKey = (possible, length) => {
  if (length < 0) return '';
  const base = possible.length;
  if (base < 1) return '';
  const key = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const index = cryptoRandom(0, base - 1);
    key[i] = possible.charCodeAt(index);
  }
  return latin1Decoder.decode(key);
};

export {
  Error,
  DomainError,
  isError,
  replace,
  between,
  split,
  isFirstUpper,
  isFirstLower,
  isFirstLetter,
  toLowerCamel,
  toUpperCamel,
  toLower,
  toCamel,
  spinalToCamel,
  snakeToCamel,
  isConstant,
  fileExt,
  trimLines,
  sample,
  shuffle,
  projection,
  toBool,
  timeout,
  delay,
  timeoutify,
  throttle,
  debounce,
  duration,
  nowDate,
  nowDateTimeUTC,
  parseMonth,
  parseDay,
  parseEvery,
  nextEvent,
  makePrivate,
  protect,
  jsonParse,
  isHashObject,
  flatObject,
  unflatObject,
  getSignature,
  namespaceByPath,
  serializeArguments,
  firstKey,
  isInstanceOf,
  Collector,
  collect,
  Emitter,
  parseHost,
  parseParams,
  parseCookies,
  parseRange,
  Pool,
  Lease,
  Result,
  Semaphore,
  bytesToSize,
  sizeToBytes,
  CircularBuffer,
  Deque,
  Queue,
  Stack,
  List,
  ListNode,
  ConsList,
  cons,
  uncons,
  Trie,
  UnrolledList,
  UnrolledNode,
  NodePool,
  Struct,
  cryptoRandom,
  random,
  generateUUID,
  generateKey,
};
