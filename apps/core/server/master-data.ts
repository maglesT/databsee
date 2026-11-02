// Master data API (slice A4): items with insert-only versions and reasons (PL-06), links between items, history
// and CSV export. Read: core.masterdata.view or core.masterdata.edit; write: core.masterdata.edit (PL-01).
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { Sql } from 'postgres';
import { z } from 'zod';
import { csv, HttpError } from './app.js';

type Need = (req: FastifyRequest, codes: string[]) => { id: string; fullName: string };

const text = z.string().trim().max(200).optional();
/** The system checks on each kind's own fields (A11 6 / SchM 20.6: no critical batch data is entered here). */
export const FIELDS = {
  equipment: z.object({ type: text, make: text, model: text, serial: text }).strict(),
  instrument: z.object({ type: text, make: text, model: text, serial: text, needsCalibration: z.boolean().optional() }).strict(),
  room: z.object({ area: text, grade: text }).strict(),
  material: z.object({ category: z.enum(['starting', 'packaging', 'other']), unit: z.string().trim().min(1, 'Unit is required.').max(20) }).strict(),
  supplier: z.object({ address: text }).strict(),
  product: z.object({ strength: text, dosageForm: text }).strict(),
};
export type Kind = keyof typeof FIELDS;
const kind = z.enum(Object.keys(FIELDS) as [Kind, ...Kind[]]);

/** Which kinds each link type connects. */
const LINKS = {
  located_in: { from: ['equipment', 'instrument'], to: ['room'] },
  supplied_by: { from: ['material'], to: ['supplier'] },
  uses: { from: ['product'], to: ['material'] },
} as const;

const reason = z.string().trim().min(1, 'A reason is required.');
const READ = ['core.masterdata.view', 'core.masterdata.edit'];
const WRITE = ['core.masterdata.edit'];

