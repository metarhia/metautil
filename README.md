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
const domains = getX509names(x509);
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

## Class `Result`

A container holding either a value or an error, useful to avoid `try`/`catch`
boilerplate and to pass either outcome around as a single value.

- `constructor(value?: unknown, error?: unknown)`
- `static ok(value?: unknown): Result`
- `static fail(error: unknown): Result`
- `static from(fn: () => unknown): Result`
- `static fromAsync(fn: () => Promise<unknown>): Promise<Result>`
- `value: unknown`
- `error: unknown`
- `ok: boolean`
- `unwrap(defaultValue?: unknown): unknown`
- `map(fn: (value: unknown) => unknown): Result`

```js
const parsed = Result.from(() => JSON.parse(input));
if (parsed.ok) console.log(parsed.value);
else console.error(parsed.error);

const loaded = await Result.fromAsync(() => readFile(path));
const size = loaded.map((buffer) => buffer.length).unwrap(0);
```

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
- `jsonParse(data: Buffer | string | null | undefined): Dictionary | null`
- `isHashObject(o: string | number | boolean | object): boolean`
- `flatObject(source: Dictionary, fields: Strings): Dictionary`
- `unflatObject(source: Dictionary, fields: Strings): Dictionary`
- `getSignature(method: Function): Strings`
- `namespaceByPath(namespace: Dictionary, path: string): Dictionary | null`
- `serializeArguments(fields: Strings, args: Dictionary): string`
- `firstKey(obj: Dictionary): string | undefined`
- `isInstanceOf(obj: unknown, constrName: string): boolean`

## Class `Struct`

Typed records with schema inferred from literal defaults.

- `Struct.immutable(className: string, defaults: object): StructClass`
- `Struct.mutable(className: string, defaults: object): StructClass`

Default literals define field types:

- `undefined` → schema `unknown`, accepts any value, defaults to `undefined`
- `null` → schema `ref`, accepts null, objects, and functions, defaults to `null`
- `[]` → schema `array`, accepts arrays, fresh copy per instance
- `{}` → schema `object`, accepts plain objects, fresh copy per instance
- primitive → schema `typeof`, accepts exact primitive type, literal default value

Generated class:

- `constructor(data?: object)`
- `static create(data?: object): StructRecord`
- `static fields: Array<string>`
- `static schema: object`
- `static mutable: boolean`
- `update(updates: object): this` (mutable only)
- `fork(updates?: object): StructRecord`
- `branch(updates?: object): StructRecord`
- `toObject(): object`

```js
const City = metautil.Struct.immutable('City', { name: 'Unknown' });
const rome = new City({ name: 'Rome' });

const User = metautil.Struct.mutable('User', {
  id: 0,
  name: 'Anonymous',
  roles: [],
});
const marcus = User.create({ id: 1, name: 'Marcus' });
```

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
const pool = new Pool();
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

## Data structures

All data structure classes implement a common interoperability contract:
every class has `static fromArray`, `static fromIterable`, `toArray`,
and `[Symbol.iterator]`, making any structure convertible to any other
via `Array` as the universal interchange format. The shared TypeScript
interfaces `Sequence<T>` and `Indexable<T>` (in `metautil.d.ts`) describe
structural contracts at the type level. `Stack` and `Queue` are thin
ADT facades over `Deque` (same circular buffer; flavored method names).

| Class            | ADT            | Backed by         | Ends | Index |
| ---------------- | -------------- | ----------------- | ---- | ----- |
| `Deque`          | double-ended   | circular buffer   | O(1) | O(1)  |
| `Queue`          | FIFO           | `Deque`           | O(1) | —     |
| `Stack`          | LIFO           | `Deque`           | O(1) | —     |
| `List`           | sequence       | doubly-linked     | O(1) | O(n)  |
| `PersistentList` | immutable cons | shared cons nodes | O(1) | O(n)  |
| `ConsList`       | immutable cons | shared nodes      | O(1) | O(n)  |

