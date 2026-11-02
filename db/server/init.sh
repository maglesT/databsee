#!/usr/bin/env bash
# Creates the platform's databases and roles on one customer PostgreSQL server. Idempotent: safe to run again.
# Connection from the PG* environment variables, as a superuser (the installer; apply.sh in slice A6).
# Usage: db/server/init.sh [product ...]   (default: the eight products)
#
# Per database <db>: role <db>_owner (NOLOGIN, owns everything in it), the app login that writes it
# (core_app for master_data and identity, <product>_app for a product), schemas report (published views) and
# platform (link function + link log). Logins are created NOLOGIN; apply.sh switches licensed ones on (slice A6).
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
if [ $# -eq 0 ]; then set -- logbook materials deviations protocols qms operations recruitment ebmr; fi

setup() { # db app
  psql -X -q -v ON_ERROR_STOP=1 -d postgres -v db="$1" -v owner="$1_owner" -v app="$2" -f "$here/cluster.sql"
  psql -X -q -v ON_ERROR_STOP=1 -d "$1" -v db="$1" -v owner="$1_owner" -v app="$2" -f "$here/database.sql"
}

setup master_data core_app
setup identity core_app
for p in "$@"; do
  [[ "$p" =~ ^[a-z][a-z0-9_]*$ ]] || { echo "bad product name: $p" >&2; exit 1; }
  setup "$p" "${p}_app"
done
echo "init: master_data, identity and $# product database(s) ready"
