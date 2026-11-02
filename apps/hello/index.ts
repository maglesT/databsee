// Starts the hello reference product (CI and demos only). Settings from the environment, as apply.sh sets them.
import postgres from 'postgres';
import { buildHello } from './app.js';

const env = (k: string) => { const v = process.env[k]; if (!v) throw new Error(`${k} is required`); return v; };
const app = buildHello({
  db: postgres(env('HELLO_DATABASE_URL'), { onnotice: () => {} }),
  md: postgres(env('MASTER_DATA_DATABASE_URL'), { onnotice: () => {} }),
  oidc: { issuer: env('OIDC_ISSUER'), clientId: 'hello', clientSecret: env('OIDC_CLIENT_SECRET'), redirectUri: env('OIDC_REDIRECT_URI') },
  secureCookies: process.env.SECURE_COOKIES !== 'false',
});
await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT ?? 3001) });
