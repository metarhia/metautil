import { IncomingMessage } from 'http';

export function fetch(url: string): Promise<string>;
export function receiveBody(req: IncomingMessage): Promise<Buffer | null>;