```js
// Any structure can feed any other via iterables
const list = List.range(1, 5);
const queue = Queue.fromIterable(list.filter((n) => n % 2 === 0));
const deque = Deque.fromIterable(queue);
const cons = ConsList.fromArray(deque.toArray());
```

## Class `ConsList`

An immutable singly-linked cons-list with structural sharing. Every
`prepend` returns a new `ConsList` that shares its tail with the
original — enabling multiple independent branches from a common suffix
at zero copy cost (inspired by LISP cons cells).

- `static empty: ConsList<T>` — canonical empty singleton
- `static of<T>(...values: Array<T>): ConsList<T>`
- `static fromArray<T>(values: Array<T>): ConsList<T>`
- `static fromIterable<T>(iterable: Iterable<T>): ConsList<T>`
- `prepend(value: T): ConsList<T>` — O(1), returns new head sharing old tail
- `first(): T | undefined` — head value
- `rest(): ConsList<T>` — tail (O(1), no copy)
- `toArray(): Array<T>`
- `[Symbol.iterator](): Iterator<T>`
- `value: T | undefined`
- `next: ConsList<T> | null`
- `size: number`
- `isEmpty(): boolean`

```js
const shared = ConsList.of(3, 4, 5);

const branch1 = shared.prepend(2).prepend(1); // [1, 2, 3, 4, 5]
const branch2 = shared.prepend(99); // [99, 3, 4, 5]

// Both branches share the [3, 4, 5] suffix — no copying
console.log(branch1.next.next === shared); // true
console.log(branch2.next === shared); // true
```

**Use case: undo history with branching (time-travel state)**

```js
let history = ConsList.of('draft v1');
history = history.prepend('draft v2');
history = history.prepend('draft v3');
console.log(history.first()); // 'draft v3'

// Jump back in time — earlier states remain valid and untouched
const undone = history.rest();
console.log(undone.first()); // 'draft v2'

// Branch a new edit off the older state without affecting `history`
const branched = undone.prepend('draft v2b');
console.log(branched.toArray()); // ['draft v2b', 'draft v2', 'draft v1']
console.log(history.toArray()); // ['draft v3', 'draft v2', 'draft v1']
```

## Class `List`

A doubly-linked-list-backed sequence with a comprehensive API. All
push/pop/append/prepend operations are O(1); index-based operations
are O(n).

**Construction**

- `constructor()`
- `static fromArray<T>(values: Array<T>): List<T>`
- `static fromIterable<T>(iterable: Iterable<T>): List<T>`
- `static range(start: number, end: number, step?: number): List<number>`
- `static merge<T>(lists: Array<List<T>>): List<T>`

**CRUD / index**

- `append(value: T): void`
- `prepend(value: T): void`
- `enqueue(value: T): void` — alias for `append`
- `dequeue(): T | undefined` — removes and returns first element
- `insert(index: number, value: T, count?: number): void`
- `delete(index: number, count?: number): void`
- `at(index: number): T | undefined`
- `set(index: number, value: T): void`
- `first(): T | undefined`
- `last(): T | undefined`

**Slicing**

- `tail(n?: number): List<T>` — all-but-first-n (default 1)
- `init(n?: number): List<T>` — all-but-last-n (default 1)
- `drop(n: number): void` — drops first n (or last |n| if negative)
- `take(n: number): List<T>` — first n (or last |n| if negative)
- `slice(start?: number, end?: number): List<T>`

**Rearranging**

- `rotateLeft(steps?: number): void`
- `rotateRight(steps?: number): void`
- `rotate(n: number): void` — positive rotates left, negative right
- `swap(i: number, j: number): void`
- `move(from: number, to: number): void`
- `splitAt(index: number): { before: List<T>; after: List<T> }`
- `groupBy<K>(key: (v: T) => K): Map<K, List<T>>`

**Search / compare**

- `includes(value: T): boolean`
- `indexOf(value: T): number`
- `lastIndexOf(value: T): number`
- `equals(other: List<T>): boolean`