export function registerMasterData(app: FastifyInstance, md: Sql, need: Need) {
  app.get('/api/items', async (req) => {
    need(req, READ);
    const q = z.object({ kind: kind.optional() }).parse(req.query);
    return md`select id, kind, code, name, fields, active, version, changed_at as "changedAt", changed_by_name as "changedBy"
      from item_current where ${q.kind ? md`kind = ${q.kind}` : md`true`} order by kind, code`;
  });

  app.post('/api/items', async (req) => {
    const me = need(req, WRITE);
    const b = z.object({ kind, code: z.string().trim(), name: z.string().trim().min(1, 'Name is required.'), fields: z.record(z.unknown()).default({}), reason }).parse(req.body);
    const fields = FIELDS[b.kind].parse(b.fields);
    return md.begin(async (tx) => {
      const [i] = await tx<{ id: string }[]>`insert into item (kind, code) values (${b.kind}, ${b.code}) returning id`;
      await tx`insert into item_version (item_id, version, name, fields, active, changed_by, changed_by_name, reason)
        values (${i!.id}, 1, ${b.name}, ${md.json(fields)}, true, ${me.id}, ${me.fullName}, ${b.reason})`;
      return { id: i!.id };
    });
  });

  app.patch('/api/items/:id', async (req) => {
    const me = need(req, WRITE);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const b = z.object({ name: z.string().trim().min(1).optional(), fields: z.record(z.unknown()).optional(), active: z.boolean().optional(), reason }).parse(req.body);
    await md.begin(async (tx) => {
      const [cur] = await tx<{ kind: Kind; name: string; fields: object; active: boolean; version: number }[]>`
        select kind, name, fields, active, version from item_current where id = ${id}`;
      if (!cur) throw new HttpError(404, 'No such item.');
      const fields = b.fields ? FIELDS[cur.kind].parse(b.fields) : cur.fields;
      await tx`insert into item_version (item_id, version, name, fields, active, changed_by, changed_by_name, reason)
        values (${id}, ${cur.version + 1}, ${b.name ?? cur.name}, ${md.json(fields as never)}, ${b.active ?? cur.active}, ${me.id}, ${me.fullName}, ${b.reason})`;
    });
    return { ok: true };
  });

  app.get('/api/items/:id/history', async (req) => {
    need(req, READ);
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const [item] = await md`select * from item_current where id = ${id}`;
    if (!item) throw new HttpError(404, 'No such item.');
    return {
      item,
      versions: await md`select version, name, fields, active, changed_by_name, changed_at, reason from item_version where item_id = ${id} order by version`,
      links: await md`select l.type, l.active, l.changed_by_name, l.changed_at, l.reason, f.kind as from_kind, f.code as from_code, t.kind as to_kind, t.code as to_code
        from link_event l join item f on f.id = l.from_item join item t on t.id = l.to_item where ${id} in (l.from_item, l.to_item) order by l.id`,
      current: await md`select l.type, l.from_item as "fromId", l.to_item as "toId", f.code as from_code, t.code as to_code, f.kind as from_kind, t.kind as to_kind
        from item_link_current l join item f on f.id = l.from_item join item t on t.id = l.to_item where ${id} in (l.from_item, l.to_item) order by l.type, f.code, t.code`,
    };
  });

  // Switch a link between two items on or off, with a reason.
  app.post('/api/item-links', async (req) => {
    const me = need(req, WRITE);
    const b = z.object({ fromId: z.string().uuid(), toId: z.string().uuid(), type: z.enum(['located_in', 'supplied_by', 'uses']), active: z.boolean(), reason }).parse(req.body);
    await md.begin(async (tx) => {
      const kinds = await tx<{ id: string; kind: string }[]>`select id, kind from item where id in (${b.fromId}, ${b.toId})`;
      const k = (id: string) => kinds.find((x) => x.id === id)?.kind;
      const rule = LINKS[b.type];
      if (!(rule.from as readonly string[]).includes(k(b.fromId) ?? '') || !(rule.to as readonly string[]).includes(k(b.toId) ?? '')) {
        throw new HttpError(400, `"${b.type}" links ${rule.from.join('/')} to ${rule.to.join('/')}.`);
      }
      const [has] = await tx`select 1 from item_link_current where from_item = ${b.fromId} and to_item = ${b.toId} and type = ${b.type}`;
      if (Boolean(has) === b.active) throw new HttpError(409, b.active ? 'Already linked.' : 'Not linked.');
      // An item is located in one room at a time: moving it ends the old link in the same transaction.
      if (b.active && b.type === 'located_in') {
        const old = await tx<{ to_item: string }[]>`select to_item from item_link_current where from_item = ${b.fromId} and type = 'located_in'`;
        for (const o of old) {
          await tx`insert into link_event (from_item, to_item, type, active, changed_by, changed_by_name, reason)
            values (${b.fromId}, ${o.to_item}, 'located_in', false, ${me.id}, ${me.fullName}, ${b.reason})`;
        }
      }
      await tx`insert into link_event (from_item, to_item, type, active, changed_by, changed_by_name, reason)
        values (${b.fromId}, ${b.toId}, ${b.type}, ${b.active}, ${me.id}, ${me.fullName}, ${b.reason})`;
    });
    return { ok: true };
  });

  // PL-06: readable audit trail of master data.
  app.get('/api/export/master-data-history.csv', async (req, reply) => {
    need(req, READ);
    const rows = await md`select i.kind, i.code, v.version, v.name, v.fields::text as fields, v.active, v.changed_by_name, v.changed_at, v.reason
      from item_version v join item i on i.id = v.item_id
      union all
      select 'link:' || l.type, f.code || ' -> ' || t.code, null, null, null, l.active, l.changed_by_name, l.changed_at, l.reason
      from link_event l join item f on f.id = l.from_item join item t on t.id = l.to_item
      order by changed_at`;
    reply.header('content-type', 'text/csv; charset=utf-8').header('content-disposition', 'attachment; filename="master-data-history.csv"');
    return csv(rows as unknown as Record<string, unknown>[]);
  });
}
