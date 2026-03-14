import { IncomingMessage } from 'node:http';
import { ScryptOptions, X509Certificate } from 'node:crypto';

type Strings = Array<string>;
type Dictionary = Record<string, unknown>;
type Cookies = Record<string, string>;
type Headers = Record<string, string>;

// Submodule: async

export const toBool: [() => boolean, () => boolean];
export function timeout(msec: number, signal?: AbortSignal): Promise<void>;
export function delay(msec: number, signal?: AbortSignal): Promise<void>;
export function timeoutify(
  promise: Promise<unknown>,
  msec: number,
): Promise<unknown>;

// Submodule: crypto

export function cryptoRandom(min?: number, max?: number): number;
export function random(min?: number, max?: number): number;
export function generateUUID(): string;
export function generateKey(possible: string, length: number): string;
export function crcToken(secret: string, key: string): string;

export function generateToken(
  secret: string,
  characters: string,
  length: number,
): string;

export function validateToken(secret: string, token: string): boolean;
export function serializeHash(hash: Buffer, salt: Buffer): string;

export interface HashInfo {
  params: ScryptOptions;
  salt: Buffer;
  hash: Buffer;
}

export function deserializeHash(phcString: string): HashInfo;
export function hashPassword(password: string): Promise<string>;
export function validatePassword(
  password: string,
  serHash: string,
): Promise<boolean>;
export function md5(fileName: string): Promise<string>;
export function getX509names(cert: X509Certificate): Strings;

// Submodule: datetime

export function duration(s: string | number): number;
export function nowDate(date?: Date): string;
export function nowDateTimeUTC(date?: Date, timeSep?: string): string;
export function parseMonth(s: string): number;
export function parseDay(s: string): number;
export function parseEvery(s: string): Every;

type Every = {
  YY: number;
  MM: number;
  DD: number;
  wd: number;
  hh: number;
  mm: number;
  ms: number;
};

export type { Every };

export function nextEvent(every: Every, date?: Date): number;

// Submodule: error

export interface ErrorOptions {
  code?: number | string;
  cause?: Error;
}

export class Error extends global.Error {
  constructor(message: string, options?: number | string | ErrorOptions);
  message: string;
  stack: string;
  code?: number | string;
  cause?: Error;
}

type Errors = Record<string, string>;

export class DomainError extends Error {
  constructor(code?: string, options?: number | string | ErrorOptions);
  message: string;
  stack: string;
  code?: number | string;
  cause?: Error;
  toError(errors: Errors): Error;
}

export function isError(instance: object): boolean;

// Submodule: file system

export function exists(path: string): Promise<boolean>;
export function directoryExists(path: string): Promise<boolean>;
export function fileExists(path: string): Promise<boolean>;
export function ensureDirectory(path: string): Promise<boolean>;

// Submodule: http

export interface StreamRange {
  start?: number;
  end?: number;
  tail?: number;
}

export function parseHost(host?: string): string;
export function parseParams(params: string): Cookies;
export function parseCookies(cookie: string): Headers;
export function parseRange(range: string): StreamRange;

// Submodule: network

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Body = ArrayBuffer | Buffer | string;

export type ApiOptions = {
  method?: HttpMethod;
  headers?: object;
  body?: Body;
};

export function receiveBody(stream: IncomingMessage): Promise<Buffer | null>;
export function ipToInt(ip?: string): number;
export function intToIp(int: number): string;
export function httpApiCall(url: string, options: ApiOptions): Promise<object>;

// Submodule: objects

type Namespaces = Array<Dictionary>;

export function makePrivate(instance: object): object;
export function protect(allowMixins: Strings, ...namespaces: Namespaces): void;
export function jsonParse(buffer: Buffer): Dictionary | null;
export function isHashObject(o: string | number | boolean | object): boolean;
export function flatObject(source: Dictionary, fields: Strings): Dictionary;
export function unflatObject(source: Dictionary, fields: Strings): Dictionary;
export function getSignature(method: Function): Strings;
export function namespaceByPath(
  namespace: Dictionary,
  path: string,
): Dictionary | null;
export function serializeArguments(fields: Strings, args: Dictionary): string;
export function firstKey(obj: Dictionary): string | undefined;
export function isInstanceOf(obj: unknown, constrName: string): boolean;