**Bulk mutations**

- `addAll(values: Iterable<T>): void`
- `removeAll(values: Iterable<T>): void`
- `fill(value: T, start?: number, end?: number): void`
- `replace(oldValue: T, newValue: T): void`
- `distinct(): void` — removes duplicates in place
- `toDistinct(): List<T>`

**Ordering**

- `shuffle(): void`
- `toShuffled(): List<T>`
- `reverse(): void`
- `toReversed(): List<T>`
- `sort(compare?: (a: T, b: T) => number): void`
- `toSorted(compare?: (a: T, b: T) => number): List<T>`

**Functional**

- `map<U>(fn: (value: T, index: number) => U): List<U>`
- `lazyMap<U>(fn): Iterator<U>` — generator, does not materialize
- `flatMap<U>(fn: (value: T) => Iterable<U>): List<U>`
- `filter(fn: (value: T, index: number) => boolean): List<T>`
- `lazyFilter(fn): Iterator<T>` — generator, does not materialize
- `reduce<U>(fn, initial: U): U`
- `lazyReduce<U>(fn, initial: U): Iterator<U>` — yields running accumulator (scan)
- `some(fn): boolean`
- `every(fn): boolean`
- `find(fn): T | undefined`
- `findIndex(fn): number`

**Stats**

- `sum(fn?: (value: T) => number): number`
- `avg(fn?: (value: T) => number): number`
- `min(compare?: (a: T, b: T) => number): T | undefined`
- `max(compare?: (a: T, b: T) => number): T | undefined`

**Utility**

- `isEmpty(): boolean`
- `clear(): void`
- `toArray(): Array<T>`
- `join(separator?: string): string`
- `clone(): List<T>`
- `[Symbol.iterator](): Iterator<T>`
- `[Symbol.asyncIterator](): AsyncIterator<T>`
- `size: number`

```js
const list = List.range(1, 5);
list.append(6);
list.prepend(0);
console.log(list.toArray()); // [0, 1, 2, 3, 4, 5, 6]
console.log(list.filter((v) => v % 2 === 0).toArray()); // [0, 2, 4, 6]
console.log(list.reduce((acc, v) => acc + v, 0)); // 21

const grouped = list.groupBy((v) => v % 3);
console.log(grouped.get(0).toArray()); // [0, 3, 6]
```

**Use case: playlist manager**

```js
const playlist = List.fromArray(['intro', 'verse', 'chorus', 'verse', 'outro']);

playlist.distinct(); // drop duplicate tracks in place
console.log(playlist.toArray()); // ['intro', 'verse', 'chorus', 'outro']

playlist.move(3, 0); // move 'outro' to the front
console.log(playlist.toArray()); // ['outro', 'intro', 'verse', 'chorus']

console.log(playlist.find((track) => track.startsWith('ch'))); // 'chorus'
```

## Class `Deque`

Double-ended queue backed by a growable circular buffer — the shared
engine for `Stack` and `Queue`. Supports O(1) ops at both ends and O(1)
index-based access. Method names stay end-oriented (`prepend` / `append`
/ `dequeue` / `pop`).

- `constructor()`
- `static fromArray<T>(values: Array<T>): Deque<T>`
- `static fromIterable<T>(iterable: Iterable<T>): Deque<T>`
- `static range(start: number, end: number, step?: number): Deque<number>`
- `prepend(value: T): void`
- `append(value: T): void`
- `dequeue(): T | undefined` — removes and returns the front element
- `pop(): T | undefined` — removes and returns the back element
- `at(index: number): T | undefined`
- `set(index: number, value: T): void`
- `first(): T | undefined`
- `last(): T | undefined`
- `isEmpty(): boolean`
- `includes(value: T): boolean`
- `equals(other: Deque<T>): boolean`
- `rotateLeft(steps?: number): void`
- `rotateRight(steps?: number): void`
- `clear(): void`
- `toArray(): Array<T>`
- `clone(): Deque<T>`
- `[Symbol.iterator](): Iterator<T>`
- `[Symbol.asyncIterator](): AsyncIterator<T>`
- `size: number`

