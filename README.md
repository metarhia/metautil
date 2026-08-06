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
- `throttle(fn: (...args: Array<unknown>) => unknown, msec: number): LimitControl`
  - At most once per `msec`: leading call, trailing with latest args
- `debounce(fn: Function, msec: number): LimitControl`
  - After `msec` quiet: trailing with latest args
- `LimitControl`: `{ fn, cancel, flush }`
  - `fn(...args)` — rate-limited wrapper
  - `cancel()` — clear timer, drop pending args
  - `flush()` — invoke pending args now (no-op if idle)

```js
const { fn: onScroll, cancel } = throttle(updatePosition, 100);
window.addEventListener('scroll', onScroll);
window.addEventListener('popstate', cancel);

const { fn: onType, flush } = debounce(search, 300);
input.addEventListener('input', onType);
form.addEventListener('submit', flush);
```

- `collect(keys: Array<string>, options?: CollectorOptions): Collector`
  - `options.exact?: boolean`
  - `options.timeout?: number`
  - `options.reassign?: boolean`
  - `options.defaults?: object`
  - `options.validate?: (data: Record<string, unknown>) => unknown`

## Class `Collector`

Async collection is an utility to collect needed keys and signalize on done.

- `constructor(keys: Array<string>, options?: CollectorOptions)`
  - `options.exact?: boolean`
  - `options.timeout?: number`
  - `options.reassign?: boolean`
  - `options.defaults?: object`
  - `options.validate?: (data: Record<string, unknown>) => unknown`
- `set(key: string, value: unknown): void`
- `wait(key: string, fn: AsyncFunction | Promise<unknown>, ...args: Array<unknown>): void`
- `take(key: string, fn: Function, ...args: Array<unknown>): void`
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
- `parseEvery(s?: string): Every`
- `nextEvent(every: Every, date?: Date): number`

## Error utilities

- Class `Error`
  - `constructor(message: string, options?: number | string | ErrorOptions)`
    - `options.code?: number | string`
    - `options.cause?: Error`
    - `options.name?: string`
  - `message: string`
  - `stack: string`
  - `code?: number | string`
  - `cause?: Error`
  - `name: string`
- Class `DomainError`
  - `constructor(code?: string, options?: number | string | ErrorOptions)`
    - `options.code?: number | string`
    - `options.cause?: Error`
    - `options.name?: string`
  - `message: string`
  - `stack: string`
  - `code?: number | string`
  - `cause?: Error`
  - `name: string`
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
- `receiveBody(stream: IncomingMessage, limit?: number): Promise<Buffer>`
- `ipToInt(ip?: string): number`
- `intToIp(int: number): string`
- `httpApiCall(url: string, options: ApiOptions): Promise<object>`
  - `options.method?: HttpMethod`
  - `options.headers?: object`
  - `options.body?: Body`

## Objects utilities

- `makePrivate(instance: object): object`
- `protect(allowMixins: Strings, ...namespaces: Namespaces): void`
- `jsonParse(data?: Buffer | string | null): unknown` — safe parse; returns
  `null` on error or nullish input
- `isHashObject(o: string | number | boolean | object): boolean`
- `flatObject(source: Dictionary, fields?: Strings): Dictionary`
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

## Class `Lease`

Exclusive handle returned by `Pool.capture()`. Holds a pool resource until
`release()` is called (via the lease or `pool.release(lease)`).

- `constructor(resource: unknown, release: () => void)`
- `resource: unknown` — captured pool item (readonly)
- `release(): void` — return the resource to the pool; throws if already
  released

## Class `Pool`

Round-robin pool of reusable resources. `next()` peeks at the next free
item without capturing it. `capture()` takes an exclusive `Lease` (waits
when all items are busy, optionally timing out).

- `constructor(options?: PoolOptions)`
  - `options.timeout?: number` — max wait for `capture()` when no free
    items; `0` (default) waits indefinitely
- `add(resource: unknown): void`
- `next(): unknown | null` — next free resource without capturing
- `capture(): Lease | Promise<Lease> | null`
- `release(lease: Lease): void`
- `isFree(resource: unknown): boolean`

