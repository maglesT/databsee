// MED-06: core's inline scripts, allowed by hash in the Content-Security-Policy the proxy sends (deploy/apply.ts).
// Any inline <script> core serves must come from here, and no page uses on*="" handlers.
import { createHash } from 'node:crypto';

/** The access review report's Print button. */
export const PRINT_SCRIPT = "document.getElementById('print').addEventListener('click',()=>print())";

/** The CSP source for an inline script: 'sha256-<base64>' without the quotes. */
export const scriptHash = (script: string) => `sha256-${createHash('sha256').update(script).digest('base64')}`;

export const CORE_SCRIPT_HASHES = [scriptHash(PRINT_SCRIPT)];
