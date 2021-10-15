import { IncomingMessage } from 'http';

export function fetch(url: string): Promise<object>;
export function receiveBody(req: IncomingMessage): Promise<Buffer | null>;