```js
const pool = new Pool();
const obj1 = { a: 1 };
const obj2 = { a: 2 };
const obj3 = { a: 3 };
pool.add(obj1);
pool.add(obj2);
pool.add(obj3);

console.log(pool.isFree(obj1)); // true
const lease = await pool.capture();
console.log(lease.resource === obj1); // true
console.log(pool.isFree(obj1)); // false
console.log(pool.next()); // { a: 2 }
pool.release(lease);
// or: lease.release();
console.log(pool.isFree(obj1)); // true
```

## Data structures

Most data structure classes share a common interoperability contract:
`static fromArray`, `toArray`, and `[Symbol.iterator]`, making structures
convertible through `Array` as the universal interchange format.
`ConsList` also exposes `static fromIterable`.

`CircularBuffer` is a growable ring with Array-like end operations
(`unshift` / `push` / `shift` / `pop`) and random access through `at`.
`Deque` exposes the same double-ended operations over `CircularBuffer`.
`Queue` (`enqueue` / `dequeue` / `peek`) and `Stack`
(`push` / `pop` / `peek`) are thin ADT facades over `CircularBuffer`.

`List` is a mutable sequence backed by a doubly-linked `ListNode` chain.
`ListNode` is the low-level link cell (`create` / `append` / `prepend` /
`unlink` / `seek` / `fromArray` / `copy` / `link`) for custom structures
that own their own head, tail, and size.

`ConsList` is an immutable cons-list ADT with structural sharing.
`Trie` is a prefix tree for string keys with optional associated values.
`UnrolledList` is a specialized high-throughput FIFO backed by pooled
unrolled nodes; it does not implement the Array interoperability helpers.

| Class            | ADT            | Backed by        | Ends | Index |
| ---------------- | -------------- | ---------------- | ---- | ----- |
| `CircularBuffer` | ring buffer    | array            | O(1) | O(1)  |
| `Deque`          | double-ended   | `CircularBuffer` | O(1) | —     |
| `Queue`          | FIFO           | `CircularBuffer` | O(1) | —     |
| `Stack`          | LIFO           | `CircularBuffer` | O(1) | —     |
| `UnrolledList`   | FIFO           | pooled unrolled  | O(1) | —     |
| `List`           | sequence       | `ListNode`       | O(1) | O(n)  |
| `ConsList`       | immutable cons | shared nodes     | O(1) | O(n)  |
| `Trie`           | prefix map     | character nodes  | —    | —     |

```js
// Any interoperable structure can feed any other through Array
const list = List.fromArray([1, 2, 3, 4, 5]);
const queue = Queue.fromArray(list.filter((n) => n % 2 === 0).toArray());
const deque = Deque.fromArray(queue.toArray());
const cons = ConsList.fromArray(deque.toArray());
```

## Class `ConsList`

An immutable singly-linked cons-list with structural sharing.
Every `prepend` returns a new `ConsList` that shares its tail with the
original — enabling multiple independent branches from a common suffix
at zero copy cost (inspired by LISP cons cells).

- `static empty: ConsList<never>` — canonical empty singleton
- `static of<T>(...values: Array<T>): ConsList<T>` — build from arguments
  in order (same as `fromArray(values)`)
- `static fromArray<T>(values: Array<T>): ConsList<T>`
- `static fromIterable<T>(iterable: Iterable<T>): ConsList<T>`
- `static merge<T>(...lists: Array<ConsList<T>>): ConsList<T>` — join in
  argument order (`merge(a, b)` → `a` then `b`); O(n) over all but the
  last list; shares the last list as suffix; no args → `empty`
- `prepend(value: T): ConsList<T>` — O(1), new list with `value` at the
  front, sharing this list as tail
- `uncons(): Uncons<T>` — split head and rest
  (`empty` → `{ value: undefined, tail: empty }`); inverse of `cons`
- `equals(other: ConsList<T>): boolean` — structural equality (`===` on
  elements; non-`ConsList` → `false`; same reference short-circuits)
- `includes(value: T): boolean` — O(n), whether `value` appears (`===`)
- `member(value: T): ConsList<T>` — O(n), first suffix whose head `===`
  `value` (shared node), or `empty` if missing; e.g.
  `of(1, 2, 3).member(2)` → `[2, 3]`
