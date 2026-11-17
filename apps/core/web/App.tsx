// Core screens (slice A2b): sign in, change password, people, one person (details, permissions, history), alerts.
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { api } from './api.js';
import { form, Link, useAction, when } from './ui.js';
import { MasterData } from './MasterData.js';
import { productInfo } from '../products.js';
import { plantDate } from '../time.js';

interface Me { id: string; login: string; fullName: string; permissions: string[]; mustChange: boolean }
interface Person { id: string; login: string; fullName: string; email: string | null; active: boolean; lockedAt: string | null }
interface Permission { product: string; code: string; label: string }
interface Grant { product: string; code: string; grantedBy: string; grantedAt: string }
interface MyApp { product: string; url: string }
type LinkState = 'on' | 'off' | 'down';
interface Hire { candidateRef: string; fullName: string; jobTitle: string | null; department: string | null; joiningDate: string | null; hiredAt: string | null }
interface Training { skillCode: string; skillTitle: string; trainedOn: string; validUntil: string | null; qualified: boolean }
interface LinkRow { reader: string; readerName: string; provider: string; providerName: string; view: string; state: LinkState; why: string; switchedOnAt: string | null; changeRef: string | null }
interface Alert { id: string; message: string; at: string; emailedAt: string | null; emailError: string | null }

export function App() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [page, setPage] = useState<Page>({ name: 'home' });
  const [apps, setApps] = useState<MyApp[] | undefined>(undefined);
  const load = useCallback(() => api<Me>('GET', '/api/me').then(setMe, () => setMe(null)), []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (me && !me.mustChange) api<MyApp[]>('GET', '/api/my-apps').then(setApps, () => setApps([])); }, [me]);

  if (me === undefined) return null;
  if (me === null) return <SignIn onDone={load} />;
  if (me.mustChange) return <Shell me={me} onSignOut={() => setMe(null)} go={setPage} current="password" hasApps={false}><ChangePassword me={me} onDone={load} /></Shell>;
  const people = can(me, 'core.people.manage');
  const md = can(me, 'core.masterdata.view', 'core.masterdata.edit');
  // Home is "Your applications" for anyone who may use a product; someone with only core rights lands on that screen.
  const name = page.name === 'home' ? (apps?.length ? 'apps' : people ? 'people' : md ? 'master-data' : 'none') : page.name;
  if (apps === undefined) return null;
  return (
    <Shell me={me} onSignOut={() => setMe(null)} go={setPage} current={name} hasApps={apps.length > 0}>
      {name === 'apps' && <Applications me={me} apps={apps} go={setPage} people={people} md={md} />}
      {name === 'none' && <div className="card">Signed in. You have no applications yet: ask your administrator for access.</div>}
      {name === 'people' && people && <People open={(id) => setPage({ name: 'person', id })} />}
      {page.name === 'person' && people && <PersonPage id={page.id} me={me} back={() => setPage({ name: 'people' })} />}
      {name === 'master-data' && md && <MasterData canEdit={can(me, 'core.masterdata.edit')} />}
      {name === 'links' && people && <Links />}
    </Shell>
  );
}

const can = (me: Me, ...codes: string[]) => codes.some((c) => me.permissions.includes(c));

type Page = { name: 'home' } | { name: 'apps' } | { name: 'people' } | { name: 'person'; id: string } | { name: 'master-data' } | { name: 'links' };

