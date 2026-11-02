// The control panel (slice A8): runs on the owner's server only. It shows each customer's system as a diagram (PL-09)
// and switches licences, links and outside logins by committing the customer config file to GitHub, which applies it
// (A7). Every switch needs the customer's change reference and a reason (D-08, PL-10) and is logged in switch_log.
// Plain server-rendered pages, no JavaScript. Sign-in: HTTP Basic over HTTPS, users from the environment.
import formbody from '@fastify/formbody';
import Fastify, { type FastifyRequest } from 'fastify';
import type { Sql } from 'postgres';
import YAML from 'yaml';
import { verifyPassword } from '../core/server/passwords.js';
import { allProducts, checkConfig, manifest, type Config } from '../../deploy/config.js';
import { arrows, diagram, type Arrow } from './diagram.js';
import type { Repo } from './github.js';

export interface PanelDeps {
  db: Sql;                          // control_panel database as control_panel_app
  repo: Repo;                       // customer configs in GitHub
  users: Record<string, string>;    // user name -> password hash (core's scrypt format)
}

/** One switch, as the forms send it. */
interface Switch { kind: 'licence' | 'link' | 'outside'; name: string; provider?: string; views?: string; on: '1' | '0' }

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const page = (title: string, body: string) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · Medhanta control panel</title>
<style>
body{font:15px/1.5 system-ui,sans-serif;margin:0 auto;max-width:900px;padding:16px;color:#1d2433;background:#fff}
a{color:#2457c5}h1{font-size:22px;margin:8px 0}h2{font-size:17px;margin:24px 0 8px}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #e3e6ec;padding:6px 8px;text-align:left}
.muted{color:#667085}.ok{color:#137333}.bad{color:#b42318}
form.switch label{display:block;margin:10px 0}input[type=text]{width:100%;padding:6px;box-sizing:border-box}
button{padding:6px 14px;border:1px solid #2457c5;background:#2457c5;color:#fff;border-radius:4px;cursor:pointer}
.diagram{width:100%;height:auto;border:1px solid #e3e6ec;border-radius:6px}
.node rect{fill:#f5f7fb;stroke:#98a2b3}.node.product rect{fill:#e8f0fe;stroke:#2457c5}.node.outside rect{fill:#fff7e6;stroke:#c27c0e}
.node text{text-anchor:middle;font-size:13px}.node text.sub{font-size:10px;fill:#667085}
.link line{stroke:#2457c5;stroke-width:2}.link.off line{stroke:#98a2b3;stroke-dasharray:5 4}.link text{font-size:10px;fill:#475467}
marker path{fill:#2457c5}
</style></head><body><p class="muted"><a href="/">Customers</a></p>${body}</body></html>`;

export function buildPanel(deps: PanelDeps) {
  const { db, repo } = deps;
  const app = Fastify();
  app.register(formbody);

  // Sign-in: HTTP Basic; the user name goes into every log entry and commit.
  app.decorateRequest('user', '');
  app.addHook('onRequest', async (req, reply) => {
    reply.header('x-frame-options', 'DENY');
    // Browsers resend Basic credentials to any page's form, so a switch must come from the panel's own pages.
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const site = req.headers['sec-fetch-site'], origin = req.headers.origin;
      if (site ? site !== 'same-origin' : origin && new URL(origin).host !== req.headers.host)
        return reply.code(403).send('Refused: switches can only be made from the control panel itself.');
    }
    const [, b64] = (req.headers.authorization ?? '').split(' ');
    const [name, ...rest] = Buffer.from(b64 ?? '', 'base64').toString('utf8').split(':');
    const hash = Object.hasOwn(deps.users, name ?? '') ? deps.users[name!] : undefined;
    if (!hash || !(await verifyPassword(rest.join(':'), hash))) {
      return reply.code(401).header('www-authenticate', 'Basic realm="Medhanta control panel"').send('Sign in required.');
    }
    (req as FastifyRequest & { user: string }).user = name!;
  });
  const who = (req: FastifyRequest) => (req as FastifyRequest & { user: string }).user;
  const customerName = (s: string) => {
    if (!/^[a-z][a-z0-9_]*$/.test(s)) throw Object.assign(new Error('Unknown customer.'), { statusCode: 404 });
    return s;
  };
  const load = async (customer: string) => {
    const { text, sha } = await repo.read(customerName(customer));
    const { config } = checkConfig(YAML.parse(text));
    if (config.customer !== customer) throw bad(`customers/${customer}.yaml says customer "${config.customer}"; fix the file first.`);
    return { text, sha, config };
  };

  app.get('/', async (_req, reply) => {
    const names = await repo.customers();
    const last = await db<{ customer: string; at: Date; action: string }[]>`
      select distinct on (customer) customer, at, action from switch_log order by customer, id desc`;
    const lastBy = new Map(last.map((r) => [r.customer, r]));
    reply.type('text/html').send(page('Customers', `<h1>Customers</h1><table><tr><th>Customer</th><th>Last switch</th></tr>
      ${names.map((n) => `<tr><td><a href="/c/${esc(n)}">${esc(n)}</a></td><td class="muted">${lastBy.has(n)
        ? `${esc(lastBy.get(n)!.action)}, ${esc(lastBy.get(n)!.at.toISOString().slice(0, 16).replace('T', ' '))} UTC` : '-'}</td></tr>`).join('')}</table>`));
  });

  app.get<{ Params: { customer: string } }>('/c/:customer', async (req, reply) => {
    const { config } = await load(req.params.customer);
    const c = config.customer;
    const href = (s: Switch) => `/c/${c}/switch?${new URLSearchParams(Object.entries(s).filter(([, v]) => v !== undefined) as [string, string][])}`;
    const arrowHref = (a: Arrow) => href(a.outside
      ? { kind: 'outside', name: a.reader, provider: a.provider, views: a.views.join(','), on: '0' }
      : { kind: 'link', name: a.reader, provider: a.provider, on: a.on ? '0' : '1' });
    const products = allProducts();
    const log = await db<{ at: Date; by_user: string; action: string; change_ref: string; reason: string; commit_sha: string }[]>`
      select at, by_user, action, change_ref, reason, commit_sha from switch_log where customer = ${c} order by id desc limit 20`;
    // The apply result of the newest switch (older ones: see the repository's Actions runs).
    const results = log.length ? [await repo.applyResult(log[0]!.commit_sha).catch(() => 'unknown')] : [];
    reply.type('text/html').send(page(c, `<h1>${esc(c)}</h1>
      <p>Platform ${esc(config.version)} · ${config.offline ? 'offline site (signed bundle)' : `online: ${esc(config.host)}`} ·
        last change ${esc(config.change_ref)}: ${esc(config.reason)}</p>
      ${diagram(config, arrowHref)}
      <p class="muted">Arrows run from the provider to the reader. Click an arrow to cut it or switch it back on; dashed arrows are off.</p>
      <h2>Licences</h2><table>${products.map((p) => {
        const on = config.licences.includes(p);
        return `<tr><td>${esc(p)}</td><td>${on ? '<span class="ok">licensed</span>' : '<span class="muted">off</span>'}</td>
          <td><a href="${esc(href({ kind: 'licence', name: p, on: on ? '0' : '1' }))}">${on ? 'Switch off' : 'Switch on'}</a></td></tr>`;
      }).join('')}</table>
      <h2>Links</h2><table>${arrows(config).filter((a) => !a.outside).map((a) => `<tr><td>${esc(a.provider)} → ${esc(a.reader)}</td>
        <td>${esc(a.views.join(', '))}</td><td>${a.on ? '<span class="ok">on</span>' : '<span class="muted">off</span>'}</td>
        <td><a href="${esc(arrowHref(a))}">${a.on ? 'Cut' : 'Switch on'}</a></td></tr>`).join('') || '<tr><td class="muted">No links.</td></tr>'}</table>
      <h2>Outside systems</h2><table>${arrows(config).filter((a) => a.outside).map((a) => `<tr><td>${esc(a.reader)} reads ${esc(a.provider)}</td>
        <td>${esc(a.views.join(', '))}</td><td><a href="${esc(arrowHref(a))}">Cut</a></td></tr>`).join('')}</table>
      <form method="get" action="/c/${c}/switch" class="switch"><input type="hidden" name="kind" value="outside"><input type="hidden" name="on" value="1">
        <p>Add an outside system: <input type="text" name="name" placeholder="name, e.g. sap" style="width:9em">
        reads <input type="text" name="provider" placeholder="database" style="width:9em">
        views <input type="text" name="views" placeholder="material_v1, supplier_v1" style="width:14em"> <button>Next</button></p></form>
      <h2>Switch log</h2><table><tr><th>When (UTC)</th><th>Who</th><th>Switch</th><th>Change ref.</th><th>Reason</th><th>Apply</th></tr>
      ${log.map((l, i) => `<tr><td>${esc(l.at.toISOString().slice(0, 16).replace('T', ' '))}</td><td>${esc(l.by_user)}</td><td>${esc(l.action)}</td>
        <td>${esc(l.change_ref)}</td><td>${esc(l.reason)}</td><td class="${results[i] === 'success' ? 'ok' : results[i] === 'failure' ? 'bad' : 'muted'}">${esc(results[i] ?? '')}</td></tr>`).join('')}</table>`));
  });

  // The confirmation form: what will change, plus the customer's change reference and a reason.
  app.get<{ Params: { customer: string }; Querystring: Switch }>('/c/:customer/switch', async (req, reply) => {
    const { config, sha } = await load(req.params.customer);
    const s = req.query;
    reply.type('text/html').send(page('Switch', `<h1>${esc(config.customer)}: ${esc(describe(s))}</h1>
      <form method="post" class="switch">
        ${Object.entries(s).map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`).join('')}
        <input type="hidden" name="sha" value="${esc(sha)}">
        <label>Customer change reference (from the site's change control)<input type="text" name="change_ref" required></label>
        <label>Reason<input type="text" name="reason" required></label>
        <button>Commit the switch</button> <a href="/c/${esc(config.customer)}">Cancel</a>
      </form>`));
  });

  app.post<{ Params: { customer: string }; Body: Switch & { change_ref?: string; reason?: string; sha?: string } }>('/c/:customer/switch', async (req, reply) => {
    const ref = (req.body.change_ref ?? '').trim(), reason = (req.body.reason ?? '').trim();
    if (!ref || !reason) return reply.code(400).type('text/html').send(page('Refused', '<h1>Refused</h1><p>A switch needs the customer change reference and a reason.</p>'));
    const { text, sha, config } = await load(req.params.customer);
    if (req.body.sha !== sha) throw Object.assign(new Error('The config changed since you opened this form. Go back and try again.'), { statusCode: 409 });
    const action = describe(req.body);
    const next = switched(config, req.body);
    next.change_ref = ref;
    next.reason = reason;
    try { checkConfig(next); } catch (e) { throw bad(`The switch would make the config invalid: ${(e as Error).message}`); } // apply.sh would refuse it
    const doc = YAML.parseDocument(text);
    for (const k of ['change_ref', 'reason', 'licences', 'links', 'outside_logins'] as const)    // other keys and comments stay
      if (JSON.stringify(next[k]) !== JSON.stringify(config[k])) doc.set(k, next[k]);
    const commit = await repo.write(config.customer, doc.toString(), sha,
      `${config.customer}: ${action} (${ref})\n\nReason: ${reason}\nSwitched by: ${who(req)} (control panel)\n`);
    await db`insert into switch_log (by_user, customer, action, change_ref, reason, commit_sha)
             values (${who(req)}, ${config.customer}, ${action}, ${ref}, ${reason}, ${commit})`;
    reply.redirect(`/c/${config.customer}`, 303);
  });

  app.setErrorHandler((err: Error & { statusCode?: number }, req, reply) => {
    const known = err.statusCode !== undefined && err.statusCode < 500;
    if (!known) req.log.error(err);
    reply.code(known ? err.statusCode! : 500).type('text/html')
      .send(page('Error', `<h1>Not done</h1><p>${esc(known ? err.message : 'Something went wrong; nothing was switched unless the log shows it. Details are in the server log.')}</p>`));
  });
  return app;
}

const bad = (message: string) => Object.assign(new Error(message), { statusCode: 400 });

function describe(s: Switch) {
  const state = s.on === '1' ? 'on' : 'off';
  if (s.kind === 'licence') return `licence ${s.name} ${state}`;
  if (s.kind === 'link') return `link ${s.provider} → ${s.name} ${state}`;
  return `outside system ${s.name} reading ${s.provider} ${s.views ? `(${s.views}) ` : ''}${state}`;
}

/** The config after one switch. Switching a licence off also cuts every link to and from that product. */
export function switched(config: Config, s: Switch): Config {
  const c: Config = structuredClone(config);
  const name = s.name, on = s.on === '1';
  if (!/^[a-z][a-z0-9_]*$/.test(name ?? '')) throw bad('Bad name.');
  if (s.kind === 'licence') {
    try { manifest(name); } catch (e) { throw bad((e as Error).message); }
    if (on) { if (!c.licences.includes(name)) c.licences.push(name); return c; }
    c.licences = c.licences.filter((p) => p !== name);
    delete c.links[name];
    for (const target of [c.links, c.outside_logins])
      for (const [reader, map] of Object.entries(target)) {
        delete map[name];
        if (!Object.keys(map).length) delete target[reader];
      }
    return c;
  }
  const provider = s.provider ?? '';
  if (!/^[a-z][a-z0-9_]*$/.test(provider)) throw bad('Bad provider.');
  const target = s.kind === 'link' ? c.links : c.outside_logins;
  if (on) {
    const views = s.kind === 'link'
      ? manifest(name).reads?.[provider]
      : (s.views ?? '').split(',').map((v) => v.trim()).filter(Boolean);
    if (!views?.length) throw bad(`No views to switch on for ${name} → ${provider}.`);
    target[name] = { ...(target[name] ?? {}), [provider]: views };
  } else {
    if (!target[name]?.[provider]) throw bad('That link is already off.');
    delete target[name]![provider];
    if (!Object.keys(target[name]!).length) delete target[name];
  }
  return c;
}
