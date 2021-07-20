import { EventEmitter } from 'events';

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
export function parseParams(params: string): object;
export function replace(str: string, substr: string, newstr: string): string;
export function split(s: string, separator: string): [string, string];
export function fileExt(fileName: string): string;
export function between(s: string, prefix: string, suffix: string): string;
export function isFirstUpper(s: string): boolean;
export function toLowerCamel(s: string): string;
export function toUpperCamel(s: string): string;
export function isConstant(s: string): boolean;
export function nowDate(date?: Date): string;
export function duration(s: string | number): number;

type Every = {
  month: number;
  day: number;
  dd: number;
  hh: number;
  mm: number;
  interval: number;
};

export type { Every };

export function parseEvery(s: string): Every;
export function makePrivate(instance: object): object;

export function protect(
  allowMixins: Array<string>,
  ...namespaces: Array<object>
): void;

export function parseCookies(cookie: string): object;

export interface AbortController {
  abort: Function;
  signal: EventEmitter;
}

export function createAbortController(): AbortController;
export function timeout(msec: number, signal?: EventEmitter): Promise<void>;
export function delay(msec: number, signal?: EventEmitter): Promise<void>;

export interface QueueElement {
  resolve: Function;
  timer: NodeJS.Timer;
}

export class Semaphore {
  constructor(concurrency: number, size?: number, timeout?: number);
  counter: number;
  timeout: number;
  size: number;
  queue: Array<QueueElement>;
  enter(): Promise<void>;
  leave(): void;
}
