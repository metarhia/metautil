import EventEmitter = require('events');

interface Dictionary<T> {
  [key: string]: T;
}

export function cryptoRandom(): number;
export function generateKey(length: number, possible: string): string;
export function crcToken(secret: string, key: string): string;

export function generateToken(
  secret: string,
  characters: string,
  length: number
): string;

export function validateToken(secret: string, token: string): boolean;
export function hashPassword(password: string): Promise<string>;

export function validatePassword(
  password: string,
  serHash: string
): Promise<boolean>;

export function random(min: number, max?: number): number;
export function sample(arr: Array<any>): any;
export function ipToInt(ip?: string): number;
export function parseHost(host?: string): string;
export function replace(str: string, substr: string, newstr: string): string;
export function fileExt(fileName: string): string;
export function between(s: string, prefix: string, suffix: string): string;
export function isFirstUpper(s: string): boolean;
export function isConstant(s: string): boolean;
export function nowDate(date?: Date): string;
export function duration(s: string | number): number;
export function makePrivate(instance: Dictionary<any>): Dictionary<any>;

export function protect(
  allowMixins: Array<string>,
  ...namespaces: Array<Dictionary<any>>
): void;

export function parseCookies(cookie: string): Dictionary<string>;

interface AbortController {
  abort: Function;
  signal: EventEmitter;
}

export function createAbortController(): AbortController;
export function timeout(msec: number, signal?: EventEmitter): Promise<void>;
export function delay(msec: number, signal?: EventEmitter): Promise<void>;

interface QueueElement {
  resolve: Function;
  timer: NodeJS.Timer;
}

export class Semaphore {
  constructor(concurrency: number, size: number, timeout: number);
  counter: number;
  timeout: number;
  size: number;
  queue: Array<QueueElement>;
  enter(): Promise<void>;
  leave(): void;
}
