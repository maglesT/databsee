// Starts the control panel on the owner's server. Settings from the environment:
//   CONTROL_PANEL_DATABASE_URL  postgres URL of the control_panel database as control_panel_app
//   GITHUB_REPO, GITHUB_TOKEN   the config repository (e.g. maglesT/databsee) and a token allowed to write its contents
//   CONTROL_PANEL_USERS         name:hash[,name:hash]  (hash from: tsx apps/control-panel/index.ts hash-password)
import { createInterface } from 'node:readline/promises';
import postgres from 'postgres';
import { hashPassword } from '../core/server/passwords.js';
import { buildPanel } from './app.js';
import { githubRepo } from './github.js';

const env = (k: string) => { const v = process.env[k]; if (!v) throw new Error(`${k} is required`); return v; };
if (process.argv[2] === 'hash-password') {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  console.log(await hashPassword(await rl.question('Password: ')));
  rl.close();
} else {
  const users = Object.fromEntries(env('CONTROL_PANEL_USERS').split(',').map((u) => {
    const i = u.indexOf(':');
    return [u.slice(0, i), u.slice(i + 1)];
  }));
  const app = buildPanel({
    db: postgres(env('CONTROL_PANEL_DATABASE_URL'), { onnotice: () => {} }),
    repo: githubRepo(env('GITHUB_REPO'), env('GITHUB_TOKEN')),
    users,
  });
  await app.listen({ host: '0.0.0.0', port: Number(process.env.PORT ?? 3000) });
}
