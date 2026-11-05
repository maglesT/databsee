// Master-data screen (slice A4): one list per kind, add, and one item with its versions, links and history.
import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import { form, Link, useAction, when } from './ui.js';

type Kind = 'equipment' | 'instrument' | 'room' | 'material' | 'supplier' | 'product';
interface Item { id: string; kind: Kind; code: string; name: string; fields: Record<string, unknown>; active: boolean; version: number; changedAt: string; changedBy: string }

const KINDS: { kind: Kind; label: string }[] = [
  { kind: 'equipment', label: 'Equipment' }, { kind: 'instrument', label: 'Instruments' }, { kind: 'room', label: 'Rooms' },
  { kind: 'material', label: 'Materials' }, { kind: 'supplier', label: 'Suppliers' }, { kind: 'product', label: 'Products' },
];

/** Each kind's own fields: [name, label, input]. */
const FIELDS: Record<Kind, [string, string, 'text' | 'check' | 'category'][]> = {
  equipment: [['type', 'Type', 'text'], ['make', 'Make', 'text'], ['model', 'Model', 'text'], ['serial', 'Serial no.', 'text']],
  instrument: [['type', 'Type', 'text'], ['make', 'Make', 'text'], ['model', 'Model', 'text'], ['serial', 'Serial no.', 'text'], ['needsCalibration', 'Needs calibration', 'check']],
  room: [['area', 'Area', 'text'], ['grade', 'Grade', 'text']],
  material: [['category', 'Category', 'category'], ['unit', 'Unit', 'text']],
  supplier: [['address', 'Address', 'text']],
  product: [['strength', 'Strength', 'text'], ['dosageForm', 'Dosage form', 'text']],
};

/** The link an item of this kind can have: [type, target kind, label]. */
const LINK: Partial<Record<Kind, [string, Kind, string]>> = {
  equipment: ['located_in', 'room', 'Located in room'],
  instrument: ['located_in', 'room', 'Located in room'],
  material: ['supplied_by', 'supplier', 'Supplied by'],
  product: ['uses', 'material', 'Uses material'],
};

function fieldsFrom(kind: Kind, f: Record<string, string>) {
  const out: Record<string, unknown> = {};
  for (const [name, , input] of FIELDS[kind]) {
    if (input === 'check') out[name] = f[name] === 'on';
    else if (f[name]) out[name] = f[name];
  }
  return out;
}

function FieldInputs({ kind, values = {} }: { kind: Kind; values?: Record<string, unknown> }) {
  return (
    <>
      {FIELDS[kind].map(([name, label, input]) =>
        input === 'check' ? (
          <label key={name}><input type="checkbox" name={name} defaultChecked={Boolean(values[name])} style={{ display: 'inline', width: 'auto' }} /> {label}</label>
        ) : input === 'category' ? (
          <label key={name}>{label}<select name={name} defaultValue={String(values[name] ?? 'starting')}>
            <option value="starting">Starting material</option><option value="packaging">Packaging material</option><option value="intermediate">Intermediate</option><option value="other">Other</option>
          </select></label>
        ) : (
          <label key={name}>{label}<input name={name} defaultValue={String(values[name] ?? '')} /></label>
        ),
      )}
    </>
  );
}

export function MasterData({ canEdit }: { canEdit: boolean }) {
  const [kind, setKind] = useState<Kind>('equipment');
  const [open, setOpen] = useState<string | null>(null);
  if (open) return <ItemPage id={open} canEdit={canEdit} back={() => setOpen(null)} />;
  return (
    <>
      <div className="card">
        <h2>Master data</h2>
        <p className="row">{KINDS.map((k) => (k.kind === kind ? <strong key={k.kind}>{k.label}</strong> : <Link key={k.kind} onClick={() => setKind(k.kind)}>{k.label}</Link>))}</p>
        <ItemList kind={kind} open={setOpen} canEdit={canEdit} />
      </div>
    </>
  );
}