function Shell({ me, children, onSignOut, go, current, hasApps }: { me: Me; children: ReactNode; onSignOut: () => void; go: (p: Page) => void; current: string; hasApps: boolean }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const loadAlerts = useCallback(() => { if (!me.mustChange) api<Alert[]>('GET', '/api/alerts').then(setAlerts, () => {}); }, [me]);
  useEffect(() => { loadAlerts(); const t = setInterval(loadAlerts, 30000); return () => clearInterval(t); }, [loadAlerts]);
  return (
    <>
      <header>
        <a className="brand" href="/" onClick={(e) => { e.preventDefault(); go({ name: hasApps ? 'apps' : 'home' }); }}>
          <img src="/medhanta-mark.png" alt="Medhanta" /><span><b>Medhanta</b><small>Platform</small></span>
        </a>
        <nav>
          {!me.mustChange && hasApps && <Tab on={current === 'apps'} onClick={() => go({ name: 'apps' })}>Applications</Tab>}
          {!me.mustChange && can(me, 'core.people.manage') && <Tab on={current === 'people' || current === 'person'} onClick={() => go({ name: 'people' })}>People</Tab>}
          {!me.mustChange && can(me, 'core.masterdata.view', 'core.masterdata.edit') && <Tab on={current === 'master-data'} onClick={() => go({ name: 'master-data' })}>Master data</Tab>}
          {!me.mustChange && can(me, 'core.people.manage') && <Tab on={current === 'links'} onClick={() => go({ name: 'links' })}>Links</Tab>}
        </nav>
        <span className="who">{me.fullName}
          <button className="plain" onClick={() => api('POST', '/api/logout').finally(onSignOut)}>Sign out</button></span>
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

function Tab({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return <a href="#" className={on ? 'on' : undefined} aria-current={on ? 'page' : undefined} onClick={(e) => { e.preventDefault(); onClick(); }}>{children}</a>;
}

/** Your applications: one tile per product the person holds a permission in; each opens the product (it signs on through core). */
function Applications({ me, apps, go, people, md }: { me: Me; apps: MyApp[]; go: (p: Page) => void; people: boolean; md: boolean }) {
  return (
    <>
      <div className="hello"><h1>Hello, {me.fullName.split(' ')[0]}</h1><p className="muted">Choose an application. You are signed in to all of them with this login.</p></div>
      <div className="apps">
        {[...apps].sort((x, y) => productInfo(x.product).name.localeCompare(productInfo(y.product).name)).map((a) => {
          const p = productInfo(a.product);
          return (
            <a className="app" key={a.product} href={a.url}>
              <ProductIcon product={a.product} initials={p.initials} logo={p.logo === true} />
              <b>{p.name}</b>
              <span>{p.tagline}</span>
              <em>Open →</em>
            </a>
          );
        })}
      </div>
      {(people || md) && (
        <div className="admin-links">
          {people && <button className="plain" onClick={() => go({ name: 'people' })}>People and permissions</button>}
          {md && <button className="plain" onClick={() => go({ name: 'master-data' })}>Master data</button>}
        </div>
      )}
    </>
  );
}

/** The product's logo (public/products/<product>.png, only for a product marked logo in products.ts) or its initials
 *  in Medhanta colours: a product without a logo file is never requested (D-76). */
function ProductIcon({ product, initials, logo: hasLogo }: { product: string; initials: string; logo: boolean }) {
  const [logo, setLogo] = useState(hasLogo);
  return (
    <div className="icon" aria-hidden="true">
      {logo ? <img src={`/products/${product}.png`} alt="" onError={() => setLogo(false)} /> : initials}
    </div>
  );
}

function SignIn({ onDone }: { onDone: () => void }) {
  const a = useAction();
  return (
    <main className="signin">
      <img className="logo" src="/medhanta-logo.png" alt="Medhanta: Where Expertise Meets Intelligence" />
      <form className="card" onSubmit={(e) => { e.preventDefault(); const f = form(e); void a.run(async () => { await api('POST', '/api/login', f); onDone(); }); }}>
        <h2>Sign in</h2>
        <label>Login ID<input name="login" autoComplete="username" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <a.Error />
        <button>Sign in</button>
      </form>
      <footer>One login for every Medhanta application.</footer>
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
  const [hires, setHires] = useState<{ state: LinkState; hires: Hire[] }>({ state: 'off', hires: [] });
  const [hire, setHire] = useState<Hire | null>(null);
  const a = useAction();
  const load = useCallback(async () => {
    await api<Person[]>('GET', '/api/employees').then(setPeople);
    await api<{ state: LinkState; hires: Hire[] }>('GET', '/api/hires').then(setHires, () => setHires({ state: 'down', hires: [] }));
  }, []);
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
                <td>{!p.active ? <span className="chip chip-off">Inactive</span> : p.lockedAt ? <span className="chip chip-bad">Locked</span> : <span className="chip chip-ok">Active</span>}</td>
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
          const r = await api<{ id: string; temporaryPassword: string }>('POST', '/api/employees', { ...f, email: f.email || null, hireRef: hire?.candidateRef ?? null });
          setCreated({ login: f.login!, temp: r.temporaryPassword });
          el.reset();
          setHire(null);
          await load();
        });
      }}>
        <h2>Add a person</h2>
        {hires.state === 'on' && (
          <label>From Recruitment: hired, not yet employees
            <select value={hire?.candidateRef ?? ''} onChange={(e) => setHire(hires.hires.find((h) => h.candidateRef === e.target.value) ?? null)}>
              <option value="">{hires.hires.length ? 'choose a hire, or type the person below' : 'no hires waiting'}</option>
              {hires.hires.map((h) => (
                <option key={h.candidateRef} value={h.candidateRef}>
                  {h.fullName}: {[h.jobTitle, h.department].filter(Boolean).join(', ')}{h.joiningDate ? `, joins ${plantDate(h.joiningDate)}` : ''} ({h.candidateRef})
                </option>
              ))}
            </select>
          </label>
        )}
        {hires.state === 'down' && <p className="muted">The link to Recruitment is down: type the person by hand.</p>}
        <label>Login ID (never reused)<input name="login" required /></label>
        <label>Full name<input name="fullName" key={`n${hire?.candidateRef ?? ''}`} defaultValue={hire?.fullName ?? ''} required /></label>
        <label>Email<input name="email" type="email" /></label>
        <label>How was their identity checked?<input name="identityVerifiedHow" placeholder="e.g. company ID card seen" required /></label>
        <label>Reason<input name="reason" key={`r${hire?.candidateRef ?? ''}`} required placeholder="e.g. new joiner, HR ticket 123"
          defaultValue={hire ? `New joiner from Recruitment ${hire.candidateRef}: ${[hire.jobTitle, hire.department].filter(Boolean).join(', ')}` : ''} /></label>
        {hire ? <p className="muted">Name and job pulled from Recruitment ({hire.candidateRef}).</p>
          : hires.state === 'on' && <p className="muted">Typed by hand.</p>}
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
  grants: { product: string; code: string; granted: boolean; by_name: string; at: string; reason: string }[];
  credentialEvents: { kind: string; product: string; by_name: string | null; reason: string | null; at: string }[];
}

