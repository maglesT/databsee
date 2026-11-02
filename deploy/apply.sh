#!/usr/bin/env bash
# Applies a customer config on its server. The same script for online sites (GitHub Actions copies the bundle over
# SSH and runs it) and offline sites (the bundle is carried in).
# Usage: /opt/medhanta/current/deploy/apply.sh <customer>-<version>-<commit>.tar   (signature next to it, .tar.sig)
#        MEDHANTA_UNSIGNED=1 deploy/apply.sh customers/<name>.yaml                   (development only)
# Bundle: the signature is checked first (deploy/verify-bundle.sh), then the release is unpacked to
# /opt/medhanta/releases/, its images loaded, its config applied, and /opt/medhanta/current points to it.
# Config: decrypt the secrets (age, D-12), then deploy/apply.ts (databases, migrations with data checks, roles, logins,
# links, containers, health and backup checks, rollback to the previous config on failure).
# Needs: Docker Compose, Node 22, age, rclone, the server's age key and /etc/medhanta/allowed_signers (README).
set -euo pipefail
here=$(cd "$(dirname "$0")/.." && pwd)
export MEDHANTA_STATE=${MEDHANTA_STATE:-/var/lib/medhanta/state}
mkdir -p "$MEDHANTA_STATE" && chmod 700 "$MEDHANTA_STATE"
home=${MEDHANTA_HOME:-/opt/medhanta}
if [ -z "${MEDHANTA_LOCKED:-}" ]; then   # one apply at a time on a server
  exec 8>"$MEDHANTA_STATE/apply.lock"; flock -n 8 || { echo "apply: another apply is running" >&2; exit 1; }
  export MEDHANTA_LOCKED=1
fi

if [[ "${1:?usage: apply.sh <bundle.tar> | customers/<name>.yaml}" == *.tar ]]; then
  bundle=$1
  "$here/deploy/verify-bundle.sh" "$bundle"
  dest=$home/releases/$(basename "$bundle" .tar)
  rm -rf "$dest" && mkdir -p "$dest" && tar -xf "$bundle" -C "$dest"
  docker load -i "$dest/images.tar.gz"
  config=$(ls "$dest"/customers/*.yaml | head -1)
  MEDHANTA_FROM_BUNDLE=1 "$dest/deploy/apply.sh" "$config"
  ln -sfn "$dest" "$home/current"
  exit 0
fi

# A config is applied only from a verified bundle; MEDHANTA_UNSIGNED=1 is for development (sudo drops both variables,
# so the deploy user cannot skip the signature).
[ -n "${MEDHANTA_FROM_BUNDLE:-}${MEDHANTA_UNSIGNED:-}" ] || { echo "apply: give a signed bundle, not a config file" >&2; exit 1; }
config=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")
cd "$here"
secrets=$MEDHANTA_STATE/secrets.yaml
trap 'rm -f "$secrets"' EXIT
age -d -i "${AGE_KEY_FILE:-/etc/medhanta/age.key}" -o "$secrets" "${config%.yaml}.secrets.yaml.age"
export PGHOST=${PGHOST:-127.0.0.1} PGPORT=${PGPORT:-5432} PGUSER=${PGUSER:-postgres}
node_modules/.bin/tsx deploy/apply.ts "$config" "$secrets"