// Submodule: pool

export interface QueueElement {
  resolve: Function;
  timer: NodeJS.Timeout;
}

export class Pool {
  constructor(options: { timeout?: number });
  items: Array<unknown>;
  free: Array<boolean>;
  queue: Array<unknown>;
  current: number;
  size: number;
  available: number;
  timeout: number;
  next(exclusive?: boolean): Promise<unknown>;
  add(item: unknown): void;
  capture(): Promise<unknown>;
  release(item: unknown): void;
  isFree(item: unknown): boolean;
}

// Submodule: array

export function sample(array: Array<unknown>, random?: Function): unknown;
export function shuffle(
  array: Array<unknown>,
  random?: Function,
): Array<unknown>;
export function projection(
  source: object,
  fields: Array<string>,
): Record<string, unknown>;

// Submodule: semaphore

export interface SemaphoreOptions {
  concurrency: number;
  size?: number;
  timeout?: number;
}

export class Semaphore {
  constructor(options: SemaphoreOptions);
  concurrency: number;
  counter: number;
  timeout: number;
  size: number;
  empty: boolean;
  queue: Array<QueueElement>;
  enter(): Promise<void>;
  leave(): void;
}

// Submodule: strings

export function replace(str: string, substr: string, newstr: string): string;
export function between(s: string, prefix: string, suffix: string): string;
export function split(s: string, separator: string): [string, string];
export function isFirstUpper(s: string): boolean;
export function isFirstLower(s: string): boolean;
export function isFirstLetter(s: string): boolean;
export function toLowerCamel(s: string): string;
export function toUpperCamel(s: string): string;
export function toLower(s: string): string;
export function toCamel(separator: string): (s: string) => string;
export function spinalToCamel(s: string): string;
export function snakeToCamel(s: string): string;
export function isConstant(s: string): boolean;
export function fileExt(fileName: string): string;
export function parsePath(relPath: string): Strings;
export function trimLines(s: string): string;

// Submodule: units

export function bytesToSize(bytes: number): string;
export function sizeToBytes(size: string): number;

// Submodule: collector

export interface CollectorOptions {
  exact?: boolean;
  defaults?: object;
  timeout?: number;
  reassign?: boolean;
  validate?: (data: Record<string, unknown>) => unknown;
}

type AsyncFunction = (...args: Array<unknown>) => Promise<unknown>;

export class Collector {
  done: boolean;
  data: Dictionary;
  keys: Array<string>;
  count: number;
  exact: boolean;
  timeout: number;
  defaults: object;
  reassign: boolean;
  validate?: (data: Record<string, unknown>) => unknown;
  signal: AbortSignal;
  constructor(keys: Array<string>, options?: CollectorOptions);
  set(key: string, value: unknown): void;
  wait(
    key: string,
    fn: AsyncFunction | Promise<unknown>,
    ...args: Array<unknown>
  ): void;
  take(key: string, fn: Function, ...args: Array<unknown>): void;
  collect(sources: Record<string, Collector>): void;
  fail(error: Error): void;
  abort(): void;
  then(onFulfilled: Function, onRejected?: Function): Promise<unknown>;
}

export function collect(
  keys: Array<string>,
  options?: CollectorOptions,
): Collector;

// Submodule: list

export class List<T> {
  readonly size: number;
  constructor(size?: number);

  // Static factory methods
  static fromArray<T>(values: Array<T>): List<T>;
  static fromIterator<T>(iterator: Iterable<T>): List<T>;
  static range(start: number, end: number, step?: number): List<number>;
  static merge<T>(lists: Array<List<T>>): List<T>;