function PersonPage({ id, me, back }: { id: string; me: Me; back: () => void }) {
  const [h, setH] = useState<History | null>(null);
  const [temp, setTemp] = useState('');
  const a = useAction();
  const load = useCallback(async () => { setH(await api<History>('GET', `/api/employees/${id}/history`)); }, [id]);
  useEffect(() => { void load(); }, [load]);
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

      <Permissions id={id} onChange={load} />

      <div className="card">
        <h3>History</h3>
        <table>
          <thead><tr><th>When</th><th>What</th><th>By</th><th>Reason</th></tr></thead>
          <tbody>
            {[
              ...h.versions.map((v) => ({ at: v.changed_at, what: `Version ${v.version}: ${v.full_name}, ${v.email ?? 'no email'}, ${v.active ? 'active' : 'inactive'}`, by: v.changed_by_name, reason: v.reason })),
              ...h.grants.map((g) => ({ at: g.at, what: `${g.granted ? 'Granted' : 'Removed'} ${g.code}`, by: g.by_name, reason: g.reason })),
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

/** PL-01: one person's permissions in one product: tick exactly the ones they need, or copy another person's. */
function Permissions({ id, onChange }: { id: string; onChange: () => Promise<void> }) {
  const [catalogue, setCatalogue] = useState<Permission[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [product, setProduct] = useState('core');
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [fromId, setFromId] = useState('');
  const [training, setTraining] = useState<{ state: LinkState; training: Training[] }>({ state: 'off', training: [] });
  const a = useAction();
  const load = useCallback(async () => setGrants(await api<Grant[]>('GET', `/api/employees/${id}/permissions`)), [id]);
  useEffect(() => {
    void load();
    void api<{ state: LinkState; training: Training[] }>('GET', `/api/employees/${id}/training`).then(setTraining, () => setTraining({ state: 'down', training: [] }));
    void api<Permission[]>('GET', '/api/permissions').then(setCatalogue);
    void api<Person[]>('GET', '/api/employees').then(setPeople);
  }, [load]);
  useEffect(() => { setTicked(new Set(grants.filter((g) => g.product === product).map((g) => g.code))); }, [grants, product]);
  const products = [...new Set(catalogue.map((p) => p.product))];
  const save = (path: string, body: object) => void a.run(async () => {
    await api(path.endsWith('copy') ? 'POST' : 'PUT', path, { product, reason, ...body });
    setReason('');
    await load();
    await onChange();
  });
  return (
    <div className="card">
      <h3>Permissions</h3>
      <label>Product<select value={product} onChange={(e) => setProduct(e.target.value)}>
        {products.map((p) => <option key={p}>{p}</option>)}
      </select></label>
      {catalogue.filter((p) => p.product === product).map((p) => {
        const g = grants.find((x) => x.code === p.code);
        return (
          <label className="check" key={p.code}>
            <input type="checkbox" checked={ticked.has(p.code)} onChange={(e) => {
              const next = new Set(ticked);
              if (e.target.checked) next.add(p.code); else next.delete(p.code);
              setTicked(next);
            }} />
            <span><code>{p.code}</code> {p.label}{g && <span className="muted"> (granted by {g.grantedBy}, {when(g.grantedAt)})</span>}</span>
          </label>
        );
      })}
      {training.state !== 'off' && (
        <div className="training">
          <h4>Training (from Recruitment, read only)</h4>
          {training.state === 'down' ? <p className="muted">The link to Recruitment is down: training not shown.</p>
            : training.training.length === 0 ? <p className="muted">No approved training records.</p>
              : <table>
                <thead><tr><th>Skill</th><th>Trained on</th><th>Valid until</th><th>Status</th></tr></thead>
                <tbody>{training.training.map((t) => (
                  <tr key={t.skillCode}><td><code>{t.skillCode}</code> {t.skillTitle}</td><td>{plantDate(t.trainedOn)}</td>
                    <td>{t.validUntil ? plantDate(t.validUntil) : 'no end'}</td>
                    <td>{t.qualified ? <span className="chip chip-ok">Qualified</span> : <span className="chip chip-off">Not qualified or expired</span>}</td></tr>
                ))}</tbody>
              </table>}
        </div>
      )}
      <label>Reason<input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. new job role, HR ticket 123" /></label>
      <p className="row">
        <button onClick={() => save(`/api/employees/${id}/permissions`, { codes: [...ticked] })}>Save</button>
        <label>Copy from<select value={fromId} onChange={(e) => setFromId(e.target.value)}>
          <option value="">choose a person</option>
          {people.filter((p) => p.id !== id).map((p) => <option key={p.id} value={p.id}>{p.login}: {p.fullName}</option>)}
        </select></label>
        <button className="plain" disabled={!fromId} onClick={() => save(`/api/employees/${id}/permissions/copy`, { fromId })}>Copy</button>
      </p>
      <a.Error />
    </div>
  );
}

/** D-78: every link the platform knows (customer config and the products' manifests), on / off / down, checked now. */
function Links() {
  const [r, setR] = useState<{ checkedAt: string; links: LinkRow[] } | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(() => { setError(''); api<{ checkedAt: string; links: LinkRow[] }>('GET', '/api/links').then(setR, (e: Error) => setError(e.message)); }, []);
  useEffect(() => { load(); }, [load]);
  const chip = (s: LinkState) => <span className={`chip ${s === 'on' ? 'chip-ok' : s === 'down' ? 'chip-bad' : 'chip-off'}`}>{s}</span>;
  return (
    <div className="card">
      <h2>Links</h2>
      <p className="muted">Which application reads which data from which other one. On: switched on by the last apply and
        working. Off: the reader could use it but it is not switched on. Down: switched on but not working now.
        Links are switched in the customer config (control panel), not here.</p>
      {error && <p className="error" role="alert">{error}</p>}
      {r && <p className="row"><span className="muted">Checked {when(r.checkedAt)}</span><button className="plain" onClick={load}>Check again</button></p>}
      {r && (
        <table>
          <thead><tr><th>Reader</th><th>Reads from</th><th>View</th><th>State</th><th>Switched on</th><th>Change reference</th></tr></thead>
          <tbody>{r.links.length === 0 && <tr><td colSpan={6} className="muted">No links: none is switched on, and no licensed product can read another.</td></tr>}
            {r.links.map((l) => (
            <tr key={`${l.reader}|${l.provider}|${l.view}`}>
              <td>{l.readerName}</td><td>{l.providerName}</td><td><code>{l.view}</code></td>
              <td>{chip(l.state)}{l.why && <span className="muted"> {l.why}</span>}</td>
              <td>{l.switchedOnAt ? when(l.switchedOnAt) : ''}</td><td>{l.changeRef ?? ''}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  );
}
