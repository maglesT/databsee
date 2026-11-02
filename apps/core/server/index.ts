// Starts the core app. Usage: tsx apps/core/server/index.ts   or, at installation:
//   tsx apps/core/server/index.ts create-first-admin <login> "<full name>" "<how identity was verified>"
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { buildApp, createFirstAdmin } from './app.js';
import { configFromEnv } from './config.js';
import { smtpSender } from './mail.js';

const config = configFromEnv();
const sql = postgres(config.identityUrl, { onnotice: () => {} });

if (process.argv[2] === 'create-first-admin') {
  const [login, fullName, how] = process.argv.slice(3);
  if (!login || !fullName || !how) throw new Error('usage: create-first-admin <login> "<full name>" "<how verified>"');
  const temp = await createFirstAdmin(sql, login, fullName, how);
  console.log(`First administrator ${login} created. Temporary password (change at first sign-on): ${temp}`);
  await sql.end();
} else {
  const app = buildApp({
    sql,
    sendMail: config.smtpUrl ? smtpSender(config.smtpUrl, config.mailFrom) : null,
    securityContact: config.securityContact,
    secureCookies: config.secureCookies,
    webRoot: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../dist/core-web'),
  });
  await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT ?? 3000) });
}
