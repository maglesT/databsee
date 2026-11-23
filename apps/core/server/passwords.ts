// Reused from the Logbook (server/passwords.ts): scrypt hashes, temporary passwords, password rules.
import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const scrypt = (pw: string, salt: Buffer, len: number, opts: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => scryptCb(pw, salt, len, opts, (err, key) => (err ? reject(err) : resolve(key))));

// OWASP minimum for scrypt: N = 2^17 (128 MiB), r = 8, p = 1. Older hashes (N = 2^14) keep working and are
// replaced by a hash at this cost at the person's next good sign-in (needsRehash).
const N = 131072;
const R = 8;
const P = 1;
const LEN = 64;
const MAXMEM = 256 * 1024 * 1024;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, LEN, { N, r: R, p: P, maxmem: MAXMEM });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, salt, hash] = stored.split('$');
  if (alg !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const key = await scrypt(password, Buffer.from(salt, 'base64'), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MAXMEM,
  });
  return timingSafeEqual(key, expected);
}

/** True when the stored hash was made with a lower cost than today's. */
export const needsRehash = (stored: string) => Number(stored.split('$')[1]) < N;

// Shown once to the admin; the user must change it at first login (PL-04). Valid for TEMP_PASSWORD_HOURS.
export function temporaryPassword(): string {
  return randomBytes(9).toString('base64url');
}
export const TEMP_PASSWORD_HOURS = 72;

/** How many of a person's last passwords may not be used again. */
export const PASSWORD_HISTORY = 5;
export const MIN_PASSWORD_LENGTH = 12;

// The 10,000 most common passwords (lower case), shipped as a file.
const COMMON = new Set(readFileSync(fileURLToPath(new URL('./common-passwords.txt', import.meta.url)), 'utf8').split('\n').filter(Boolean));

/** Common if the password, or the password without trailing digits and symbols, is on the list (Password1234! -> password). */
export function isCommonPassword(password: string): boolean {
  const p = password.toLowerCase();
  return COMMON.has(p) || COMMON.has(p.replace(/[\d\W_]+$/, ''));
}

export function passwordProblem(password: string, username: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password.toLowerCase().includes(username.toLowerCase())) return 'Password must not contain the login ID.';
  if (isCommonPassword(password)) return 'That password is too common. Choose another.';
  return null;
}