  // Core
  [Symbol.iterator](): Iterator<T>;
  [Symbol.asyncIterator](): AsyncIterator<T>;
  toArray(): Array<T>;
  clone(): List<T>;
  clear(): void;

  // Element access
  at(index: number): T | undefined;
  set(index: number, value: T): void;
  first(): T | undefined;
  last(): T | undefined;

  // Add/remove
  append(value: T): void;
  prepend(value: T): void;
  insert(index: number, value: T, count?: number): void;
  delete(index: number, count?: number): void;

  // Queue/Stack
  enqueue(value: T): void;
  dequeue(): T | undefined;

  // Slicing
  slice(start?: number, end?: number): List<T>;
  head(): List<T>;
  tail(): List<T>;
  take(n: number): List<T>;
  drop(n: number): void;
  splitAt(index: number): { before: List<T>; after: List<T> };

  // Search
  includes(value: T): boolean;
  indexOf(value: T): number;
  lastIndexOf(value: T): number;
  find(fn: (value: T, index: number) => boolean): T | undefined;
  findIndex(fn: (value: T, index: number) => boolean): number;
  equals(other: List<T>): boolean;

  // Bulk modifications
  addAll(values: Iterable<T>): void;
  removeAll(values: Iterable<T>): void;
  fill(value: T, start?: number, end?: number): void;
  replace(oldValue: T, newValue: T): void;

  // Reordering
  swap(i: number, j: number): void;
  move(from: number, to: number): void;
  rotate(n: number): void;
  rotateLeft(steps?: number): void;
  rotateRight(steps?: number): void;
  reverse(): void;
  toReversed(): List<T>;

  // Sorting & shuffling
  sort(compare?: (a: T, b: T) => number): void;
  toSorted(compare?: (a: T, b: T) => number): List<T>;
  shuffle(random?: () => number): void;
  toShuffled(random?: () => number): List<T>;

  // Deduplication
  distinct(): void;
  toDistinct(): List<T>;

  // Functional
  map<U>(fn: (value: T, index: number) => U): List<U>;
  flatMap<U>(fn: (value: T) => List<U> | Array<U>): List<U>;
  filter(fn: (value: T, index: number) => boolean): List<T>;
  reduce<U>(fn: (acc: U, value: T, index: number) => U, initial: U): U;
  some(fn: (value: T, index: number) => boolean): boolean;
  every(fn: (value: T, index: number) => boolean): boolean;
  sum(fn?: (value: T) => number): number;
  avg(fn?: (value: T) => number): number;
  min(compare?: (a: T, b: T) => number): T | undefined;
  max(compare?: (a: T, b: T) => number): T | undefined;
  groupBy<K>(key: (value: T) => K): Map<K, List<T>>;

  // Lazy iterators
  lazyMap<U>(fn: (value: T, index: number) => U): Generator<U>;
  lazyFilter(fn: (value: T, index: number) => boolean): Generator<T>;
  lazyReduce<U>(
    fn: (acc: U, value: T, index: number) => U,
    initial: U,
  ): Generator<U>;

  // String output
  join(separator?: string): string;
}

// Submodule: linkedlist

export class LinkedList<T> {
  readonly size: number;
  constructor();

  // Static factory methods
  static fromArray<T>(values: Array<T>): LinkedList<T>;
  static fromIterator<T>(iterator: Iterable<T>): LinkedList<T>;
  static range(start: number, end: number, step?: number): LinkedList<number>;
  static merge<T>(lists: Array<LinkedList<T>>): LinkedList<T>;

  // Core
  [Symbol.iterator](): Iterator<T>;
  [Symbol.asyncIterator](): AsyncIterator<T>;
  toArray(): Array<T>;
  clone(): LinkedList<T>;
  clear(): void;

  // Element access
  at(index: number): T | undefined;
  set(index: number, value: T): void;
  first(): T | undefined;
  last(): T | undefined;

  // Add/remove
  append(value: T): void;
  prepend(value: T): void;
  insert(index: number, value: T, count?: number): void;
  delete(index: number, count?: number): void;

