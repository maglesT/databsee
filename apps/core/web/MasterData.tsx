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

type Input = 'text' | 'check' | 'category' | 'number' | 'basis' | 'eqclass' | 'grade' | 'prodkind' | 'expiry';
/** D-24: maintenance, cleaning and requalification parameters (empty = not applicable). */
const CARE: [string, string, Input][] = [
  ['cleanHoldHours', 'Clean hold (hours)', 'number'], ['dirtyHoldHours', 'Dirty hold (hours)', 'number'],
  ['pmFrequencyDays', 'Preventive maintenance every (days)', 'number'], ['calibrationFrequencyDays', 'Calibration every (days)', 'number'],
  ['requalificationFrequencyMonths', 'Requalification every (months)', 'number'],
];
/** Each kind's own fields: [name, label, input]. */
const FIELDS: Record<Kind, [string, string, Input][]> = {
  equipment: [['equipmentClass', 'Category', 'eqclass'], ['type', 'Type', 'text'], ['make', 'Make', 'text'], ['model', 'Model', 'text'], ['serial', 'Serial no.', 'text'], ...CARE,
    // D-38: isolators and RABS, from their qualification.
    ['decontaminationValidDays', 'Decontamination (VHP) valid for (days, isolators and RABS)', 'number'], ['gloveTestEveryDays', 'Glove test every (days, isolators and RABS)', 'number'],
    // D-69: from its qualification.
    ['sipValidDays', 'SIP valid for (days)', 'number']],
  instrument: [['type', 'Type', 'text'], ['make', 'Make', 'text'], ['model', 'Model', 'text'], ['serial', 'Serial no.', 'text'], ['needsCalibration', 'Needs calibration', 'check'], ...CARE],
  room: [['area', 'Area', 'text'], ['grade', 'Grade', 'grade'], ['cleaningBasis', 'Room cleaning', 'basis'], ['cleaningFrequencyHours', 'Cleaning every (hours, frequency-based rooms)', 'number'],
    ...CARE.filter(([n]) => n !== 'calibrationFrequencyDays')],
  material: [['category', 'Category', 'category'], ['unit', 'Unit', 'text']],
  supplier: [['address', 'Address', 'text']],
  product: [['kind', 'Product type', 'prodkind'], ['strength', 'Strength', 'text'], ['dosageForm', 'Dosage form', 'text'],
    ['antibiotic', 'Antibiotic (needs product-changeover cleaning)', 'check'],
    // D-125: the approved shelf life of this row (bulk or pack); TrueBatch packing reads it.
    ['shelfLifeMonths', 'Shelf life (months)', 'number'], ['expiryRule', 'Expiry', 'expiry']],
};

/** D-64: a product is bulk (made in TrueBatch Tablets) or a finished pack (made in TrueBatch Tablets Packing). */
const PRODUCT_KIND: Record<string, string> = { bulk: 'Bulk product', pack: 'Pack (finished pack)' };
const CATEGORY: Record<string, string> = { starting: 'Starting material', packaging: 'Packaging material', intermediate: 'Intermediate', other: 'Other' };
const EQCLASS: Record<string, string> = { process: 'Process equipment', engineering_system: 'Engineering system' };
const BASIS: Record<string, string> = { operation: 'Operation-based', frequency: 'Frequency-based' };
/** D-125: how the expiry follows from the shelf life (the same choices as TrueBatch packing). */
const EXPIRY_RULE: Record<string, string> = { 'month before': 'Month of manufacture + shelf life − 1', 'same month': 'Month of manufacture + shelf life' };

/** A kind in words, as a field label ("Material", not "material"). */
const KIND_WORD: Record<Kind, string> = { equipment: 'Equipment', instrument: 'Instrument', room: 'Room', material: 'Material', supplier: 'Supplier', product: 'Product' };
/** A link type in words for the history ("uses", "located in"). */
const LINK_WORD: Record<string, string> = { located_in: 'is located in', supplied_by: 'is supplied by', uses: 'uses' };

/** One stored field in words for the history: "Unit: kg", "Antibiotic: yes", "Product type: Bulk product". */
function fieldText(kind: Kind, fields: Record<string, unknown>): string {
  return FIELDS[kind].filter(([n]) => fields[n] !== undefined && fields[n] !== '' && fields[n] !== null).map(([n, label, input]) => {
    const v = fields[n];
    const text = input === 'check' ? (v ? 'yes' : 'no')
      : input === 'prodkind' ? PRODUCT_KIND[String(v)] ?? String(v)
      : input === 'expiry' ? EXPIRY_RULE[String(v)] ?? String(v)
      : input === 'category' ? CATEGORY[String(v)] ?? String(v)
      : input === 'eqclass' ? EQCLASS[String(v)] ?? String(v)
      : input === 'basis' ? BASIS[String(v)] ?? String(v)
      : String(v);
    return `${label}: ${text}`;
  }).join('; ');
}

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
    else if (input === 'number') { if (f[name]?.trim()) out[name] = Number(f[name]); }
    else if (f[name]) out[name] = f[name];
  }
  return out;
}

