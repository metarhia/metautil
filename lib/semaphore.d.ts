export interface QueueElement {
  resolve: Function;
  timer: NodeJS.Timer;
}

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
