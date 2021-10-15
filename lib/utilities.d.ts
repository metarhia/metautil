export function random(min: number, max?: number): number;
export function sample(arr: Array<any>): any;
export function ipToInt(ip?: string): number;
export function parseHost(host?: string): string;
export function parseParams(params: string): object;
export function replace(str: string, substr: string, newstr: string): string;
export function split(s: string, separator: string): [string, string];
export function fileExt(fileName: string): string;
export function parsePath(relPath: string): Array<string>;
export function between(s: string, prefix: string, suffix: string): string;
export function isFirstUpper(s: string): boolean;
export function toLowerCamel(s: string): string;
export function toUpperCamel(s: string): string;
export function isConstant(s: string): boolean;
export function nowDate(date?: Date): string;
export function duration(s: string | number): number;
export function bytesToSize(bytes: number): string;
export function sizeToBytes(size: string): number;
export function namespaceByPath(namespace: object, path: string): object | null;

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
export function nextEvent(every: Every, date?: Date): number;
export function makePrivate(instance: object): object;

export function protect(
  allowMixins: Array<string>,
  ...namespaces: Array<object>
): void;

export function parseCookies(cookie: string): object;

export function jsonParse(buffer: Buffer): object | null;
