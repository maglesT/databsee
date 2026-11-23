#!/usr/bin/env bash
# PL-11 restore test (run by test/backup.test.ts): a throwaway PostgreSQL archiving WAL as deploy/compose.yml does,
# all 10 databases from init.sh, a base backup by deploy/backup.sh, writes before and after a chosen moment, the
# server lost, then deploy/restore.sh to that moment. Every database must hold exactly the rows written up to it.
# MED-02: the archive goes off the server through the rclone crypt remote (a local folder stands in for Drive), comes
# back from there with the key, and the base backup's SHA256SUMS is checked: a changed base backup is refused.
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
dbs="master_data identity logbook materials deviations protocols qms operations recruitment truebatch"

"$bin/initdb" -D "$work/live" -U postgres -A trust >/dev/null
mkdir -p "$ARCHIVE/wal" "$ARCHIVE/base"
printf "wal_level = replica\narchive_mode = on\narchive_command = 'test ! -f %s/wal/%%f && cp %%p %s/wal/%%f.tmp && mv %s/wal/%%f.tmp %s/wal/%%f'\n" "$ARCHIVE" "$ARCHIVE" "$ARCHIVE" "$ARCHIVE" >> "$work/live/postgresql.conf"
start live
"$root/db/server/init.sh" ${dbs#master_data identity } >/dev/null
for d in $dbs; do sql "$d" "create table pl11 (v text); insert into pl11 values ('1 before backup')"; done
"$root/deploy/backup.sh" base >/dev/null
for d in $dbs; do sql "$d" "insert into pl11 values ('2 after backup')"; done
target=$(sql postgres "select now()")
for d in $dbs; do sql "$d" "insert into pl11 values ('3 after target')"; done
sql postgres "select pg_switch_wal()" >/dev/null
stop "$work/live" fast                      # the server is lost; only the off-server copy survives

export MEDHANTA_STATE=$work RCLONE_CONFIG_SECURE_TYPE=crypt RCLONE_CONFIG_SECURE_REMOTE=$work/offsite BACKUP_REMOTE=secure:
BACKUP_KEY= "$root/deploy/backup.sh" copy >/dev/null 2>&1 && { echo "MED-02: copied without the key" >&2; exit 1; }
export BACKUP_KEY=test-only-backup-key-0123456789abcdef
"$root/deploy/backup.sh" copy >/dev/null
[ -z "$(find "$work/offsite" -name 'base.tar.gz' -o -name 'SHA256SUMS' -o -name '0000*')" ] || { echo "MED-02: file names not encrypted" >&2; exit 1; }
grep -rqa 'before backup' "$ARCHIVE/wal" || { echo "PL-11 test: no plain rows in the WAL to look for" >&2; exit 1; }
! grep -rqa 'before backup' "$work/offsite" || { echo "MED-02: contents not encrypted" >&2; exit 1; }
RCLONE_CONFIG_SECURE_PASSWORD=$(printf '%s' "$BACKUP_KEY" | rclone obscure -) rclone copy secure: "$work/fetched"   # README "Backups"
base=$(ls -d "$work/fetched"/base/* | tail -1)
cp -r "$base" "$work/changed" && printf x >> "$work/changed/base.tar.gz"
"$root/deploy/restore.sh" "$work/changed" "$target" "$work/refused" 2>/dev/null && { echo "MED-02: a changed base backup was restored" >&2; exit 1; }
rm "$work/changed/SHA256SUMS"
"$root/deploy/restore.sh" "$work/changed" "$target" "$work/refused" 2>/dev/null && { echo "MED-02: a base backup without SHA256SUMS was restored" >&2; exit 1; }
DB_ARCHIVE=$work/fetched "$root/deploy/restore.sh" "$base" "$target" "$work/restored" >/dev/null
start restored
for _ in $(seq 60); do [ "$(sql postgres 'select pg_is_in_recovery()')" = f ] && break; sleep 0.5; done
for d in $dbs; do
  got=$(sql "$d" "select string_agg(v, ',' order by v) from pl11")
  [ "$got" = "1 before backup,2 after backup" ] || { echo "PL-11 restore failed in $d: $got" >&2; exit 1; }
done
echo "PL-11 restore check passed: 10 databases restored to $target from the encrypted off-server copy, SHA256SUMS checked"