- `toReversed(): ConsList<T>` — O(n), new list in reverse order
- `map<U>(fn: (value: T, index: number) => U): ConsList<U>` — O(n), new
  list of mapped values
- `filter(fn: (value: T, index: number) => boolean): ConsList<T>` — O(n),
  keeps elements where `fn` returns strictly `true`
- `find(fn: (value: T, index: number) => boolean): T | undefined` — O(n),
  first element where `fn` returns strictly `true`
- `some(fn: (value: T, index: number) => boolean): boolean` — O(n), whether
  `fn` returns strictly `true` for any element
- `every(fn: (value: T, index: number) => boolean): boolean` — O(n), whether
  `fn` never returns strictly `false`
- `reduce(fn: (acc: T, value: T, index: number) => T): T` — O(n); throws
  `TypeError` on empty list without a seed
- `reduce<U>(fn: (acc: U, value: T, index: number) => U, acc: U): U` —
  O(n)
- `readonly value: T | undefined` — head (front) element
- `readonly tail: ConsList<T>` — rest after the head (O(1), shared;
  `empty` when none)
- `toArray(): Array<T>`
- `[Symbol.iterator](): IterableIterator<T>`
- `readonly size: number`
- `isEmpty(): boolean`

**Interface `Uncons<T>`** — result of `uncons()`:

- `value: T | undefined`
- `tail: ConsList<T>`

```js
const shared = ConsList.of(3, 4, 5);

const branch1 = shared.prepend(2).prepend(1); // [1, 2, 3, 4, 5]
const branch2 = shared.prepend(99); // [99, 3, 4, 5]

// Both branches share the [3, 4, 5] suffix — no copying
console.log(branch1.tail.tail === shared); // true
console.log(branch2.tail === shared); // true
```

```js
const { ConsList, cons } = metautil;

const list = ConsList.of(1, 2, 3);
const { value, tail } = list.uncons();
console.log(value); // 1
console.log(tail.toArray()); // [2, 3]

// Round-trip with cons (inverse of uncons)
console.log(cons(value, tail).toArray()); // [1, 2, 3]

const empty = ConsList.empty.uncons();
console.log(empty.value); // undefined
console.log(empty.tail === ConsList.empty); // true
```

**Use case: undo history with branching (time-travel state)**

```js
let history = ConsList.of('draft v1');
history = history.prepend('draft v2');
history = history.prepend('draft v3');
console.log(history.value); // 'draft v3'

// Jump back in time — earlier states remain valid and untouched
const undone = history.tail;
console.log(undone.value); // 'draft v2'

// Branch a new edit off the older state without affecting `history`
const branched = undone.prepend('draft v2b');
console.log(branched.toArray()); // ['draft v2b', 'draft v2', 'draft v1']
console.log(history.toArray()); // ['draft v3', 'draft v2', 'draft v1']
```

## Function `cons`

Lisp-style constructor for `ConsList`: prepends `value` onto `tail`.

- `cons(value: T, tail?: ConsList<T>): ConsList<T>` — same as
  `tail.prepend(value)`; `tail` defaults to `ConsList.empty`

```js
const { cons } = metautil;

const list = cons(1, cons(2, cons(3)));
console.log(list.toArray()); // [1, 2, 3]
console.log(list.value); // 1
console.log(list.tail.value); // 2
```

## Function `uncons`

Inverse of `cons`: splits a `ConsList` into head and tail.

- `uncons(list: ConsList<T>): Uncons<T>` — same as `list.uncons()`

```js
const { cons, uncons } = metautil;

const list = cons(1, cons(2, cons(3)));
const { value, tail } = uncons(list);
console.log(value); // 1
console.log(tail.toArray()); // [2, 3]
console.log(cons(value, tail).toArray()); // [1, 2, 3]
```

## Class `ListNode`

Low-level doubly-linked node. Callers own head/tail/size invariants;
mutating `prev` / `next` directly can corrupt any structure that uses
the node.

- `constructor(value?: T)` — creates an unlinked node (`prev` / `next`
  are `null`)