  // Queue/Stack
  enqueue(value: T): void;
  dequeue(): T | undefined;

  // Slicing
  slice(start?: number, end?: number): LinkedList<T>;
  head(): LinkedList<T>;
  tail(): LinkedList<T>;
  take(n: number): LinkedList<T>;
  drop(n: number): void;
  splitAt(index: number): { before: LinkedList<T>; after: LinkedList<T> };

  // Search
  includes(value: T): boolean;
  indexOf(value: T): number;
  lastIndexOf(value: T): number;
  find(fn: (value: T, index: number) => boolean): T | undefined;
  findIndex(fn: (value: T, index: number) => boolean): number;
  equals(other: LinkedList<T>): boolean;

  // Bulk modifications
  addAll(values: Iterable<T>): void;
  removeAll(values: Iterable<T>): void;
  fill(value: T, start?: number, end?: number): void;
  replace(oldValue: T, newValue: T): void;

  // Reordering
  swap(i: number, j: number): void;
  move(from: number, to: number): void;
  rotate(n: number): void;
  rotateLeft(steps?: number): void;
  rotateRight(steps?: number): void;
  reverse(): void;
  toReversed(): LinkedList<T>;

  // Sorting & shuffling
  sort(compare?: (a: T, b: T) => number): void;
  toSorted(compare?: (a: T, b: T) => number): LinkedList<T>;
  shuffle(random?: () => number): void;
  toShuffled(random?: () => number): LinkedList<T>;

  // Deduplication
  distinct(): void;
  toDistinct(): LinkedList<T>;

  // Functional
  map<U>(fn: (value: T, index: number) => U): LinkedList<U>;
  flatMap<U>(fn: (value: T) => LinkedList<U> | Array<U>): LinkedList<U>;
  filter(fn: (value: T, index: number) => boolean): LinkedList<T>;
  reduce<U>(fn: (acc: U, value: T, index: number) => U, initial: U): U;
  some(fn: (value: T, index: number) => boolean): boolean;
  every(fn: (value: T, index: number) => boolean): boolean;
  sum(fn?: (value: T) => number): number;
  avg(fn?: (value: T) => number): number;
  min(compare?: (a: T, b: T) => number): T | undefined;
  max(compare?: (a: T, b: T) => number): T | undefined;
  groupBy<K>(key: (value: T) => K): Map<K, LinkedList<T>>;

  // Lazy iterators
  lazyMap<U>(fn: (value: T, index: number) => U): Generator<U>;
  lazyFilter(fn: (value: T, index: number) => boolean): Generator<T>;
  lazyReduce<U>(
    fn: (acc: U, value: T, index: number) => U,
    initial: U,
  ): Generator<U>;

  // String output
  join(separator?: string): string;
}

// Submodule: unrolledlist

export interface UnrolledListOptions {
  nodeSize?: number;
}

export class UnrolledList<T> {
  readonly size: number;
  constructor(options?: UnrolledListOptions);

  // Static factory methods
  static fromArray<T>(
    values: Array<T>,
    options?: UnrolledListOptions,
  ): UnrolledList<T>;
  static fromIterator<T>(
    iterator: Iterable<T>,
    options?: UnrolledListOptions,
  ): UnrolledList<T>;
  static range(
    start: number,
    end: number,
    step?: number,
    options?: UnrolledListOptions,
  ): UnrolledList<number>;
  static merge<T>(
    lists: Array<UnrolledList<T>>,
    options?: UnrolledListOptions,
  ): UnrolledList<T>;

  // Core
  [Symbol.iterator](): Iterator<T>;
  [Symbol.asyncIterator](): AsyncIterator<T>;
  toArray(): Array<T>;
  clone(): UnrolledList<T>;
  clear(): void;

  // Element access
  at(index: number): T | undefined;
  set(index: number, value: T): void;
  first(): T | undefined;
  last(): T | undefined;

  // Add/remove
  append(value: T): void;
  prepend(value: T): void;
  insert(index: number, value: T, count?: number): void;
  delete(index: number, count?: number): void;