function FieldInputs({ kind, values = {} }: { kind: Kind; values?: Record<string, unknown> }) {
  return (
    <>
      {FIELDS[kind].map(([name, label, input]) =>
        input === 'check' ? (
          <label key={name} className="check"><input type="checkbox" name={name} defaultChecked={Boolean(values[name])} /> <span>{label}</span></label>
        ) : input === 'number' ? (
          <label key={name}>{label}<input name={name} type="number" min={1} step={1} inputMode="numeric" defaultValue={values[name] === undefined ? '' : String(values[name])} /></label>
        ) : input === 'grade' ? (
          <label key={name}>{label}<select name={name} defaultValue={String(values[name] ?? '')}>
            <option value="">None</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="CNC">CNC (controlled not classified)</option>
          </select></label>
        ) : input === 'prodkind' ? (
          <label key={name}>{label}<select name={name} defaultValue={String(values[name] ?? '')}>
            <option value="">Not set</option>{Object.entries(PRODUCT_KIND).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select></label>
        ) : input === 'expiry' ? (
          <label key={name}>{label}<select name={name} defaultValue={String(values[name] ?? '')}>
            <option value="">Not set</option>{Object.entries(EXPIRY_RULE).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select></label>
        ) : input === 'basis' ? (
          <label key={name}>{label}<select name={name} defaultValue={String(values[name] ?? 'operation')}>
            <option value="operation">Operation-based (cleaned after use: dirty hold, clean hold)</option><option value="frequency">Frequency-based (cleaned on a schedule)</option>
          </select></label>
        ) : input === 'eqclass' ? (
          <label key={name}>{label}<select name={name} defaultValue={String(values[name] ?? 'process')}>
            <option value="process">Process equipment</option><option value="engineering_system">Engineering system (utility: HVAC, water, steam, gases, power…)</option>
          </select></label>
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
  // The reason is typed in the form's own field, never in a browser prompt box.
  const reasonIn = (el: HTMLElement | null, what: string) => {
    const r = (el?.closest('form')?.querySelector<HTMLInputElement>('input[name=reason], input[name=linkReason]')?.value ?? '').trim();
    if (!r) throw new Error(`Type the reason for ${what} first.`);
    return r;
  };
  const outgoing = h.current.filter((l) => l.fromId === id);
  const nameOf = (toId: string) => { const t = targets.find((x) => x.id === toId); return t ? `: ${t.name}` : ''; };
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
            <label>Reason for change (also for retiring or bringing back)<input name="reason" required /></label>
            <p className="row">
              <button>Save</button>
              <button type="button" className="plain" onClick={(e) => { const el = e.currentTarget; void a.run(async () => {
                await api('PATCH', `/api/items/${id}`, { active: !it.active, reason: reasonIn(el, it.active ? 'retiring' : 'bringing back') });
                await load();
              }); }}>{it.active ? 'Retire' : 'Bring back'}</button>
            </p>
          </form>
        ) : (
          <table className="facts"><tbody>{FIELDS[it.kind].map(([n, l, input]) => <tr key={n}><th>{l}</th><td>{it.fields[n] === undefined || it.fields[n] === '' ? '—' : fieldText(it.kind, { [n]: it.fields[n] }).replace(/^[^:]*: /, '')}</td></tr>)}</tbody></table>
        )}
        <a.Error />
      </div>

      {link && (
        <div className="card">
          <h3>{link[2]}</h3>
          {canEdit ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = form(e);
              const el = e.currentTarget;
              void a.run(async () => { await api('POST', '/api/item-links', { fromId: id, toId: f.target, type: link[0], active: true, reason: f.linkReason }); el.reset(); await load(); });
            }}>
              <ul>
                {outgoing.map((l) => (
                  <li key={l.toId}>{l.to_code}{nameOf(l.toId)} <button type="button" className="plain" onClick={(e) => { const el = e.currentTarget; void a.run(async () => {
                    await api('POST', '/api/item-links', { fromId: id, toId: l.toId, type: l.type, active: false, reason: reasonIn(el, 'removing the link') });
                    el.closest('form')?.reset();
                    await load();
                  }); }}>Remove</button></li>
                ))}
                {outgoing.length === 0 && <li className="muted">None</li>}
              </ul>
              <div className="row">
                <label>{KIND_WORD[link[1]]}<select name="target" required>{targets.map((x) => <option key={x.id} value={x.id}>{x.code}: {x.name}</option>)}</select></label>
                <label>Reason for the link (also for removing one)<input name="linkReason" required /></label>
                <button>Link</button>
              </div>
            </form>
          ) : (
            <ul>
              {outgoing.map((l) => <li key={l.toId}>{l.to_code}{nameOf(l.toId)}</li>)}
              {outgoing.length === 0 && <li className="muted">None</li>}
            </ul>
          )}
        </div>
      )}

      <div className="card">
        <h3>History</h3>
        <table>
          <thead><tr><th>When</th><th>What</th><th>By</th><th>Reason</th></tr></thead>
          <tbody>
            {[
              ...h.versions.map((v) => ({ at: v.changed_at, what: `Version ${v.version}: ${v.name}${v.active ? '' : ' (retired)'}${fieldText(it.kind, v.fields) ? `. ${fieldText(it.kind, v.fields)}` : ''}`, by: v.changed_by_name, reason: v.reason })),
              ...h.links.map((l) => ({ at: l.changed_at, what: `${l.active ? 'Linked' : 'Link removed'}: ${l.from_code} ${LINK_WORD[l.type] ?? l.type.replaceAll('_', ' ')} ${l.to_code}`, by: l.changed_by_name, reason: l.reason })),
            ].sort((x, y) => x.at.localeCompare(y.at)).map((r, i) => <tr key={i}><td>{when(r.at)}</td><td>{r.what}</td><td>{r.by}</td><td>{r.reason}</td></tr>)}
          </tbody>
        </table>
      </div>
    </>
  );
}
