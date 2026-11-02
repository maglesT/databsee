// Core screens (slice A2b): sign in, change password, people, one person (details, roles, history), alerts.
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api } from './api.js';
import { form, Link, useAction, when } from './ui.js';
import { MasterData } from './MasterData.js';

interface Me { id: string; login: string; fullName: string; roles: string[]; mustChange: boolean }
interface Person { id: string; login: string; fullName: string; email: string | null; active: boolean; lockedAt: string | null }
interface Role { product: string; role: string; description: string }
interface Grant { employeeId: string; product: string; role: string; grantedBy: string; grantedAt: string }
interface Alert { id: string; message: string; at: string; emailedAt: string | null; emailError: string | null }

export function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [page, setPage] = useState<Page>({ name: 'home' });
  const load = useCallback(() => api<Me>('GET', '/api/me').then(setMe, () => setMe(null)), []);
  useEffect(() => { void load(); }, [load]);

  if (me === undefined) return null;
  if (me === null) return <SignIn onDone={load} />;
  if (me.mustChange) return <Shell me={me} onSignOut={() => setMe(null)} go={setPage}><ChangePassword me={me} onDone={load} /></Shell>;
  const people = me.roles.includes('identity_admin');
  const md = me.roles.includes('viewer') || me.roles.includes('master_data_editor');
  const name = page.name === 'home' ? (people ? 'people' : md ? 'master-data' : 'none') : page.name;
  return (
    <Shell me={me} onSignOut={() => setMe(null)} go={setPage}>
      {name === 'none' && <div className="card">Signed in. You have no rights in the core screens.</div>}
      {name === 'people' && people && <People open={(id) => setPage({ name: 'person', id })} />}
      {page.name === 'person' && people && <PersonPage id={page.id} me={me} back={() => setPage({ name: 'people' })} />}
      {name === 'master-data' && md && <MasterData canEdit={me.roles.includes('master_data_editor')} />}
    </Shell>
  );
}

type Page = { name: 'home' } | { name: 'people' } | { name: 'person'; id: string } | { name: 'master-data' };

function Shell({ me, children, onSignOut, go }: { me: Me; children: ReactNode; onSignOut: () => void; go: (p: Page) => void }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const loadAlerts = useCallback(() => { if (!me.mustChange) api<Alert[]>('GET', '/api/alerts').then(setAlerts, () => {}); }, [me]);
  useEffect(() => { loadAlerts(); const t = setInterval(loadAlerts, 30000); return () => clearInterval(t); }, [loadAlerts]);
  return (
    <>
      <header>
        <strong>Medhanta core</strong>
        {!me.mustChange && me.roles.includes('identity_admin') && <Link onClick={() => go({ name: 'people' })}>People</Link>}
        {!me.mustChange && (me.roles.includes('viewer') || me.roles.includes('master_data_editor')) && <Link onClick={() => go({ name: 'master-data' })}>Master data</Link>}
        <span className="muted">{me.fullName}</span>
        <button className="plain" onClick={() => api('POST', '/api/logout').finally(onSignOut)}>Sign out</button>
      </header>
      {alerts.map((a) => (
        <div className="alert" key={a.id} role="alert">
          <span>⚠ {a.message} ({when(a.at)}{a.emailedAt ? ', security contact emailed' : `, email not sent: ${a.emailError ?? 'pending'}`})</span>
          <button className="plain" onClick={() => api('POST', `/api/alerts/${a.id}/ack`).then(loadAlerts)}>Acknowledge</button>
        </div>
      ))}
      <main>{children}</main>
    </>
  );
}

function SignIn({ onDone }: { onDone: () => void }) {
  const a = useAction();
  return (
    <main>
      <form className="card" onSubmit={(e) => { e.preventDefault(); const f = form(e); void a.run(async () => { await api('POST', '/api/login', f); onDone(); }); }}>
        <h2>Sign in</h2>
        <label>Login ID<input name="login" autoComplete="username" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <a.Error />
        <button>Sign in</button>
      </form>
    </main>
  );
}

