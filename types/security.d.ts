declare module 'security' {
  function cryptoRandom(): number;
  function generateKey(length: number, possible: string): string;
  function crcToken(secret: string, key: string): string;
  function generateToken(secret: string, characters: string, length: number): string;
  function validateToken(secret: string, token: string): boolean;
  function hashPassword(password: string): Promise<string>;
  function validatePassword(password: string, serHash: string): Promise<boolean>;
}
