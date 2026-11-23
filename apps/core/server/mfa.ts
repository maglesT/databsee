// Two-step sign-in with an authenticator app: TOTP (RFC 6238: HMAC-SHA1, 30 s steps, 6 digits) and recovery codes.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32(buf: Buffer): string {
  let bits = 0, value = 0, out = '';
  for (const byte of buf) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { out += B32[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text: string): Buffer {
  let bits = 0, value = 0;
  const out: number[] = [];
  for (const ch of text.replace(/=+$/, '').toUpperCase()) {
    const i = B32.indexOf(ch);
    if (i < 0) throw new Error('not base32');
    value = (value << 5) | i; bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  return Buffer.from(out);
}

export const newSecret = () => base32(randomBytes(20));
export const stepOf = (ms = Date.now()) => Math.floor(ms / 30000);

/** The 6-digit code for one 30-second step. */
export function totp(secret: string, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const h = createHmac('sha1', base32Decode(secret)).update(counter).digest();
  const o = h[19]! & 15;
  const n = ((h[o]! & 127) << 24) | (h[o + 1]! << 16) | (h[o + 2]! << 8) | h[o + 3]!;
  return String(n % 1_000_000).padStart(6, '0');
}

/**
 * The step a code belongs to (this one or one either side, for clock drift), or null. A step at or before
 * `lastStep` is refused, so one code works once.
 */
export function matchTotp(secret: string, code: string, lastStep: number, ms = Date.now()): number | null {
  if (!/^\d{6}$/.test(code)) return null;
  const now = stepOf(ms);
  for (const step of [now, now - 1, now + 1]) {
    if (step > lastStep && timingSafeEqual(Buffer.from(totp(secret, step)), Buffer.from(code))) return step;
  }
  return null;
}

/** The address an authenticator app scans. */
export const otpauthUri = (login: string, secret: string, issuer = 'Medhanta') =>
  `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(login)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

// Recovery codes: 10 characters from a 32-letter alphabet (50 bits), shown once as xxxxx-xxxxx, kept as SHA-256.
export const RECOVERY_CODES = 8;
export function newRecoveryCodes(): string[] {
  return Array.from({ length: RECOVERY_CODES }, () => {
    const c = Array.from(randomBytes(10), (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
    return `${c.slice(0, 5)}-${c.slice(5)}`;
  });
}
export const looksLikeRecoveryCode = (s: string) => /^[a-z0-9]{5}-[a-z0-9]{5}$/.test(s.trim().toLowerCase());
export const hashRecoveryCode = (s: string) => createHash('sha256').update(s.trim().toLowerCase()).digest('hex');
