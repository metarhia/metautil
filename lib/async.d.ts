import { EventEmitter } from 'events';

export interface AbortController {
  abort: Function;
  signal: EventEmitter;
}

export function createAbortController(): AbortController;
export function timeout(msec: number, signal?: EventEmitter): Promise<void>;
export function delay(msec: number, signal?: EventEmitter): Promise<void>;
