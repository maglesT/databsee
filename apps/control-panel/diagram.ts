// PL-09: the customer's system drawn from its config file: products (licensed ones), the platform databases,
// outside systems, and every link as an arrow from the provider to the reader (its views in the arrow's tooltip).
// A link a product can use (its manifest "reads") but that is off is drawn dashed. Each arrow links to its switch.
import { manifest, type Config } from '../../deploy/config.js';

export interface Arrow { reader: string; provider: string; views: string[]; on: boolean; outside: boolean }

/** Every link in the config (on), plus the links licensed products could have but do not (off). */
export function arrows(config: Config): Arrow[] {
  const out: Arrow[] = [];
  for (const [reader, map] of Object.entries(config.links))
    for (const [provider, views] of Object.entries(map)) out.push({ reader, provider, views, on: true, outside: false });
  for (const p of config.licences)
    for (const [provider, views] of Object.entries(manifest(p).reads ?? {}))
      if (!config.links[p]?.[provider] && (provider === 'master_data' || provider === 'identity' || config.licences.includes(provider)))
        out.push({ reader: p, provider, views, on: false, outside: false });
  for (const [name, map] of Object.entries(config.outside_logins))
    for (const [provider, views] of Object.entries(map)) out.push({ reader: name, provider, views, on: true, outside: true });
  return out;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function diagram(config: Config, linkHref: (a: Arrow) => string): string {
  // Rows: the core databases; the products other products read from; the other products; outside systems. Wide
  // enough for every box, so boxes never overlap; the views of each link are in its tooltip and in the links table.
  const all = arrows(config);
  const providers = config.licences.filter((p) => all.some((a) => a.provider === p && !a.outside));
  const rest = config.licences.filter((p) => !providers.includes(p));
  const rows = [['master_data', 'identity'], providers, rest, Object.keys(config.outside_logins)].filter((r, i) => i === 0 || r.length);
  const BW = 130, BH = 40, GAP = 24, ROW = 110;
  const W = Math.max(760, ...rows.map((r) => r.length * (BW + GAP) + GAP)), H = 40 + (rows.length - 1) * ROW + BH;
  const outside = new Set(Object.keys(config.outside_logins));
  const pos = new Map<string, { x: number; y: number }>();
  rows.forEach((row, r) => row.forEach((n, i) => pos.set((r === rows.length - 1 && outside.has(n) && !config.licences.includes(n) ? 'ext:' : '') + n,
    { x: ((i + 0.5) * W) / row.length, y: 30 + r * ROW })));
  const box = (key: string, label: string, sub: string, kind: string) => {
    const p = pos.get(key)!;
    return `<g class="node ${kind}"><rect x="${p.x - BW / 2}" y="${p.y - BH / 2}" width="${BW}" height="${BH}" rx="8"/>
      <text x="${p.x}" y="${p.y - 2}">${esc(label)}</text><text class="sub" x="${p.x}" y="${p.y + 13}">${esc(sub)}</text></g>`;
  };
  const lines = all.map((a) => {
    const from = pos.get(a.provider), to = pos.get((a.outside ? 'ext:' : '') + a.reader);
    if (!from || !to) return '';
    const y1 = from.y + (to.y > from.y ? BH / 2 : to.y < from.y ? -BH / 2 : 0), y2 = to.y + (to.y > from.y ? -BH / 2 : to.y < from.y ? BH / 2 : 0);
    const label = `${a.views.join(', ')}${a.on ? '' : ' (off)'}`;
    return `<a href="${esc(linkHref(a))}"><g class="link ${a.on ? 'on' : 'off'}"><title>${esc(`${a.provider} → ${a.reader}: ${label}`)}</title>
      <line x1="${from.x}" y1="${y1}" x2="${to.x}" y2="${y2}" marker-end="url(#arrow)"/></g></a>`;
  });
  return `<svg class="diagram" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="Products and links of ${esc(config.customer)}">
  <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>
  ${lines.join('\n  ')}
  ${box('master_data', 'master data', 'core', 'platform')}${box('identity', 'identity', 'core', 'platform')}
  ${config.licences.map((p) => box(p, p, `v${config.version}`, 'product')).join('')}
  ${Object.keys(config.outside_logins).map((n) => box(`ext:${n}`, n, 'outside system', 'outside')).join('')}
</svg>`;
}
