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
export function jsonParse(
  data: Buffer | string | null | undefined,
): Dictionary | null;
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

export class Cons {
  readonly value: unknown;
  readonly next: unknown;
  constructor(value: unknown, next?: unknown);
  static value(pair: Cons): unknown;
  static next(pair: Cons): unknown;
}

export function cons(value: unknown, next?: unknown): Cons;

// Submodule: pool

export interface QueueElement {
  resolve: Function;
  timer: NodeJS.Timeout;
}

export interface PoolOptions {
  timeout?: number;
}

export class Lease {
  constructor(resource: unknown, release: () => void);
  readonly resource: unknown;
  release(): void;
}

export class Pool {
  constructor(options?: PoolOptions);
  next(): unknown | null;
  add(resource: unknown): void;
  capture(): Lease | Promise<Lease> | null;
  release(lease: Lease): void;
  isFree(resource: unknown): boolean;
}

// Submodule: result

export class Result<T = unknown> {
  constructor(value?: T | null, error?: unknown);
  static ok<T = unknown>(value?: T | null): Result<T>;
  static fail<T = unknown>(error: unknown): Result<T>;
  static from<T = unknown>(fn: () => T): Result<T>;
  static fromAsync<T = unknown>(fn: () => Promise<T>): Promise<Result<T>>;
  value: T | null;
  error: unknown;
  ok: boolean;
  unwrap(defaultValue?: T): T;
  map<U = unknown>(fn: (value: T) => U): Result<U>;
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

// Submodule: list

export interface Sequence<T> extends Iterable<T>, AsyncIterable<T> {
  readonly size: number;
  first(): T | undefined;
  last(): T | undefined;
  includes(value: T): boolean;
  isEmpty(): boolean;
  clear(): void;
  toArray(): Array<T>;
  [Symbol.iterator](): IterableIterator<T>;
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

export interface Indexable<T> {
  at(index: number): T | undefined;
  set(index: number, value: T): void;
}

export class List<T> implements Sequence<T>, Indexable<T> {
  readonly size: number;
  constructor();
  static fromArray<T>(values: Array<T>): List<T>;
  static fromIterable<T>(iterable: Iterable<T>): List<T>;
  static range(start: number, end: number, step?: number): List<number>;
  static merge<T>(lists: Array<List<T>>): List<T>;

  append(value: T): void;
  prepend(value: T): void;
  enqueue(value: T): void;
  dequeue(): T | undefined;
  insert(index: number, value: T, count?: number): void;
  delete(index: number, count?: number): void;

  at(index: number): T | undefined;
  set(index: number, value: T): void;
  first(): T | undefined;
  last(): T | undefined;

  tail(n?: number): List<T>;
  init(n?: number): List<T>;
  drop(n: number): void;
  take(n: number): List<T>;
  slice(start?: number, end?: number): List<T>;

  rotateLeft(steps?: number): void;
  rotateRight(steps?: number): void;
  rotate(n: number): void;
  swap(i: number, j: number): void;
  move(from: number, to: number): void;
  splitAt(index: number): { before: List<T>; after: List<T> };
  groupBy<K>(key: (v: T) => K): Map<K, List<T>>;

  includes(value: T): boolean;
  indexOf(value: T): number;
  lastIndexOf(value: T): number;
  equals(other: List<T>): boolean;

  addAll(values: Iterable<T>): void;
  removeAll(values: Iterable<T>): void;
  fill(value: T, start?: number, end?: number): void;
  replace(oldValue: T, newValue: T): void;
  distinct(): void;
  toDistinct(): List<T>;

  shuffle(): void;
  toShuffled(): List<T>;
  reverse(): void;
  toReversed(): List<T>;
  sort(compare?: (a: T, b: T) => number): void;
  toSorted(compare?: (a: T, b: T) => number): List<T>;

  map<U>(fn: (value: T, index: number) => U): List<U>;
  lazyMap<U>(fn: (value: T, index: number) => U): IterableIterator<U>;
  flatMap<U>(fn: (value: T) => Iterable<U>): List<U>;
  filter(fn: (value: T, index: number) => boolean): List<T>;
  lazyFilter(fn: (value: T, index: number) => boolean): IterableIterator<T>;
  reduce<U>(fn: (acc: U, value: T, index: number) => U, initial: U): U;
  lazyReduce<U>(
    fn: (acc: U, value: T, index: number) => U,
    initial: U,
  ): IterableIterator<U>;
  some(fn: (value: T, index: number) => boolean): boolean;
  every(fn: (value: T, index: number) => boolean): boolean;
  find(fn: (value: T, index: number) => boolean): T | undefined;
  findIndex(fn: (value: T, index: number) => boolean): number;

