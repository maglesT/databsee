// Single sign-on for every product (slice A3, decision D-05): an OIDC provider (oidc-provider, OpenID-certified)
// on the same password check, lockout and register as the core screens.
// PL-01: a product's token carries only that product's permission codes (claim `permissions`, D-16); an inactive or
// locked employee has no account, so renewals fail (access tokens live 5 minutes). PL-05: prompt=login / max_age=0
// forces the password again.
import { createHmac, timingSafeEqual } from 'node:crypto';
import Provider, { type Adapter, type AdapterPayload, type Configuration, type KoaContextWithOIDC } from 'oidc-provider';
import type { Sql } from 'postgres';

export interface OidcSettings {
  issuer: string;                                            // e.g. https://site.example/oidc
  // backchannel_logout_uri: where core tells the product that the person signed out (OIDC Back-Channel Logout 1.0).
  clients: { client_id: string; client_secret: string; redirect_uris: string[]; post_logout_redirect_uris?: string[]; backchannel_logout_uri?: string }[];
  jwks: { keys: object[] };                                  // private signing key(s), from the customer secrets
  cookieKeys: string[];
  fetch?: typeof fetch;                                      // tests only: catches the back-channel logout calls
}

/** Keeps the provider's state in identity.oidc_payload. */
function pgAdapter(sql: Sql) {
  return class PgAdapter implements Adapter {
    constructor(private readonly model: string) {}
    async upsert(id: string, payload: AdapterPayload, expiresIn: number) {
      const expires = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;
      await sql`insert into oidc_payload (model, id, payload, grant_id, uid, expires_at)
        values (${this.model}, ${id}, ${sql.json(payload as never)}, ${payload.grantId ?? null}, ${payload.uid ?? null}, ${expires})
        on conflict (model, id) do update set payload = excluded.payload, grant_id = excluded.grant_id, uid = excluded.uid, expires_at = excluded.expires_at`;
    }
    private async one(where: ReturnType<Sql>) {
      const [r] = await sql<{ payload: AdapterPayload; consumed: boolean }[]>`
        select payload, consumed_at is not null as consumed from oidc_payload
        where model = ${this.model} and ${where} and (expires_at is null or expires_at > now())`;
      return r ? { ...r.payload, ...(r.consumed ? { consumed: true } : {}) } : undefined;
    }
    find(id: string) { return this.one(sql`id = ${id}`); }
    findByUid(uid: string) { return this.one(sql`uid = ${uid}`); }
    findByUserCode() { return Promise.resolve(undefined); }
    async consume(id: string) { await sql`update oidc_payload set consumed_at = now() where model = ${this.model} and id = ${id}`; }
    async destroy(id: string) { await sql`delete from oidc_payload where model = ${this.model} and id = ${id}`; }
    async revokeByGrantId(grantId: string) { await sql`delete from oidc_payload where grant_id = ${grantId}`; }
  };
}

/** The account as a product sees it, or nothing if the person may not sign on (inactive, locked). */
export async function findAccount(sql: Sql, sub: string, product: string | undefined) {
  const [row] = await sql<{ login: string; full_name: string }[]>`
    select e.login, e.full_name from employee_current e join credential c on c.employee_id = e.id
    where e.id = ${sub} and e.active and c.locked_at is null`;
  if (!row) return undefined;
  const permissions = product
    ? (await sql<{ code: string }[]>`select code from current_permission_grant where employee_id = ${sub} and product = ${product} order by code`).map((r) => r.code)
    : [];
  return { accountId: sub, claims: async () => ({ sub, name: row.full_name, preferred_username: row.login, permissions }) };
}

