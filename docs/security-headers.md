# Security headers for the proxy

Every site (core and each product) sends the same headers. The platform's own Caddy gets them from the Caddyfile
that `deploy/apply.ts` writes (the snippet below is imported by each site block). Where a **host proxy** serves the
sites (`proxy: external`, the demo host), the host Caddyfile is kept by hand: put the snippet in it once and add
`import security_headers` as the first line inside every site block, then `caddy validate` and `caddy reload`
(never restart).

```caddyfile
(security_headers) {
	header {
		Strict-Transport-Security "max-age=31536000"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "DENY"
		Referrer-Policy "strict-origin-when-cross-origin"
		Permissions-Policy "camera=(), microphone=(), geolocation=()"
	}
	@page_policy not path /cb
	header @page_policy Content-Security-Policy "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; frame-src 'self' blob:; media-src 'self' blob: data:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
	@esign_window path /cb
	header @esign_window Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; frame-src 'self' blob:; media-src 'self' blob: data:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
}
```

```caddyfile
core.example.com {
  import security_headers
  reverse_proxy 127.0.0.1:8100
}
```

What each line is for

- Strict-Transport-Security: the browser uses https only for a year (no first-visit downgrade).
- X-Content-Type-Options nosniff and X-Frame-Options DENY: no content sniffing, no clickjacking (CSP frame-ancestors says the same).
- Referrer-Policy: other sites only see our origin. Permissions-Policy: camera, microphone and location are off.
- Content-Security-Policy: scripts only from the site itself (the product pages are single-page apps with one script
  file), styles may be inline, images may be data: and blob:, no frames, no plugins, no other sites.

Known exception: `/cb` (the e-signature window, which hands the signing proof to the dialog that opened it with one
small inline script) may run inline scripts. The products that do this (TrueBatch, Logbook, Deviations, Qualification
and others built from the same sign-on code) should move that script to a file; then the `/cb` lines can go.
A product that sends its own Content-Security-Policy is overridden by this one: remove the line for that host if its
own policy must stay.

Checked on 23 Nov 2026 against the built pages of all 15 demo hosts: one module script file each, no inline script,
no eval, no outside fonts or scripts.

Also done at the proxy (not in the snippet): Caddy refuses TLS older than 1.2 by default.
