import bcryptjs from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}