export function buildProvider(sql: Sql, s: OidcSettings) {
  const config: Configuration = {
    adapter: pgAdapter(sql),
    clients: s.clients.map((c) => ({ ...c, grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'] })),
    jwks: s.jwks as Configuration['jwks'],
    cookies: { keys: s.cookieKeys },
    scopes: ['openid', 'profile', 'permissions'],
    claims: { openid: ['sub'], profile: ['name', 'preferred_username'], permissions: ['permissions'] },
    pkce: { required: () => true },
    features: { devInteractions: { enabled: false }, revocation: { enabled: true }, rpInitiatedLogout: { enabled: true }, backchannelLogout: { enabled: true } },
    ttl: { AccessToken: 300, IdToken: 300, AuthorizationCode: 60, Interaction: 600, Session: SIGN_ON_TTL_S, Grant: 8 * 3600, RefreshToken: 8 * 3600 },
    rotateRefreshToken: true,
    issueRefreshToken: async (_ctx, client) => client.grantTypeAllowed('refresh_token'),
    interactions: { url: (_ctx, interaction) => `/interaction/${interaction.uid}` },
    // Products are the owner's own apps: no consent screen; the grant holds what the product asked for.
    loadExistingGrant: async (ctx: KoaContextWithOIDC) => {
      const clientId = ctx.oidc.client!.clientId;
      const grantId = ctx.oidc.result?.consent?.grantId || ctx.oidc.session!.grantIdFor(clientId);
      const existing = grantId ? await ctx.oidc.provider.Grant.find(grantId) : undefined;
      if (existing) return existing;
      const grant = new ctx.oidc.provider.Grant({ clientId, accountId: ctx.oidc.session!.accountId! });
      grant.addOIDCScope(String(ctx.oidc.params!.scope ?? 'openid'));
      await grant.save();
      return grant;
    },
    findAccount: (ctx, sub) => findAccount(sql, sub, ctx.oidc.client?.clientId),
    ...(s.fetch ? { fetch: s.fetch } : {}),
  };
  const provider = new Provider(s.issuer, config);
  provider.proxy = true; // behind Caddy
  return provider;
}

// One person per browser (PL-01, shared terminals). The products' single sign-on (the provider's session, cookie
// "_session" signed as "_session.sig") and the core screens' own sign-in start and end together: core's sign-in starts
// the single sign-on, its sign-out ends it, and the products are told at once (back-channel logout).
export const SIGN_ON_COOKIE = '_session';
export const SIGN_ON_TTL_S = 8 * 3600;

/** The signature the provider's cookie library gives a signed cookie: HMAC-SHA1 of "name=value", URL-safe base64. */
export function cookieSignature(key: string, name: string, value: string): string {
  return createHmac('sha1', key).update(`${name}=${value}`).digest('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
}

/** The single sign-on session id this browser holds, if its signature is one of the provider's cookie keys. */
export function signOnCookie(keys: string[], cookies: Record<string, string | undefined>): string | undefined {
  const value = cookies[SIGN_ON_COOKIE];
  const sig = cookies[`${SIGN_ON_COOKIE}.sig`];
  if (!value || !sig) return undefined;
  const ok = keys.some((k) => {
    const want = Buffer.from(cookieSignature(k, SIGN_ON_COOKIE, value));
    const got = Buffer.from(sig);
    return want.length === got.length && timingSafeEqual(want, got);
  });
  return ok ? value : undefined;
}

/** Who the single sign-on session `id` belongs to, while it lasts. */
export async function signOnAccount(provider: Provider, id: string | undefined): Promise<string | undefined> {
  if (!id) return undefined;
  return (await provider.Session.find(id))?.accountId;
}

/** Starts a single sign-on session for `accountId` (the password was just checked by core). Returns its id. */
export async function startSignOn(provider: Provider, accountId: string): Promise<string> {
  const session = new provider.Session();
  session.loginAccount({ accountId, amr: ['pwd'] });
  await session.save(SIGN_ON_TTL_S);
  return session.jti;   // the session's id, as the provider's cookie holds it
}

/**
 * Ends single sign-on session `id` as the provider's own "sign out" does: each product it signed into is told by
 * back-channel logout (where the product takes it), the products' grants and refresh tokens are revoked, and the
 * session is deleted. A product that cannot be reached keeps its session until its next renewal, which then fails.
 */
export async function endSignOn(provider: Provider, sql: Sql, id: string | undefined): Promise<void> {
  if (!id) return;
  const session = await provider.Session.find(id);
  if (!session) return;
  const accountId = session.accountId;
  for (const [clientId, { grantId }] of Object.entries(session.authorizations ?? {})) {
    // backchannelLogout is the provider's own call (lib/models/client.js); its type package does not list it.
    const client = (await provider.Client.find(clientId)) as (InstanceType<Provider['Client']> & { backchannelLogout(sub: string, sid: string | undefined): Promise<void> }) | undefined;
    if (client?.backchannelLogoutUri && accountId) {
      await client.backchannelLogout(accountId, session.sidFor(clientId)).catch((err: Error) => {
        provider.emit('backchannel.error', undefined, err, client, accountId);
      });
    }
    if (grantId) await sql`delete from oidc_payload where grant_id = ${grantId} or (model = 'Grant' and id = ${grantId})`;
  }
  await session.destroy();
}
