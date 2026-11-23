// Sign-in rate limit per address: counts FAILED password checks (a person who signs in right is never slowed) in a
// sliding window and answers "too many" until the oldest failures age out. In memory: one core process per site.
export class FailureLimiter {
  private hits = new Map<string, number[]>();
  private inFlight = new Map<string, number>();   // attempts whose check is still running (MED-05)
  constructor(private max: number, private windowMs = 60_000) {}

  private recent(key: string, now: number): number[] {
    const list = (this.hits.get(key) ?? []).filter((t) => t > now - this.windowMs);
    if (list.length) this.hits.set(key, list); else this.hits.delete(key);
    return list;
  }
  /** Seconds to wait when the address is over the limit, else 0. */
  blockedFor(key: string, now = Date.now()): number {
    const list = this.recent(key, now);
    if (list.length >= this.max) return Math.ceil((list[0]! + this.windowMs - now) / 1000);
    return list.length + (this.inFlight.get(key) ?? 0) >= this.max ? 1 : 0;
  }
  /** An attempt starts; the returned function ends it (once). */
  begin(key: string): () => void {
    this.inFlight.set(key, (this.inFlight.get(key) ?? 0) + 1);
    let done = false;
    return () => {
      if (done) return;
      done = true;
      const n = (this.inFlight.get(key) ?? 1) - 1;
      if (n > 0) this.inFlight.set(key, n); else this.inFlight.delete(key);
    };
  }
  fail(key: string, now = Date.now()) {
    const list = this.recent(key, now);
    list.push(now);
    this.hits.set(key, list);
    if (this.hits.size > 10_000) for (const k of this.hits.keys()) { this.recent(k, now); if (this.hits.size <= 5_000) break; }
  }
}

export const TOO_MANY = 'Too many failed attempts. Wait a minute and try again.';
