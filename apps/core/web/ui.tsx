import { useCallback, useState, type FormEvent, type ReactNode } from 'react';
import { plantTime } from '../time.js';

/** An in-app link (keyboard-usable, real link role). */
export function Link({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }}>{children}</a>;
}

/** Every date and time on the core screens, in plant time: "17 Nov 2026, 10:57 pm IST" (D-77). */
export const when = (t: string | null | undefined) => plantTime(t);
export const form = (e: FormEvent<HTMLFormElement>) => Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

/** Runs an action and shows its error under the form. */
export function useAction() {
  const [error, setError] = useState('');
  const run = useCallback(async (f: () => Promise<void>) => {
    setError('');
    try { await f(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }, []);
  return { error, run, Error: () => (error ? <p className="error" role="alert">{error}</p> : null) };
}