- `value: T`
- `prev: ListNode<T> | null`
- `next: ListNode<T> | null`
- `append(value?: T): ListNode<T>` — splice a new node after this
- `prepend(value?: T): ListNode<T>` — splice a new node before this
- `unlink(): { prev, next }` — remove this from neighbors; clears links
- `seek(n?: number): ListNode<T> | null` — move `n` steps (`+` via
  `next`, `-` via `prev`); `0` returns this; non-integer or past the end
  → `null`
- `static create<T>(value?: T, prev?: ListNode<T> | null, next?: ListNode<T> | null): ListNode<T>` —
  allocate and wire neighbors (`prev.next` / `next.prev`)
- `static fromArray<T>(values: ArrayLike<T>): { head, tail, size }` —
  build a detached chain; empty → `{ head: null, tail: null, size: 0 }`
- `static copy<T>(node: ListNode<T>, count: number): { head, tail, next, size }` —
  clone `count` nodes starting from `node`; `next` is the first source
  node after the copied range (or `node` when `count` is invalid /
  non-positive)
- `static link(left: ListNode<T> | null, right: ListNode<T> | null): void` —
  link `left.next` / `right.prev`; null side is skipped

```js
const { ListNode } = metautil;

const a = new ListNode(1);
const b = ListNode.create(2, a);
console.log(a.next.value); // 2
console.log(b.prev.value); // 1
```

## Class `List`

A doubly-linked-list-backed sequence with a comprehensive API.
`append` / `prepend` are O(1); index-based operations are O(n).
Internally uses `ListNode`; the public API is value/index based and
does not expose nodes. Indexes and counts must be integers
(non-integers are ignored / no-op). Negative indexes count from the end
(`at(-1)` is the last element).

**Construction**

- `constructor()`
- `static of<T>(...values: Array<T>): List<T>`
- `static fromArray<T>(values: Array<T>): List<T>`
- `static merge<T>(...lists: Array<List<T>>): List<T>`

**CRUD / index**

- `append(...values: Array<T>): void`
- `prepend(...values: Array<T>): void`
- `insert(index: number, ...values: Array<T>): void`
- `delete(index: number, count?: number): void`
- `at(index: number): T | undefined`
- `set(index: number, value: T): void`

**Slicing**

- `drop(n: number): void` — drops first n (or last |n| if negative)
- `take(n: number): List<T> | null` — first n (or last |n| if negative);
  non-integer, `0`, or empty source → `null`
- `slice(start?: number, end?: number): List<T> | null` — non-integer
  bounds or empty range → `null`

**Rearranging**

- `rotate(n?: number): void` — positive rotates left, negative right
  (default 1); non-integer → no-op
- `swap(i: number, j: number): void`
- `move(from: number, to: number): void`
- `splitAt(index: number): { before: List<T>; after: List<T> }` —
  non-integer index treated as `0`
- `groupBy<K>(getKey: (value: T) => K): Map<K, List<T>>`

**Search / compare**

- `includes(value: T): boolean` — strict `===` (`NaN` → `false`)
- `indexOf(value: T): number` — strict `===` (`NaN` → `-1`)
- `lastIndexOf(value: T): number` — strict `===`

**Bulk mutations**

- `remove(...values: Array<T>): number` — strict `===` match; returns
  how many nodes were removed
- `replace(oldValue: T, newValue?: T): void` — strict `===` match

**Ordering**

- `reverse(): void`
- `toReversed(): List<T>`
- `sort(compare?: (a: T, b: T) => number): void`
- `toSorted(compare?: (a: T, b: T) => number): List<T>`

**Functional**

- `map<U>(fn: (value: T, index: number) => U): List<U>`
- `flatMap<U>(fn: (value: T) => Iterable<U>): List<U>`
- `filter(fn: (value: T, index: number) => boolean): List<T>`
- `reduce<U>(fn: (acc: U, value: T, index: number) => U, initial: U): U`
- `some(fn: (value: T, index: number) => boolean): boolean`
- `every(fn: (value: T, index: number) => boolean): boolean`
- `find(fn: (value: T, index: number) => boolean): T | undefined`
- `findIndex(fn: (value: T, index: number) => boolean): number`

