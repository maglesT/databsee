#!/usr/bin/env bash
# PL-11 restore test (run by test/backup.test.ts): a throwaway PostgreSQL archiving WAL as deploy/compose.yml does,
# all 10 databases from init.sh, a base backup by deploy/backup.sh, writes before and after a chosen moment, the
# server lost, then deploy/restore.sh to that moment. Every database must hold exactly the rows written up to it.
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
bin=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
work=$(mktemp -d)
stop() { "$bin/pg_ctl" -D "$1" stop -m "$2" >/dev/null 2>&1 || true; }
trap 'stop "$work/live" immediate; stop "$work/restored" immediate; rm -rf "$work"' EXIT
export PGHOST=$work PGPORT=${PL11_PORT:-55499} PGUSER=postgres ARCHIVE=$work/archive DB_ARCHIVE=$work/archive IN_DB=
unset PGPASSWORD PGDATABASE
start() { "$bin/pg_ctl" -D "$work/$1" -w -l "$work/$1.log" -o "-p $PGPORT -k $work -c listen_addresses=''" start >/dev/null; }
sql() { psql -X -q -At -v ON_ERROR_STOP=1 -d "$1" -c "$2"; }
dbs="master_data identity logbook materials deviations protocols qms operations recruitment ebmr"

"$bin/initdb" -D "$work/live" -U postgres -A trust >/dev/null
mkdir -p "$ARCHIVE/wal" "$ARCHIVE/base"
printf "wal_level = replica\narchive_mode = on\narchive_command = 'test ! -f %s/wal/%%f && cp %%p %s/wal/%%f'\n" "$ARCHIVE" "$ARCHIVE" >> "$work/live/postgresql.conf"
start live
"$root/db/server/init.sh" ${dbs#master_data identity } >/dev/null
for d in $dbs; do sql "$d" "create table pl11 (v text); insert into pl11 values ('1 before backup')"; done
"$root/deploy/backup.sh" base >/dev/null
for d in $dbs; do sql "$d" "insert into pl11 values ('2 after backup')"; done
target=$(sql postgres "select now()")
for d in $dbs; do sql "$d" "insert into pl11 values ('3 after target')"; done
sql postgres "select pg_switch_wal()" >/dev/null
stop "$work/live" fast                      # the server is lost; its archive survives

"$root/deploy/restore.sh" "$(ls -d "$ARCHIVE"/base/* | tail -1)" "$target" "$work/restored" >/dev/null
start restored
for _ in $(seq 60); do [ "$(sql postgres 'select pg_is_in_recovery()')" = f ] && break; sleep 0.5; done
for d in $dbs; do
  got=$(sql "$d" "select string_agg(v, ',' order by v) from pl11")
  [ "$got" = "1 before backup,2 after backup" ] || { echo "PL-11 restore failed in $d: $got" >&2; exit 1; }
done
echo "PL-11 restore check passed: 10 databases restored to $target"
