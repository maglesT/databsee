// Settings from the environment (set by apply.sh from the customer config and secrets, slice A6).
// Product defaults, not regulatory numbers (register PL-04).
export const POLICY = {
  sessionIdleMinutes: Number(process.env.SESSION_IDLE_MINUTES ?? 15),
  maxFailedAttempts: Number(process.env.MAX_FAILED_ATTEMPTS ?? 5),
  passwordMaxAgeDays: Number(process.env.PASSWORD_MAX_AGE_DAYS ?? 90),
};

export interface Config {
  identityUrl: string;            // postgres URL of the identity database as core_app
  securityContact: string | null; // site security contact for lockout emails (decision D-03)
  smtpUrl: string | null;         // e.g. smtp://user:pass@mail.example:587
  mailFrom: string;
  secureCookies: boolean;
}

export function configFromEnv(): Config {
  const identityUrl = process.env.IDENTITY_DATABASE_URL;
  if (!identityUrl) throw new Error('IDENTITY_DATABASE_URL is required');
  return {
    identityUrl,
    securityContact: process.env.SECURITY_CONTACT_EMAIL || null,
    smtpUrl: process.env.SMTP_URL || null,
    mailFrom: process.env.MAIL_FROM || 'medhanta@localhost',
    secureCookies: process.env.SECURE_COOKIES !== 'false',
  };
}