**Stats**

- `sum(fn: (value: T) => number): number`
- `avg(fn: (value: T) => number): number`
- `min(compare: (a: T, b: T) => number): T | undefined`
- `max(compare: (a: T, b: T) => number): T | undefined`

**Utility**

- `isEmpty(): boolean`
- `clear(): void`
- `toArray(): Array<T>`
- `clone(): List<T>`
- `[Symbol.iterator](): IterableIterator<T>`
- `size: number`

```js
const list = List.fromArray([1, 2, 3, 4, 5]);
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
const playlist = List.fromArray(['intro', 'verse', 'chorus', 'outro']);

playlist.move(3, 0); // move 'outro' to the front
console.log(playlist.toArray()); // ['outro', 'intro', 'verse', 'chorus']

console.log(playlist.find((track) => track.startsWith('ch'))); // 'chorus'
```

## Class `CircularBuffer`

Growable circular (ring) buffer with power-of-two capacity. Shared engine
for `Deque`, `Queue`, and `Stack`. O(1) ops at both ends via masked index
wrap — Array-like names: `unshift` / `push` / `shift` / `pop`.

- `constructor()`
- `static fromArray<T>(values: Array<T>): CircularBuffer<T>`
- `unshift(value: T): void` — insert at the front
- `push(value: T): void` — insert at the back
- `shift(): T | undefined` — remove and return the front element
- `pop(): T | undefined` — remove and return the back element
- `at(index: number): T | undefined` — Array-like index access (`-1` is last)
- `isEmpty(): boolean`
- `includes(value: T): boolean`
- `every(fn: (value: T, index: number) => boolean): boolean` — whether
  `fn` never returns strictly `false`
- `reduce(fn: (acc: T, value: T, index: number) => T): T` — Array-like;
  throws `TypeError` when empty without a seed
- `reduce<U>(fn: (acc: U, value: T, index: number) => U, acc: U): U` —
  explicit seed
- `clear(): void`
- `toArray(): Array<T>`
- `[Symbol.iterator](): IterableIterator<T>`
- `size: number`

```js
const buf = CircularBuffer.fromArray([1, 2, 3]);
buf.unshift(0);
buf.push(4);
console.log(buf.shift()); // 0
console.log(buf.pop()); // 4
console.log(buf.toArray()); // [1, 2, 3]
```

## Class `Deque`

Double-ended queue facade over `CircularBuffer`. Supports O(1) ops at
both ends with Array-like names (`unshift` / `push` / `shift` / `pop`).

- `constructor()`
- `static fromArray<T>(values: Array<T>): Deque<T>`
- `unshift(value: T): void` — insert at the front
- `push(value: T): void` — insert at the back
- `shift(): T | undefined` — remove and return the front element
- `pop(): T | undefined` — remove and return the back element
- `isEmpty(): boolean`
- `includes(value: T): boolean`
- `every(fn: (value: T, index: number) => boolean): boolean` — delegates
  to `CircularBuffer`
- `reduce(fn: (acc: T, value: T, index: number) => T): T` — Array-like;
  (delegates to `CircularBuffer`)
- `reduce<U>(fn: (acc: U, value: T, index: number) => U, acc: U): U`
- `clear(): void`
- `toArray(): Array<T>`
- `[Symbol.iterator](): IterableIterator<T>` — delegates to `CircularBuffer`
- `size: number`

```js
const deque = Deque.fromArray([1, 2, 3, 4, 5]);
deque.unshift(0);
deque.push(6);
console.log(deque.shift()); // 0
console.log(deque.pop()); // 6
console.log(deque.toArray()); // [1, 2, 3, 4, 5]
```

## Class `Queue`

FIFO (first in, first out) facade over `CircularBuffer`: `enqueue`
appends at the back, `dequeue` / `peek` operate at the front. Same O(1)
end costs as `CircularBuffer`.

