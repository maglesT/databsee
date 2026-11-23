// Settings from the environment (set by apply.sh from the customer config and secrets, slice A6).
// Product defaults, not regulatory numbers (register PL-04).
export const POLICY = {
  sessionIdleMinutes: Number(process.env.SESSION_IDLE_MINUTES ?? 15),
  maxFailedAttempts: Number(process.env.MAX_FAILED_ATTEMPTS ?? 5),
  // MED-05: failures count within this window, and a lock lifts after it (the alert and email stay).
  failureWindowMinutes: Number(process.env.FAILURE_WINDOW_MINUTES ?? 15),
  // MED-05: failed sign-ins allowed per client address per minute, over all logins; more get 429.
  failuresPerIpPerMinute: Number(process.env.FAILURES_PER_IP_PER_MINUTE ?? 10),
  passwordMaxAgeDays: Number(process.env.PASSWORD_MAX_AGE_DAYS ?? 90),
};

import type { OidcSettings } from './oidc.js';
import { CORE_READS } from '../products.js';

export interface Config {
  identityUrl: string;            // postgres URL of the identity database as core_app
  masterDataUrl: string;          // postgres URL of the master_data database as core_app
  securityContact: string | null; // site security contact for lockout emails (decision D-03)
  smtpUrl: string | null;         // e.g. smtp://user:pass@mail.example:587
  mailFrom: string;
  secureCookies: boolean;
  oidc: OidcSettings | undefined;   // single sign-on; off when OIDC_ISSUER is unset
  linkUrls: Record<string, string>; // core's own links (D-75): provider database -> URL as core_app, <DB>_DATABASE_URL from apply
}

export function configFromEnv(): Config {
  const identityUrl = process.env.IDENTITY_DATABASE_URL;
  if (!identityUrl) throw new Error('IDENTITY_DATABASE_URL is required');
  const masterDataUrl = process.env.MASTER_DATA_DATABASE_URL;
  if (!masterDataUrl) throw new Error('MASTER_DATA_DATABASE_URL is required');
  return {
    identityUrl,
    masterDataUrl,
    securityContact: process.env.SECURITY_CONTACT_EMAIL || null,
    smtpUrl: process.env.SMTP_URL || null,
    mailFrom: process.env.MAIL_FROM || 'medhanta@localhost',
    secureCookies: process.env.SECURE_COOKIES !== 'false',
    oidc: process.env.OIDC_ISSUER
      ? {
          issuer: process.env.OIDC_ISSUER,
          clients: JSON.parse(process.env.OIDC_CLIENTS ?? '[]'),        // [{client_id, client_secret, redirect_uris}]
          jwks: JSON.parse(process.env.OIDC_JWKS ?? 'null'),            // {keys: [private JWK]}
          cookieKeys: (process.env.OIDC_COOKIE_KEYS ?? '').split(',').filter(Boolean),
        }
      : undefined,
    linkUrls: Object.fromEntries(Object.keys(CORE_READS).flatMap((db) => {
      const url = process.env[`${db.toUpperCase()}_DATABASE_URL`];
      return url ? [[db, url]] : [];
    })),
  };
}