  sum(fn?: (value: T) => number): number;
  avg(fn?: (value: T) => number): number;
  min(compare?: (a: T, b: T) => number): T | undefined;
  max(compare?: (a: T, b: T) => number): T | undefined;

  isEmpty(): boolean;
  clear(): void;
  toArray(): Array<T>;
  join(separator?: string): string;
  clone(): List<T>;
  [Symbol.iterator](): IterableIterator<T>;
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

export class ConsList<T> {
  readonly value: T | undefined;
  readonly next: ConsList<T> | null;
  readonly size: number;
  isEmpty(): boolean;

  static readonly empty: ConsList<any>;
  static of<T>(...values: Array<T>): ConsList<T>;
  static fromArray<T>(values: Array<T>): ConsList<T>;
  static fromIterable<T>(iterable: Iterable<T>): ConsList<T>;

  prepend(value: T): ConsList<T>;
  first(): T | undefined;
  rest(): ConsList<T>;
  toArray(): Array<T>;
  [Symbol.iterator](): Iterator<T>;
}

export class Deque<T> implements Sequence<T>, Indexable<T> {
  readonly size: number;
  constructor();
  static fromArray<T>(values: Array<T>): Deque<T>;
  static fromIterable<T>(iterable: Iterable<T>): Deque<T>;
  static range(start: number, end: number, step?: number): Deque<number>;
  prepend(value: T): void;
  append(value: T): void;
  dequeue(): T | undefined;
  pop(): T | undefined;
  at(index: number): T | undefined;
  set(index: number, value: T): void;
  first(): T | undefined;
  last(): T | undefined;
  isEmpty(): boolean;
  includes(value: T): boolean;
  equals(other: Deque<T>): boolean;
  rotateLeft(steps?: number): void;
  rotateRight(steps?: number): void;
  clear(): void;
  toArray(): Array<T>;
  clone(): Deque<T>;
  [Symbol.iterator](): IterableIterator<T>;
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

export class Queue<T> implements Sequence<T> {
  readonly size: number;
  constructor();
  static fromArray<T>(values: Array<T>): Queue<T>;
  static fromIterable<T>(iterable: Iterable<T>): Queue<T>;
  enqueue(value: T): void;
  dequeue(): T | undefined;
  peek(): T | undefined;
  first(): T | undefined;
  last(): T | undefined;
  isEmpty(): boolean;
  includes(value: T): boolean;
  clear(): void;
  toArray(): Array<T>;
  clone(): Queue<T>;
  [Symbol.iterator](): IterableIterator<T>;
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

export class Stack<T> implements Sequence<T> {
  readonly size: number;
  constructor();
  static fromArray<T>(values: Array<T>): Stack<T>;
  static fromIterable<T>(iterable: Iterable<T>): Stack<T>;
  push(value: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  first(): T | undefined;
  last(): T | undefined;
  isEmpty(): boolean;
  includes(value: T): boolean;
  clear(): void;
  toArray(): Array<T>;
  clone(): Stack<T>;
  [Symbol.iterator](): IterableIterator<T>;
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

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

// Submodule: struct

type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'function'
  | 'symbol'
  | 'bigint'
  | 'object'
  | 'array'
  | 'unknown'
  | 'ref';

export type StructSchema<T extends Dictionary> = {
  readonly [K in keyof T]: FieldType;
};

export interface StructInstance<T extends Dictionary> {
  update(updates: Partial<T>): this;
  fork(updates?: Partial<T>): this;
  branch(updates?: Partial<T>): this;
  toObject(): T;
}

export type StructRecord<T extends Dictionary> = T & StructInstance<T>;

export interface StructClass<T extends Dictionary> {
  new (data?: Partial<T>): StructRecord<T>;
  readonly fields: Array<keyof T>;
  readonly schema: StructSchema<T>;
  readonly mutable: boolean;
  create(data?: Partial<T>): StructRecord<T>;
}

type StructFactory = <T extends Dictionary>(
  className: string,
  defaults: T,
) => StructClass<T>;

export class Struct {
  static immutable: StructFactory;
  static mutable: StructFactory;
}
