# Metarhia utilities

[![ci status](https://github.com/metarhia/metautil/workflows/Testing%20CI/badge.svg)](https://github.com/metarhia/metautil/actions?query=workflow%3A%22Testing+CI%22+branch%3Amaster)
[![snyk](https://snyk.io/test/github/metarhia/metautil/badge.svg)](https://snyk.io/test/github/metarhia/metautil)
[![npm version](https://badge.fury.io/js/metautil.svg)](https://badge.fury.io/js/metautil)
[![npm downloads/month](https://img.shields.io/npm/dm/metautil.svg)](https://www.npmjs.com/package/metautil)
[![npm downloads](https://img.shields.io/npm/dt/metautil.svg)](https://www.npmjs.com/package/metautil)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/metarhia/metautil/blob/master/LICENSE)

## Usage

- Install: `npm install metautil`
- Require: `const metautil = require('metautil')`

## Async utilities

- `toBool = [() => true, () => false]`
  - Example: `const created = await mkdir(path).then(...toBool);`
- `timeout(msec: number, signal?: AbortSignal): Promise<void>`
- `delay(msec: number, signal?: AbortSignal): Promise<void>`
- `timeoutify(promise: Promise<unknown>, msec: number): Promise<unknown>`
- `collect(keys: Array<string>, options?: CollectorOptions): Collector`
  - `options.exact?: boolean`
  - `options.timeout?: number`
  - `options.reassign?: boolean`

## Class `Collector`

Async collection is an utility to collect needed keys and signalize on done.

- `constructor(keys: Array<string>, options?: CollectorOptions)`
  - `options.exact?: boolean`
  - `options.timeout?: number`
  - `options.reassign?: boolean`
  - `options.defaults?: object`
  - `options.validate?: (data: Record<string, unknown>) => unknown`
- `set(key: string, value: unknown): void`
- `wait(key: string, fn: AsyncFunction | Promise<unknown>, ...args?: Array<unknown>): void`
- `take(key: string, fn: Function, ...args?: Array<unknown>): void`
- `collect(sources: Record<string, Collector>): void`
- `fail(error: Error): void`
- `abort(): void`
- `then(onFulfilled: Function, onRejected?: Function): Promise<unknown>`
- `done: boolean`
- `data: Dictionary`
- `keys: Array<string>`
- `count: number`
- `exact: boolean`
- `timeout: number`
- `defaults: object`
- `reassign: boolean`
- `validate?: (data: Record<string, unknown>) => unknown`
- `signal: AbortSignal`

Collect keys with `.set` method:

```js
const ac = collect(['userName', 'fileName']);

setTimeout(() => ac.set('fileName', 'marcus.txt'), 100);
setTimeout(() => ac.set('userName', 'Marcus'), 200);

const result = await ac;
console.log(result);
```

Collect keys with `.wait` method from async or promise-returning function:

```js
const ac = collect(['user', 'file']);

ac.wait('file', getFilePromisified, 'marcus.txt');
ac.wait('user', getUserPromisified, 'Marcus');

try {
  const result = await ac;
  console.log(result);
} catch (error) {
  console.error(error);
}
```

Collect keys with `.take` method from callback-last-error-first function:

```js
const ac = collect(['user', 'file'], { timeout: 2000, exact: false });

ac.take('file', getFileCallback, 'marcus.txt');
ac.take('user', getUserCallback, 'Marcus');

const result = await ac;
```

Set default values ​​for unset keys using the `options.defaults` argument:

```js
const defaults = { key1: 'sub1', key2: 'sub1' };

const dc = collect(['key1', 'key2'], { defaults, timeout: 2000 });
dc.set('key2', 'sub2');

const result = await dc;
```

Compose collectors (collect subkeys from multiple sources):

```js
const dc = collect(['key1', 'key2', 'key3']);
const key1 = collect(['sub1']);
const key3 = collect(['sub3']);
dc.collect({ key1, key3 });
const result = await dc;
```

Complex example: compare `Promise.allSettled` + `Promise.race` vs `Collector` in next two examples:

```js
// Collect 4 keys from different contracts with Promise.allSettled + Promise.race

const promise1 = new Promise((resolve, reject) => {
  fs.readFile('README.md', (err, data) => {
    if (err) return void reject(err);
    resolve(data);
  });
});
const promise2 = fs.promises.readFile('README.md');
const url = 'http://worldtimeapi.org/api/timezone/Europe';
const promise3 = fetch(url).then((data) => data.json());
const promise4 = new Promise((resolve) => {
  setTimeout(() => resolve('value4'), 50);
});
const timeout = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('Timed out')), 1000);
});
const data = Promise.allSettled([promise1, promise2, promise3, promise4]);
try {
  const keys = await Promise.race([data, timeout]);
  const [key1, key2, key3, key4] = keys.map(({ value }) => value);
  const result = { key1, key2, key3, key4 };
  console.log(result);
} catch (err) {
  console.log(err);
}
```

Compare with:

```js
// Collect 4 keys from different contracts with Collector

const dc = collect(['key1', 'key2', 'key3', 'key4'], { timeout: 1000 });

dc.take('key1', fs.readFile, 'README.md');
dc.wait('key2', fs.promises.readFile, 'README.md');
const url = 'http://worldtimeapi.org/api/timezone/Europe';
dc.wait(
  'key3',
  fetch(url).then((data) => data.json()),
);
setTimeout(() => dc.set('key4', 'value4'), 50);

try {
  const result = await dc;
  console.log(result);
} catch (err) {
  console.log(err);
}
```

## Crypto utilities

- `cryptoRandom(min?: number, max?: number): number`
- `random(min?: number, max?: number): number`
- `generateUUID(): string`
- `generateKey(possible: string, length: number): string`
- `crcToken(secret: string, key: string): string`
- `generateToken(secret: string, characters: string, length: number): string`
- `validateToken(secret: string, token: string): boolean`
- `serializeHash(hash: Buffer, salt: Buffer): string`
- `deserializeHash(phcString: string): HashInfo`
- `hashPassword(password: string): Promise<string>`
- `validatePassword(password: string, serHash: string): Promise<boolean>`
- `md5(fileName: string): Promise<string>`
- `getX509names(cert: X509Certificate): Strings`

```js
const x509 = new crypto.X509Certificate(cert);
const domains = metautil.getX509names(x509);
```

## Datetime utilities

- `duration(s: string | number): number`
- `nowDate(date?: Date): string`
- `nowDateTimeUTC(date?: Date, timeSep?: string): string`
- `parseMonth(s: string): number`
- `parseDay(s: string): number`
- `parseEvery(s: string): Every`
- `nextEvent(every: Every, date?: Date): number`

## Error utilities

- Class `Error`
  - `constructor(message: string, options?: number | string | ErrorOptions)`
    - `options.code?: number | string`
    - `options.cause?: Error`
  - `message: string`
  - `stack: string`
  - `code?: number | string`
  - `cause?: Error`
- Class `DomainError`
  - `constructor(code?: string, options?: number | string | ErrorOptions)`
    - `options.code?: number | string`
    - `options.cause?: Error`
  - `message: string`
  - `stack: string`
  - `code?: number | string`
  - `cause?: Error`
  - `toError(errors: Errors): Error`
- `isError(instance: object): boolean`

## File system utilities

- `exists(path: string): Promise<boolean>`
- `directoryExists(path: string): Promise<boolean>`
- `fileExists(path: string): Promise<boolean>`
- `ensureDirectory(path: string): Promise<boolean>`
- `parsePath(relPath: string): Strings`

## HTTP utilities

- `parseHost(host?: string): string`
- `parseParams(params: string): Cookies`
- `parseCookies(cookie: string): Headers`
- `parseRange(range: string): StreamRange`

## Network utilities

- Deprecated in 4.x: `fetch(url: string, options?: FetchOptions): Promise<Response>`
- `receiveBody(stream: IncomingMessage): Promise<Buffer | null>`
- `ipToInt(ip?: string): number`
- `intToIp(int: number): string`
- `httpApiCall(url: string, options: ApiOptions): Promise<object>`
  - `options.method?: HttpMethod`
  - `options.headers?: object`
  - `options.body?: Body`

## Objects utilities

- `makePrivate(instance: object): object`
- `protect(allowMixins: Strings, ...namespaces: Namespaces): void`
- `jsonParse(buffer: Buffer): Dictionary | null`
- `isHashObject(o: string | number | boolean | object): boolean`
- `flatObject(source: Dictionary, fields: Strings): Dictionary`
- `unflatObject(source: Dictionary, fields: Strings): Dictionary`
- `getSignature(method: Function): Strings`
- `namespaceByPath(namespace: Dictionary, path: string): Dictionary | null`
- `serializeArguments(fields: Strings, args: Dictionary): string`
- `firstKey(obj: Dictionary): string | undefined`
- `isInstanceOf(obj: unknown, constrName: string): boolean`

## Class Pool

- `constructor(options: PoolOptions)`
  - `options.timeout?: number`
- `items: Array<unknown>`
- `free: Array<boolean>`
- `queue: Array<unknown>`
- `current: number`
- `size: number`
- `available: number`
- `timeout: number`
- `next(exclusive?: boolean): Promise<unknown>`
- `add(item: unknown): void`
- `capture(): Promise<unknown>`
- `release(item: unknown): void`
- `isFree(item: unknown): boolean`

```js
const pool = new metautil.Pool();
pool.add({ a: 1 });
pool.add({ a: 2 });
pool.add({ a: 3 });

if (pool.isFree(obj1)) console.log('1 is free');
const item = await pool.capture();
if (pool.isFree(obj1)) console.log('1 is captured');
const obj = await pool.next();
// obj is { a: 2 }
pool.release(item);
```

## Array utilities

### `sample(array: Array<unknown>): unknown`

```js
const cards = ['🂡', '🃒', '🂮', '🂷', '🃚'];
const card = sample(cards);
```

### `shuffle(array: Array<unknown>): Array<unknown>`

```js
const players = [{ id: 10 }, { id: 12 }, { id: 15 }];
const places = shuffle(players);
```

### `projection(source: object, fields: Array<string>): Array<unknown>`

```js
const player = { name: 'Marcus', score: 1500, socket };
const playerState = projection(player, ['name', 'score']);
```

## Class Semaphore

- `constructor(options: SemaphoreOptions)`
  - `options.concurrency: number`
  - `options.size?: number`
  - `options.timeout?: number`
- `concurrency: number`
- `counter: number`
- `timeout: number`
- `size: number`
- `empty: boolean`
- `queue: Array<QueueElement>`
- `enter(): Promise<void>`
- `leave(): void`

```js
const options = { concurrency: 3, size: 4, timeout: 1500 };
const semaphore = new Semaphore(options);
await semaphore.enter();
// Do something
semaphore.leave();
```

## Strings utilities

- `replace(str: string, substr: string, newstr: string): string`
- `between(s: string, prefix: string, suffix: string): string`
- `split(s: string, separator: string): [string, string]`
- `isFirstUpper(s: string): boolean`
- `isFirstLower(s: string): boolean`
- `isFirstLetter(s: string): boolean`
- `toLowerCamel(s: string): string`
- `toUpperCamel(s: string): string`
- `toLower(s: string): string`
- `toCamel(separator: string): (s: string) => string`
- `spinalToCamel(s: string): string`
- `snakeToCamel(s: string): string`
- `isConstant(s: string): boolean`
- `fileExt(fileName: string): string`
- `parsePath(relPath: string): Strings`
- `trimLines(s: string): string`

## Units utilities

- `bytesToSize(bytes: number): string`
- `sizeToBytes(size: string): number`

```js
const size = bytesToSize(100000000);
const bytes = sizeToBytes(size);
console.log({ size, bytes });
// { size: '100 MB', bytes: 100000000 }
```

| Symbol | zeros | Unit      |
| -----: | ----: | --------- |
|     yb |    24 | yottabyte |
|     zb |    21 | zettabyte |
|     eb |    18 | exabyte   |
|     pb |    15 | petabyte  |
|     tb |    12 | terabyte  |
|     gb |     9 | gigabyte  |
|     mb |     6 | megabyte  |
|     kb |     3 | kilobyte  |

## Class `List`

A feature-rich list data structure with array-backed storage for O(1) random access.

- `constructor(size?: number)` - Create list with optional pre-allocation
- `readonly size: number` - Current element count

### Static Factory Methods

- `List.fromArray<T>(values: T[]): List<T>`
- `List.fromIterator<T>(iterator: Iterable<T>): List<T>`
- `List.range(start: number, end: number, step?: number): List<number>`
- `List.merge<T>(lists: List<T>[]): List<T>`

### Element Access

- `at(index: number): T | undefined` - Supports negative indices
- `set(index: number, value: T): void`
- `first(): T | undefined`
- `last(): T | undefined`

### Add/Remove

- `append(value: T): void`
- `prepend(value: T): void`
- `insert(index: number, value: T, count?: number): void`
- `delete(index: number, count?: number): void`
- `enqueue(value: T): void` - Alias for append
- `dequeue(): T | undefined` - Remove and return first

### Slicing

- `slice(start?: number, end?: number): List<T>`
- `head(): List<T>` - All but last element
- `tail(): List<T>` - All but first element
- `take(n: number): List<T>` - Take n from start (negative = from end)
- `drop(n: number): void` - Remove n from start (negative = from end)
- `splitAt(index: number): { before: List<T>; after: List<T> }`

### Search

- `includes(value: T): boolean`
- `indexOf(value: T): number`
- `lastIndexOf(value: T): number`
- `find(fn: (value: T, index: number) => boolean): T | undefined`
- `findIndex(fn: (value: T, index: number) => boolean): number`
- `equals(other: List<T>): boolean`

### Reordering

- `swap(i: number, j: number): void`
- `move(from: number, to: number): void`
- `rotate(n: number): void` - Positive = right, negative = left
- `reverse(): void` / `toReversed(): List<T>`
- `sort(compare?): void` / `toSorted(compare?): List<T>`
- `shuffle(random?): void` / `toShuffled(random?): List<T>`
- `distinct(): void` / `toDistinct(): List<T>`

### Functional Methods

- `map<U>(fn: (value: T, index: number) => U): List<U>`
- `flatMap<U>(fn: (value: T) => List<U> | U[]): List<U>`
- `filter(fn: (value: T, index: number) => boolean): List<T>`
- `reduce<U>(fn: (acc: U, value: T, index: number) => U, initial: U): U`
- `some(fn): boolean` / `every(fn): boolean`
- `sum(fn?): number` / `avg(fn?): number`
- `min(compare?): T` / `max(compare?): T`
- `groupBy<K>(key: (value: T) => K): Map<K, List<T>>`

### Lazy Iterators

- `lazyMap<U>(fn): Generator<U>`
- `lazyFilter(fn): Generator<T>`
- `lazyReduce<U>(fn, initial): Generator<U>`

### Iteration & Output

- `[Symbol.iterator]()` - Sync iteration
- `[Symbol.asyncIterator]()` - Async iteration (waits for new items)
- `toArray(): T[]`
- `clone(): List<T>`
- `join(separator?: string): string`
- `clear(): void`

```js
const { List } = require('metautil');

// Create and manipulate
const list = List.fromArray([1, 2, 3]);
list.append(4);
list.prepend(0);
console.log([...list]); // [0, 1, 2, 3, 4]

// Functional operations
const doubled = list.map((x) => x * 2);
const sum = list.sum();

// Range and aggregation
const range = List.range(1, 100);
console.log(range.avg()); // 50

// Async iteration (stream-like)
const stream = new List();
setTimeout(() => stream.append('data'), 100);
for await (const item of stream) {
  console.log(item); // 'data'
  break;
}
```

## Class `Emitter`

- Events:
  - `constructor(options?: { maxListeners?: number })`
  - `emit(eventName: EventName, data: unknown): Promise<void>`
  - `on(eventName: EventName, listener: Listener): void`
  - `once(eventName: EventName, listener: Listener): void`
  - `off(eventName: EventName, listener?: Listener): void`
- Adapters:
  - `toPromise(eventName: EventName): Promise<unknown>`
  - `toAsyncIterable(eventName: EventName): AsyncIterable<unknown>`
- Utilities:
  - `clear(eventName?: EventName): void`
  - `listeners(eventName?: EventName): Listener[]`
  - `listenerCount(eventName?: EventName): number`
  - `eventNames(): EventName[]`

Examples:

```js
const ee = new Emitter();
ee.on('eventA', (data) => {
  console.log({ data });
  // Prints: { data: 'value' }
});
ee.emit('eventA', 'value');
```

```js
const ee = new Emitter();
setTimeout(() => {
  ee.emit('eventA', 'value');
}, 100);
const result = await ee.toPromise('eventA');
```

```js
const ee = new Emitter();
passReferenceSomewhere(ee);
const iterable = ee.toAsyncIterable('eventB');
for await (const eventData of iterable) {
  console.log({ eventData });
}
```

## License & Contributors

Copyright (c) 2017-2026 [Metarhia contributors](https://github.com/metarhia/metautil/graphs/contributors).
Metautil is [MIT licensed](./LICENSE).\
Metautil is a part of [Metarhia](https://github.com/metarhia) technology stack.