```js
const deque = Deque.range(1, 5);
// [1, 2, 3, 4, 5]
deque.prepend(0);
deque.append(6);
console.log(deque.dequeue()); // 0
console.log(deque.pop()); // 6
deque.rotateLeft(2);
console.log(deque.toArray()); // [3, 4, 5, 1, 2]
```

**Use case: sliding window maximum**

```js
// Monotonic deque of indices — the front always holds the current max
function maxSlidingWindow(nums, k) {
  const deque = new Deque();
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (!deque.isEmpty() && deque.first() <= i - k) deque.dequeue();
    while (!deque.isEmpty() && nums[deque.last()] <= nums[i]) deque.pop();
    deque.append(i);
    if (i >= k - 1) result.push(nums[deque.first()]);
  }
  return result;
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]
```

## Class `Queue`

FIFO (first in, first out) facade over `Deque`: `enqueue` appends at the
back, `dequeue` / `peek` operate at the front. Same circular buffer and
O(1) costs as `Deque`.

- `constructor()`
- `static fromArray<T>(values: Array<T>): Queue<T>`
- `static fromIterable<T>(iterable: Iterable<T>): Queue<T>`
- `enqueue(value: T): void` — appends at the back
- `dequeue(): T | undefined` — removes and returns the front
- `peek(): T | undefined` — front element (`first`), does not remove
- `first(): T | undefined`
- `last(): T | undefined`
- `isEmpty(): boolean`
- `includes(value: T): boolean`
- `clear(): void`
- `toArray(): Array<T>`
- `clone(): Queue<T>`
- `[Symbol.iterator](): Iterator<T>`
- `[Symbol.asyncIterator](): AsyncIterator<T>`
- `size: number`

```js
const queue = new Queue();
queue.enqueue('a');
queue.enqueue('b');
queue.enqueue('c');
console.log(queue.dequeue()); // 'a'
console.log(queue.peek()); // 'b'
console.log(queue.size); // 2
```

**Use case: breadth-first traversal**

```js
const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4, children: [] }] },
    { value: 3, children: [] },
  ],
};

const queue = new Queue();
queue.enqueue(tree);
const order = [];
while (!queue.isEmpty()) {
  const node = queue.dequeue();
  order.push(node.value);
  for (const child of node.children) queue.enqueue(child);
}
console.log(order); // [1, 2, 3, 4]
```

## Class `Stack`

LIFO (last in, first out) facade over `Deque`: `push` / `pop` / `peek`
operate at the back. Same circular buffer and O(1) end costs as `Deque`.

- `constructor()`
- `static fromArray<T>(values: Array<T>): Stack<T>`
- `static fromIterable<T>(iterable: Iterable<T>): Stack<T>`
- `push(value: T): void` — appends at the back
- `pop(): T | undefined` — removes and returns the back
- `peek(): T | undefined` — back element (`last`), does not remove
- `first(): T | undefined` — bottom (oldest)
- `last(): T | undefined` — top (same as `peek`)
- `isEmpty(): boolean`
- `includes(value: T): boolean`
- `clear(): void`
- `toArray(): Array<T>`
- `clone(): Stack<T>`
- `[Symbol.iterator](): Iterator<T>`
- `[Symbol.asyncIterator](): AsyncIterator<T>`
- `size: number`

```js
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.peek()); // 3
console.log(stack.pop()); // 3
console.log(stack.size); // 2
```

**Use case: balanced brackets validator**

```js
function isBalanced(input) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = new Stack();
  for (const char of input) {
    if ('([{'.includes(char)) stack.push(char);
    else if (char in pairs && stack.pop() !== pairs[char]) return false;
  }
  return stack.isEmpty();
}

console.log(isBalanced('{[()]}')); // true
console.log(isBalanced('{[(])}')); // false
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