  // Queue/Stack
  enqueue(value: T): void;
  dequeue(): T | undefined;

  // Slicing
  slice(start?: number, end?: number): UnrolledList<T>;
  head(): UnrolledList<T>;
  tail(): UnrolledList<T>;
  take(n: number): UnrolledList<T>;
  drop(n: number): void;
  splitAt(index: number): { before: UnrolledList<T>; after: UnrolledList<T> };

  // Search
  includes(value: T): boolean;
  indexOf(value: T): number;
  lastIndexOf(value: T): number;
  find(fn: (value: T, index: number) => boolean): T | undefined;
  findIndex(fn: (value: T, index: number) => boolean): number;
  equals(other: UnrolledList<T>): boolean;

  // Bulk modifications
  addAll(values: Iterable<T>): void;
  removeAll(values: Iterable<T>): void;
  fill(value: T, start?: number, end?: number): void;
  replace(oldValue: T, newValue: T): void;

  // Reordering
  swap(i: number, j: number): void;
  move(from: number, to: number): void;
  rotate(n: number): void;
  rotateLeft(steps?: number): void;
  rotateRight(steps?: number): void;
  reverse(): void;
  toReversed(): UnrolledList<T>;

  // Sorting & shuffling
  sort(compare?: (a: T, b: T) => number): void;
  toSorted(compare?: (a: T, b: T) => number): UnrolledList<T>;
  shuffle(random?: () => number): void;
  toShuffled(random?: () => number): UnrolledList<T>;

  // Deduplication
  distinct(): void;
  toDistinct(): UnrolledList<T>;

  // Functional
  map<U>(fn: (value: T, index: number) => U): UnrolledList<U>;
  flatMap<U>(fn: (value: T) => UnrolledList<U> | Array<U>): UnrolledList<U>;
  filter(fn: (value: T, index: number) => boolean): UnrolledList<T>;
  reduce<U>(fn: (acc: U, value: T, index: number) => U, initial: U): U;
  some(fn: (value: T, index: number) => boolean): boolean;
  every(fn: (value: T, index: number) => boolean): boolean;
  sum(fn?: (value: T) => number): number;
  avg(fn?: (value: T) => number): number;
  min(compare?: (a: T, b: T) => number): T | undefined;
  max(compare?: (a: T, b: T) => number): T | undefined;
  groupBy<K>(key: (value: T) => K): Map<K, UnrolledList<T>>;

  // Lazy iterators
  lazyMap<U>(fn: (value: T, index: number) => U): Generator<U>;
  lazyFilter(fn: (value: T, index: number) => boolean): Generator<T>;
  lazyReduce<U>(
    fn: (acc: U, value: T, index: number) => U,
    initial: U,
  ): Generator<U>;

  // String output
  join(separator?: string): string;
}

// Submodule: Events

type Listener = (data: unknown) => void;
type EventName = PropertyKey;

interface EventResolver {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export class EventIterator implements AsyncIterator<unknown> {
  constructor(emitter: Emitter, eventName: EventName);

  next(): Promise<IteratorResult<unknown>>;
  return(): Promise<IteratorResult<unknown>>;
  throw(): Promise<IteratorResult<unknown>>;
}

export class EventIterable implements AsyncIterable<unknown> {
  constructor(emitter: Emitter, eventName: EventName);
  [Symbol.asyncIterator](): EventIterator;
}

export class Emitter {
  constructor(options?: { maxListeners?: number });

  emit(eventName: EventName, data: unknown): Promise<void>;
  on(eventName: EventName, listener: Listener): void;
  once(eventName: EventName, listener: Listener): void;
  off(eventName: EventName, listener?: Listener): void;

  toPromise(eventName: EventName): Promise<unknown>;
  toAsyncIterable(eventName: EventName): AsyncIterable<unknown>;

  clear(eventName?: EventName): void;
  listeners(eventName: EventName): Listener[];
  listenerCount(eventName: EventName): number;
  eventNames(): EventName[];
}
