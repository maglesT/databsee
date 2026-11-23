#!/usr/bin/env bash
# MED-03: the repos are public, so no secret, password or token may be committed in plain text. Run by CI on every
# tracked file. Secrets live only in age-encrypted customers/<name>.secrets.yaml.age (README); templates use REPLACE.
# Usage: scripts/check-secrets.sh [repo dir]   (exit 1 and the offending lines when something looks like a secret)
set -euo pipefail
cd "${1:-$(dirname "$0")/..}"
found=0
bad() { echo "check-secrets: $1" >&2; found=1; }

# 1. Private keys and well-known token formats, in any tracked text file.
if hits=$(git grep -nIE 'BEGIN [A-Z ]*PRIVATE KEY|AGE-SECRET-KEY-1|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|xox[abprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|sk-(ant-)?[A-Za-z0-9_-]{30,}|ya29\.[A-Za-z0-9_-]{20,}|"refresh_token" *: *"1//' \
    -- . ':!package-lock.json' ':!scripts/check-secrets.sh'); then bad "secret-looking value:"; echo "$hits" >&2; fi

# 2. Secret-named settings with a real-looking value in YAML and env files (placeholders: REPLACE, example, test-only,
#    GitHub Actions ${{ secrets.* }}). host_key is a public key.
if hits=$(git grep -nIiE '^\s*-?\s*"?(password|passwd|pass|token|secret|client_secret|api_key|[a-z_]*_api_key|backup_key|smtp_url|cookie_keys)"?\s*[:=]\s*[^#[:space:]{|>]' \
    -- '*.yaml' '*.yml' '*.env' '.env*' | grep -viE 'REPLACE|example|test-only|\$\{\{ *secrets\.'); then
  bad "password, token or key in plain text (put it in customers/<name>.secrets.yaml.age):"; echo "$hits" >&2
fi

# 3. A secrets file is committed only age-encrypted (the template excepted).
for f in $(git ls-files | grep -iE '(^|/)[^/]*secrets?[^/]*\.(ya?ml|json|env|txt)$|(^|/)\.env$' | grep -v '\.template\.yaml$'); do
  bad "$f: a secrets file must be committed only as <name>.secrets.yaml.age"
done
for f in $(git ls-files '*.age'); do
  head -c 21 "$f" | grep -q '^age-encryption.org/v1' || head -c 40 "$f" | grep -q 'BEGIN AGE ENCRYPTED FILE' || bad "$f: not an age-encrypted file"
done

[ "$found" = 0 ] && echo "check-secrets: no plain-text secrets in $(git ls-files | wc -l) tracked files"
exit "$found"
