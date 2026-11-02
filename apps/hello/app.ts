// The hello reference product (slice A5). Small on purpose: it shows what every product does on the platform.
//  1. Sign-on through core (OIDC code + PKCE); its roles come from the token (PL-01).
//  2. Master data read live from master_data's report views with its own login; a cut link shows "connection off"
//     and nothing is served from a copy (D-02, PL-08).
//  3. A signed record keeps the signer's name and the master-data values it relied on, as at signing (PL-07),
//     after re-authentication by the signer (PL-05).
//  4. Its own records only in its own database; it publishes report.note_v1 for others.
import { createHash, randomBytes } from 'node:crypto';
import cookie from '@fastify/cookie';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import type { Sql } from 'postgres';
import { z } from 'zod';

export interface HelloDeps {
  db: Sql;   // hello database as hello_app
  md: Sql;   // master_data database as hello_app (works only while the link is on)
  oidc: { issuer: string; clientId: string; clientSecret: string; redirectUri: string };
  secureCookies: boolean;
}

interface User { sub: string; name: string; roles: string[] }
interface Pending { verifier: string; sid?: string; sign?: { equipmentId: string; text: string } }

const CONNECTION_OFF = 'Connection to master data is off. Ask your administrator.';
const isCut = (e: unknown) => ['42501', '28000'].includes((e as { code?: string }).code ?? '');

export function buildHello(deps: HelloDeps) {
  const { db, md, oidc } = deps;
  const sessions = new Map<string, User>();          // demo only: real products keep their own sessions
  const pending = new Map<string, Pending>();
  const app = Fastify();
  app.register(cookie);

  const authUrl = (state: string, verifier: string, extra: Record<string, string> = {}) =>
    `${oidc.issuer}/auth?${new URLSearchParams({
      client_id: oidc.clientId, response_type: 'code', redirect_uri: oidc.redirectUri, scope: 'openid profile roles', state,
      code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256', ...extra,
    })}`;

  const user = (req: FastifyRequest) => {
    const u = sessions.get(req.cookies.hello_sid ?? '');
    if (!u) throw Object.assign(new Error('Please sign in.'), { statusCode: 401 });
    return u;
  };
  const need = (req: FastifyRequest, role: string) => {
    const u = user(req);
    if (!u.roles.includes(role)) throw Object.assign(new Error('You do not have the right for this.'), { statusCode: 403 });
    return u;
  };

  /** Reads current equipment from master data, or throws "connection off". */
  async function equipment(id?: string) {
    try {
      return await md<{ id: string; code: string; name: string; version: number; active: boolean }[]>`
        select id, code, name, version, active from report.equipment_v1 where ${id ? md`id = ${id}` : md`true`} order by code`;
    } catch (e) {
      if (isCut(e)) throw Object.assign(new Error(CONNECTION_OFF), { statusCode: 503 });
      throw e;
    }
  }

  app.get('/login', async (_req, reply) => {
    const state = randomBytes(16).toString('base64url');
    const verifier = randomBytes(32).toString('base64url');
    pending.set(state, { verifier });
    return reply.redirect(authUrl(state, verifier));
  });

  app.get('/cb', async (req, reply: FastifyReply) => {
    const q = z.object({ code: z.string(), state: z.string() }).parse(req.query);
    const p = pending.get(q.state);
    pending.delete(q.state);
    if (!p) return reply.code(400).send({ error: 'Unknown or expired sign-in.' });
    const tok = await fetch(`${oidc.issuer}/token`, {
      method: 'POST',
      headers: { authorization: `Basic ${Buffer.from(`${oidc.clientId}:${oidc.clientSecret}`).toString('base64')}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: q.code, code_verifier: p.verifier, redirect_uri: oidc.redirectUri }),
    });
    if (!tok.ok) return reply.code(401).send({ error: 'Sign-in failed.' });
    const { access_token } = (await tok.json()) as { access_token: string };
    const info = (await (await fetch(`${oidc.issuer}/me`, { headers: { authorization: `Bearer ${access_token}` } })).json()) as User;

    if (!p.sign) {
      const sid = randomBytes(32).toString('base64url');
      sessions.set(sid, { sub: info.sub, name: info.name, roles: info.roles ?? [] });
      reply.setCookie('hello_sid', sid, { path: '/', httpOnly: true, sameSite: 'lax', secure: deps.secureCookies });
      return reply.redirect('/');
    }

    // PL-05: the person who re-authenticated must be the signed-in person, and still an operator.
    const signer = sessions.get(p.sid ?? '');
    if (!signer || signer.sub !== info.sub) return reply.code(403).send({ error: 'The signature must be given by the signed-in person.' });
    if (!(info.roles ?? []).includes('operator')) return reply.code(403).send({ error: 'You do not have the right for this.' });
    // PL-07: keep the equipment as it is now, and the signer's name, in the signed record.
    const [eq] = await equipment(p.sign.equipmentId);
    if (!eq || !eq.active) return reply.code(400).send({ error: 'No such active equipment.' });
    await db`insert into note (text, equipment_id, equipment_code, equipment_name, equipment_version, signed_by, signer_name)
      values (${p.sign.text}, ${eq.id}, ${eq.code}, ${eq.name}, ${eq.version}, ${info.sub}, ${info.name})`;
    return reply.redirect('/');
  });

  app.get('/api/me', async (req) => user(req));
  app.get('/api/equipment', async (req) => { user(req); return equipment(); });
  app.get('/api/notes', async (req) => { user(req); return db`select * from note order by id`; });

  // Starts a signature: the product asks core to re-authenticate the signer (prompt=login, max_age=0).
  app.post('/api/notes/sign', async (req) => {
    need(req, 'operator');
    const b = z.object({ equipmentId: z.string().uuid(), text: z.string().trim().min(1) }).parse(req.body);
    const state = randomBytes(16).toString('base64url');
    const verifier = randomBytes(32).toString('base64url');
    pending.set(state, { verifier, sid: req.cookies.hello_sid, sign: b });
    return { redirect: authUrl(state, verifier, { prompt: 'login', max_age: '0' }) };
  });

  return app;
}
