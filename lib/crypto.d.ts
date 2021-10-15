export function cryptoRandom(): number;
export function generateKey(length: number, possible: string): string;
export function crcToken(secret: string, key: string): string;
export function md5(fileName: string): Promise<string>;

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
