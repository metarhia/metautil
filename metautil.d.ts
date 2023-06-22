import { EventEmitter } from 'node:events';
import { IncomingMessage } from 'node:http';
import { ScryptOptions, X509Certificate } from 'node:crypto';

type Strings = Array<string>;
type Dictionary = Record<string, unknown>;
type Cookies = Record<string, string>;
type Headers = Record<string, string>;

// Submodule: async

export function timeout(msec: number, signal?: AbortSignal): Promise<void>;
export function delay(msec: number, signal?: AbortSignal): Promise<void>;

// Submodule: crypto

export function cryptoRandom(): number;
export function generateUUID(): string;
export function generateKey(length: number, possible: string): string;
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
export function getX509(cert: X509Certificate): Strings;

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
  dd: number;
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
  constructor(message: string, options?: number | string | Error);
  message: string;
  stack: string;
  code?: number | string;
  cause?: Error;
}

export function isError(instance: object): boolean;

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

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Headers;
  body?: ArrayBuffer | Buffer | string;
};

export interface Response {
  json(): Promise<Dictionary>;
}

export function fetch(url: string, options?: FetchOptions): Promise<Response>;
export function receiveBody(stream: IncomingMessage): Promise<Buffer | null>;
export function ipToInt(ip?: string): number;

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

// Submodule: pool

export interface QueueElement {
  resolve: Function;
  timer: NodeJS.Timer;
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
  next(): Promise<unknown>;
  add(item: unknown): void;
  capture(): Promise<unknown>;
  release(item: unknown): void;
  isFree(item: unknown): boolean;
}

// Submodule: random

export function random(min: number, max?: number): number;
export function sample(array: Array<unknown>): unknown;

// Submodule: semaphore

export class Semaphore {
  constructor(concurrency: number, size?: number, timeout?: number);
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

// Submodule: units

export function bytesToSize(bytes: number): string;
export function sizeToBytes(size: string): number;
