// Plant time for every date and time core shows, the suite's rule (TrueBatch, 17 Nov 2026): 24-hour, to the minute.
// Screens: "17 Nov, 22:57 IST", with the year only when it is not this year ("17 Nov 2025, 22:57 IST"); printed reports
// always with the year ("17 Nov 2026, 22:57 IST"). India has no daylight saving, so IST is always UTC + 5:30; fixed month
// names (no browser locale, no "Sept").
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const IST_MS = 330 * 60_000;

/** A moment in plant time: "17 Nov, 22:57 IST" this year, else with the year; `full` always with the year (printed
 *  reports). '' for none. */
export function plantTime(t: string | Date | null | undefined, full = false, now: Date = new Date()): string {
  if (t === null || t === undefined || t === '') return '';
  const ms = new Date(t).getTime();
  if (Number.isNaN(ms)) return String(t);
  const d = new Date(ms + IST_MS);
  const thisYear = new Date(now.getTime() + IST_MS).getUTCFullYear();
  const h = d.getUTCHours(), m = d.getUTCMinutes();
  const year = full || d.getUTCFullYear() !== thisYear ? ` ${d.getUTCFullYear()}` : '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}${year}, ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} IST`;
}

/** A calendar date ("2026-11-17", as the database sends a date column cast to text), e.g. "17 Nov 2026"; '' for none. */
export function plantDate(d: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d ?? '');
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : (d ?? '');
}
