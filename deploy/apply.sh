#!/usr/bin/env bash
# Applies a customer config on its server (online: run by GitHub Actions over SSH; offline: run on site, slice A7).
# Usage: deploy/apply.sh customers/<name>.yaml
# Needs: Docker Compose, Node 22, age, and the server's age key (AGE_KEY_FILE, default /etc/medhanta/age.key).
# Steps: decrypt the secrets, then deploy/apply.ts (databases, migrations with data checks, roles, logins, links,
# containers, health check, rollback to the previous config on failure). Backup before apply: slice A6b.
set -euo pipefail
cd "$(dirname "$0")/.."
config=${1:?usage: deploy/apply.sh customers/<name>.yaml}
umask 077
mkdir -p deploy/secrets
trap 'rm -f deploy/secrets/secrets.yaml' EXIT
age -d -i "${AGE_KEY_FILE:-/etc/medhanta/age.key}" -o deploy/secrets/secrets.yaml "${config%.yaml}.secrets.yaml.age"
export PGHOST=${PGHOST:-127.0.0.1} PGPORT=${PGPORT:-5432} PGUSER=${PGUSER:-postgres}
npx tsx deploy/apply.ts "$config" deploy/secrets/secrets.yaml
