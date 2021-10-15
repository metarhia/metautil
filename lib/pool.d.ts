export class Pool {
  constructor(options?: { timeout?: number });
  items: Array<object>;
  free: Array<boolean>;
  queue: Array<object>;
  current: number;
  size: number;
  available: number;
  timeout: number;
  next(): Promise<object | null>;
  add(item: object): void;
  capture(): Promise<object | null>;
  release(item: object): void;
  isFree(item: object): boolean;
}