function ItemList({ kind, open, canEdit }: { kind: Kind; open: (id: string) => void; canEdit: boolean }) {
  const [items, setItems] = useState<Item[]>([]);
  const a = useAction();
  const load = useCallback(() => api<Item[]>('GET', `/api/items?kind=${kind}`).then(setItems), [kind]);
  useEffect(() => { void load(); }, [load]);
  return (
    <>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Status</th><th>Version</th><th>Last change</th></tr></thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td><Link onClick={() => open(i.id)}>{i.code}</Link></td><td>{i.name}</td><td>{i.active ? 'Active' : 'Retired'}</td>
              <td>{i.version}</td><td>{when(i.changedAt)} by {i.changedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">Audit trail export: <a href="/api/export/master-data-history.csv">master-data history</a></p>
      {canEdit && (
        <form key={kind} onSubmit={(e) => {
          e.preventDefault();
          const el = e.currentTarget;
          const f = form(e);
          void a.run(async () => {
            await api('POST', '/api/items', { kind, code: f.code, name: f.name, fields: fieldsFrom(kind, f), reason: f.reason });
            el.reset();
            await load();
          });
        }}>
          <h3>Add</h3>
          <label>Code (never reused)<input name="code" required /></label>
          <label>Name<input name="name" required /></label>
          <FieldInputs kind={kind} />
          <label>Reason<input name="reason" required /></label>
          <a.Error />
          <button>Add</button>
        </form>
      )}
    </>
  );
}

interface History {
  item: { kind: Kind; code: string; name: string; fields: Record<string, unknown>; active: boolean; version: number };
  versions: { version: number; name: string; fields: Record<string, unknown>; active: boolean; changed_by_name: string; changed_at: string; reason: string }[];
  links: { type: string; active: boolean; changed_by_name: string; changed_at: string; reason: string; from_code: string; to_code: string }[];
  current: { type: string; fromId: string; toId: string; from_code: string; to_code: string }[];
}

function ItemPage({ id, canEdit, back }: { id: string; canEdit: boolean; back: () => void }) {
  const [h, setH] = useState<History | null>(null);
  const [targets, setTargets] = useState<Item[]>([]);
  const a = useAction();
  const load = useCallback(() => api<History>('GET', `/api/items/${id}/history`).then(setH), [id]);
  useEffect(() => { void load(); }, [load]);
  const link = h ? LINK[h.item.kind] : undefined;
  useEffect(() => { if (link) void api<Item[]>('GET', `/api/items?kind=${link[1]}`).then((x) => setTargets(x.filter((i) => i.active))); }, [link?.[1]]);
  if (!h) return null;
  const it = h.item;
  const ask = (q: string) => { const r = window.prompt(q); if (!r?.trim()) throw new Error('A reason is required.'); return r; };
  const outgoing = h.current.filter((l) => l.fromId === id);
  return (
    <>
      <p><Link onClick={back}>← Master data</Link></p>
      <div className="card">
        <h2>{it.name} <span className="muted">({it.kind} {it.code}, version {it.version}{it.active ? '' : ', retired'})</span></h2>
        {canEdit ? (
          <form key={it.version} onSubmit={(e) => {
            e.preventDefault();
            const f = form(e);
            void a.run(async () => { await api('PATCH', `/api/items/${id}`, { name: f.name, fields: fieldsFrom(it.kind, f), reason: f.reason }); await load(); });
          }}>
            <label>Name<input name="name" defaultValue={it.name} required /></label>
            <FieldInputs kind={it.kind} values={it.fields} />
            <label>Reason for change<input name="reason" required /></label>
            <p className="row">
              <button>Save</button>
              <button type="button" className="plain" onClick={() => void a.run(async () => {
                await api('PATCH', `/api/items/${id}`, { active: !it.active, reason: ask(it.active ? 'Reason for retiring:' : 'Reason for bringing back:') });
                await load();
              })}>{it.active ? 'Retire' : 'Bring back'}</button>
            </p>
          </form>
        ) : (
          <table><tbody>{FIELDS[it.kind].map(([n, l]) => <tr key={n}><th>{l}</th><td>{String(it.fields[n] ?? '')}</td></tr>)}</tbody></table>
        )}
        <a.Error />
      </div>

      {link && (
        <div className="card">
          <h3>{link[2]}</h3>
          <ul>
            {outgoing.map((l) => (
              <li key={l.toId}>{l.to_code} {canEdit && <Link onClick={() => void a.run(async () => {
                await api('POST', '/api/item-links', { fromId: id, toId: l.toId, type: l.type, active: false, reason: ask('Reason for removing the link:') });
                await load();
              })}>remove</Link>}</li>
            ))}
            {outgoing.length === 0 && <li className="muted">None</li>}
          </ul>
          {canEdit && (
            <form className="row" onSubmit={(e) => {
              e.preventDefault();
              const f = form(e);
              void a.run(async () => { await api('POST', '/api/item-links', { fromId: id, toId: f.target, type: link[0], active: true, reason: f.reason }); await load(); });
            }}>
              <label>{link[1]}<select name="target" required>{targets.map((x) => <option key={x.id} value={x.id}>{x.code}: {x.name}</option>)}</select></label>
              <label>Reason<input name="reason" required /></label>
              <button>Link</button>
            </form>
          )}
        </div>
      )}

      <div className="card">
        <h3>History</h3>
        <table>
          <thead><tr><th>When</th><th>What</th><th>By</th><th>Reason</th></tr></thead>
          <tbody>
            {[
              ...h.versions.map((v) => ({ at: v.changed_at, what: `Version ${v.version}: ${v.name}${v.active ? '' : ' (retired)'} ${JSON.stringify(v.fields)}`, by: v.changed_by_name, reason: v.reason })),
              ...h.links.map((l) => ({ at: l.changed_at, what: `${l.active ? 'Linked' : 'Unlinked'} ${l.from_code} ${l.type.replace('_', ' ')} ${l.to_code}`, by: l.changed_by_name, reason: l.reason })),
            ].sort((x, y) => x.at.localeCompare(y.at)).map((r, i) => <tr key={i}><td>{when(r.at)}</td><td>{r.what}</td><td>{r.by}</td><td>{r.reason}</td></tr>)}
          </tbody>
        </table>
      </div>
    </>
  );
}