- `constructor()`
- `static fromArray<T>(values: Array<T>): Queue<T>`
- `enqueue(value: T): void` — appends at the back
- `dequeue(): T | undefined` — removes and returns the front
- `peek(): T | undefined` — front element, does not remove
- `isEmpty(): boolean`
- `includes(value: T): boolean`
- `clear(): void`
- `toArray(): Array<T>`
- `[Symbol.iterator](): IterableIterator<T>` — delegates to `CircularBuffer`
- `size: number`

```js
const queue = new Queue();
queue.enqueue('a');
queue.enqueue('b');
queue.enqueue('c');
console.log(queue.peek()); // 'a'
console.log(queue.dequeue()); // 'a'
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

## Class `UnrolledList`

High-throughput FIFO queue backed by a singly-linked chain of fixed-size
array nodes, with an internal pool that reuses drained nodes. Prefer this
over `Queue` when enqueue/dequeue volume is high and you do not need
index access, peek, or Array interop.

- `constructor(options?: UnrolledListOptions)`
  - `options.nodeSize?: number` — items per node (default `1024`)
  - `options.poolSize?: number` — max pooled drained nodes (default `2`)
- `enqueue(item: T): void` — append at the write end
- `dequeue(): T | undefined` — remove and return from the read end
- `size: number`

```js
const list = new UnrolledList({ nodeSize: 64, poolSize: 4 });
list.enqueue('a');
list.enqueue('b');
console.log(list.dequeue()); // 'a'
console.log(list.size); // 1
```

**Use case: event / task drain loop**

```js
const pending = new UnrolledList({ nodeSize: 256 });

const schedule = (task) => {
  pending.enqueue(task);
};

const drain = () => {
  let task = pending.dequeue();
  while (task !== undefined) {
    task();
    task = pending.dequeue();
  }
};
```

## Class `Stack`

LIFO (last in, first out) facade over `CircularBuffer`: `push` / `pop` /
`peek` operate at the back. Same O(1) end costs as `CircularBuffer`.

- `constructor()`
- `static fromArray<T>(values: Array<T>): Stack<T>`
- `push(value: T): void` — appends at the back
- `pop(): T | undefined` — removes and returns the back
- `peek(): T | undefined` — back element, does not remove
- `isEmpty(): boolean`
- `includes(value: T): boolean`
- `every(fn: (value: T, index: number) => boolean): boolean` — delegates
  to `CircularBuffer`
- `reduce(fn: (acc: T, value: T, index: number) => T): T` — Array-like;
  (delegates to `CircularBuffer`)
- `reduce<U>(fn: (acc: U, value: T, index: number) => U, acc: U): U`
- `clear(): void`
- `toArray(): Array<T>`
- `[Symbol.iterator](): IterableIterator<T>` — delegates to `CircularBuffer`
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

## Class `Trie`

Prefix tree (trie) for string keys with optional associated values.
Supports exact lookup, deletion with branch pruning, and prefix
autocomplete via `complete`.

- `readonly size: number` — number of stored keys
- `insert(word: string, value?: T): this` — store key (default value
  `true` when `T` defaults to `boolean`); throws `TypeError` if `word`
  is not a string
- `delete(word: string): boolean` — remove key and prune empty branches
- `clear(): void`
- `isEmpty(): boolean`
- `has(word: string): boolean` — exact key present
- `get(word: string): T | undefined` — associated value, or `undefined`
  if missing
- `complete(prefix: string): Array<string>` — all keys with the given
  prefix

```js
const trie = new Trie();
trie.insert('cat');
trie.insert('car', 42);
trie.insert('card');

trie.has('car'); // true
trie.get('car'); // 42
trie.complete('ca'); // ['cat', 'car', 'card'] (order may vary)
trie.delete('car'); // true
trie.size; // 2
```

## Array utilities

### `sample(array: Array<unknown>, random?: Function): unknown`

```js
const cards = ['🂡', '🃒', '🂮', '🂷', '🃚'];
const card = sample(cards);
```

### `shuffle(array: Array<unknown>, random?: Function): Array<unknown>`

```js
const players = [{ id: 10 }, { id: 12 }, { id: 15 }];
const places = shuffle(players);
```

### `projection(source: object, fields: Array<string>): Record<string, unknown>`

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
  - `listeners(eventName: EventName): Listener[]`
  - `listenerCount(eventName: EventName): number`
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
