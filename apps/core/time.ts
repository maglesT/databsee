// Plant time for every date and time core shows (screens and printed reports): "17 Nov 2026, 10:57 pm IST".
// India has no daylight saving, so IST is always UTC + 5:30; fixed month names (no browser locale, no "Sept").
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const IST_MS = 330 * 60_000;

/** A moment in plant time, e.g. "17 Nov 2026, 10:57 pm IST"; '' for none. */
export function plantTime(t: string | Date | null | undefined): string {
  if (t === null || t === undefined || t === '') return '';
  const ms = new Date(t).getTime();
  if (Number.isNaN(ms)) return String(t);
  const d = new Date(ms + IST_MS);
  const h = d.getUTCHours(), m = d.getUTCMinutes();
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'} IST`;
}

/** A calendar date ("2026-11-17", as the database sends a date column cast to text), e.g. "17 Nov 2026"; '' for none. */
export function plantDate(d: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d ?? '');
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : (d ?? '');
}
