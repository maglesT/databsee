// Single sign-on for every product (slice A3, decision D-05): an OIDC provider (oidc-provider, OpenID-certified)
// on the same password check, lockout and register as the core screens.
// PL-01: a product's token carries only that product's roles; an inactive or locked employee has no account, so
// renewals fail (access tokens live 5 minutes). PL-05: prompt=login / max_age=0 forces the password again.
import Provider, { type Adapter, type AdapterPayload, type Configuration, type KoaContextWithOIDC } from 'oidc-provider';
import type { Sql } from 'postgres';

export interface OidcSettings {
  issuer: string;                                            // e.g. https://site.example/oidc
  clients: { client_id: string; client_secret: string; redirect_uris: string[]; post_logout_redirect_uris?: string[] }[];
  jwks: { keys: object[] };                                  // private signing key(s), from the customer secrets
  cookieKeys: string[];
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
  const roles = product
    ? (await sql<{ role: string }[]>`select role from current_grant where employee_id = ${sub} and product = ${product} order by role`).map((r) => r.role)
    : [];
  return { accountId: sub, claims: async () => ({ sub, name: row.full_name, preferred_username: row.login, roles }) };
}

export function buildProvider(sql: Sql, s: OidcSettings) {
  const config: Configuration = {
    adapter: pgAdapter(sql),
    clients: s.clients.map((c) => ({ ...c, grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'] })),
    jwks: s.jwks as Configuration['jwks'],
    cookies: { keys: s.cookieKeys },
    scopes: ['openid', 'profile', 'roles'],
    claims: { openid: ['sub'], profile: ['name', 'preferred_username'], roles: ['roles'] },
    pkce: { required: () => true },
    features: { devInteractions: { enabled: false }, revocation: { enabled: true }, rpInitiatedLogout: { enabled: true } },
    ttl: { AccessToken: 300, IdToken: 300, AuthorizationCode: 60, Interaction: 600, Session: 8 * 3600, Grant: 8 * 3600, RefreshToken: 8 * 3600 },
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
  };
  const provider = new Provider(s.issuer, config);
  provider.proxy = true; // behind Caddy
  return provider;
}