function ChangePassword({ me, onDone }: { me: Me; onDone: () => void }) {
  const a = useAction();
  return (
    <form className="card" onSubmit={(e) => {
      e.preventDefault();
      const f = form(e);
      void a.run(async () => {
        if (f.next !== f.repeat) throw new Error('The two new passwords differ.');
        await api('POST', '/api/me/password', { current: f.current, next: f.next });
        onDone();
      });
    }}>
      <h2>Change your password</h2>
      <p className="muted">Your password is temporary or has expired. At least 10 characters, not containing "{me.login}".</p>
      <label>Current password<input name="current" type="password" required /></label>
      <label>New password<input name="next" type="password" autoComplete="new-password" required /></label>
      <label>New password again<input name="repeat" type="password" autoComplete="new-password" required /></label>
      <a.Error />
      <button>Change password</button>
    </form>
  );
}

function People({ open }: { open: (id: string) => void }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [created, setCreated] = useState<{ login: string; temp: string } | null>(null);
  const a = useAction();
  const load = useCallback(() => api<Person[]>('GET', '/api/employees').then(setPeople), []);
  useEffect(() => { void load(); }, [load]);
  return (
    <>
      <div className="card">
        <h2>People</h2>
        <table>
          <thead><tr><th>Login</th><th>Name</th><th>Email</th><th>Status</th></tr></thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id}>
                <td><Link onClick={() => open(p.id)}>{p.login}</Link></td>
                <td>{p.fullName}</td>
                <td>{p.email}</td>
                <td>{!p.active ? 'Inactive' : p.lockedAt ? 'Locked' : 'Active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted">
          Audit trail exports: <a href="/api/export/employee-history.csv">people history</a> ·{' '}
          <a href="/api/export/grant-history.csv">permission history</a> · <a href="/api/export/credential-events.csv">sign-on events</a> ·{' '}
          <a href="/api/access-review" target="_blank" rel="noreferrer">access review report</a>
        </p>
      </div>
      <form className="card" onSubmit={(e) => {
        e.preventDefault();
        const el = e.currentTarget;
        const f = form(e);
        void a.run(async () => {
          const r = await api<{ id: string; temporaryPassword: string }>('POST', '/api/employees', { ...f, email: f.email || null });
          setCreated({ login: f.login!, temp: r.temporaryPassword });
          el.reset();
          await load();
        });
      }}>
        <h2>Add a person</h2>
        <label>Login ID (never reused)<input name="login" required /></label>
        <label>Full name<input name="fullName" required /></label>
        <label>Email<input name="email" type="email" /></label>
        <label>How was their identity checked?<input name="identityVerifiedHow" placeholder="e.g. company ID card seen" required /></label>
        <label>Reason<input name="reason" placeholder="e.g. new joiner, HR ticket 123" required /></label>
        <a.Error />
        <button>Add</button>
        {created && <p className="note">Temporary password for {created.login}: <code>{created.temp}</code>. Give it to them in person; they must change it at first sign-in. It is not shown again.</p>}
      </form>
    </>
  );
}

interface History {
  employee: { login: string; full_name: string; email: string | null; active: boolean; identity_verified_by: string; identity_verified_how: string };
  versions: { version: number; full_name: string; email: string | null; active: boolean; changed_by_name: string; changed_at: string; reason: string }[];
  grants: { product: string; role: string; granted: boolean; by_name: string; at: string; reason: string }[];
  credentialEvents: { kind: string; product: string; by_name: string | null; reason: string | null; at: string }[];
}

function PersonPage({ id, me, back }: { id: string; me: Me; back: () => void }) {
  const [h, setH] = useState<History | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [temp, setTemp] = useState('');
  const a = useAction();
  const load = useCallback(async () => {
    setH(await api<History>('GET', `/api/employees/${id}/history`));
    setGrants((await api<Grant[]>('GET', '/api/grants')).filter((g) => g.employeeId === id));
  }, [id]);
  useEffect(() => { void load(); void api<Role[]>('GET', '/api/roles').then(setRoles); }, [load]);
  if (!h) return null;
  const ask = (q: string) => { const r = window.prompt(q); if (!r?.trim()) throw new Error('A reason is required.'); return r; };
  const e = h.employee;
  return (
    <>
      <p><Link onClick={back}>← People</Link></p>
      <div className="card">
        <h2>{e.full_name} <span className="muted">({e.login})</span></h2>
        <p>{e.active ? 'Active' : 'Inactive'} · identity checked by {e.identity_verified_by}: {e.identity_verified_how}</p>
        <form className="row" onSubmit={(ev) => {
          ev.preventDefault();
          const f = form(ev);
          void a.run(async () => { await api('PATCH', `/api/employees/${id}`, { fullName: f.fullName, email: f.email || null, reason: f.reason }); await load(); });
        }}>
          <label>Full name<input name="fullName" defaultValue={e.full_name} required /></label>
          <label>Email<input name="email" type="email" defaultValue={e.email ?? ''} /></label>
          <label>Reason for change<input name="reason" required /></label>
          <button>Save</button>
        </form>
        <p className="row">
          {id !== me.id && (
            <button className="plain" onClick={() => void a.run(async () => {
              await api('PATCH', `/api/employees/${id}`, { active: !e.active, reason: ask(e.active ? 'Reason for deactivating:' : 'Reason for reactivating:') });
              await load();
            })}>{e.active ? 'Deactivate (removes access everywhere)' : 'Reactivate'}</button>
          )}
          {id !== me.id && (
            <button className="plain" onClick={() => void a.run(async () => {
              const r = await api<{ temporaryPassword: string }>('POST', `/api/employees/${id}/reset-password`, { reason: ask('Reason for the password reset:') });
              setTemp(r.temporaryPassword);
              await load();
            })}>Reset password</button>
          )}
        </p>
        {temp && <p className="note">Temporary password: <code>{temp}</code>. Give it in person; not shown again.</p>}
        <a.Error />
      </div>

      <div className="card">
        <h3>Roles</h3>
        <table>
          <thead><tr><th>Product</th><th>Role</th><th>Granted by</th><th>When</th><th /></tr></thead>
          <tbody>
            {grants.map((g) => (
              <tr key={g.product + g.role}>
                <td>{g.product}</td><td>{g.role}</td><td>{g.grantedBy}</td><td>{when(g.grantedAt)}</td>
                <td><Link onClick={() => void a.run(async () => {
                  await api('POST', '/api/grants', { employeeId: id, product: g.product, role: g.role, granted: false, reason: ask(`Reason for removing ${g.product} / ${g.role}:`) });
                  await load();
                })}>Remove</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <form className="row" onSubmit={(ev) => {
          ev.preventDefault();
          const f = form(ev);
          const [product, role] = (f.role ?? '').split('/');
          void a.run(async () => { await api('POST', '/api/grants', { employeeId: id, product, role, granted: true, reason: f.reason }); await load(); });
        }}>
          <label>Add role<select name="role" required>
            {roles.filter((r) => !grants.some((g) => g.product === r.product && g.role === r.role)).map((r) => (
              <option key={r.product + r.role} value={`${r.product}/${r.role}`}>{r.product} / {r.role}: {r.description}</option>
            ))}
          </select></label>
          <label>Reason<input name="reason" required /></label>
          <button>Grant</button>
        </form>
      </div>

      <div className="card">
        <h3>History</h3>
        <table>
          <thead><tr><th>When</th><th>What</th><th>By</th><th>Reason</th></tr></thead>
          <tbody>
            {[
              ...h.versions.map((v) => ({ at: v.changed_at, what: `Version ${v.version}: ${v.full_name}, ${v.email ?? 'no email'}, ${v.active ? 'active' : 'inactive'}`, by: v.changed_by_name, reason: v.reason })),
              ...h.grants.map((g) => ({ at: g.at, what: `${g.granted ? 'Granted' : 'Removed'} ${g.product} / ${g.role}`, by: g.by_name, reason: g.reason })),
              ...h.credentialEvents.map((c) => ({ at: c.at, what: `${c.kind.replace('_', ' ')} (${c.product})`, by: c.by_name ?? '', reason: c.reason ?? '' })),
            ].sort((x, y) => x.at.localeCompare(y.at)).map((r, i) => (
              <tr key={i}><td>{when(r.at)}</td><td>{r.what}</td><td>{r.by}</td><td>{r.reason}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
