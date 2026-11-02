#!/usr/bin/env bash
# PL-11 backups, run by cron on the customer server (lines in README "Backups"):
#   deploy/backup.sh base   nightly: one consistent base backup of the whole server (all databases)
#   deploy/backup.sh copy   every 5 minutes: copy new WAL files and base backups off the server
#   deploy/backup.sh check  at every apply: the off-server store must refuse a delete by this server
# PostgreSQL archives every WAL file into $ARCHIVE/wal itself (archive_command in deploy/compose.yml), so with the
# latest base backup and the WAL after it the server can be restored to any point in time (deploy/restore.sh).
# Off-server: "rclone copy --immutable" adds files and never deletes or changes one; the bucket key in the
# customer secrets may add but not delete (deploy/backup-policy.json), so the server cannot erase a backup.
set -euo pipefail
cd "$(dirname "$0")/.."
# Settings written by apply.ts; a value already set by the caller wins.
if [ -f deploy/secrets/backup.env ]; then
  while IFS='=' read -r k v; do v=${v#\'}; [ -n "${!k:-}" ] || export "$k=${v%\'}"; done < deploy/secrets/backup.env
fi
ARCHIVE=${ARCHIVE:-/var/lib/medhanta/archive}       # archive folder on the host
DB_ARCHIVE=${DB_ARCHIVE:-/archive}                  # the same folder as the database container sees it
IN_DB=${IN_DB-docker compose -f deploy/compose.yml exec -T db}  # runs a command next to the database
case "${1:-}" in
  base)
    stamp=$(date -u +%Y%m%dT%H%M%SZ)       # written under a dot name, renamed when complete (never copied half-done)
    $IN_DB sh -c "pg_basebackup -U postgres -D '$DB_ARCHIVE/base/.$stamp' -F tar -z -X none --checkpoint=fast &&
      mv '$DB_ARCHIVE/base/.$stamp' '$DB_ARCHIVE/base/$stamp'"
    echo "backup: base backup $stamp" ;;
  copy)
    exec 9>"$ARCHIVE/.copy.lock"; flock -n 9 || { echo "backup: a copy is still running"; exit 0; }
    rclone copy --immutable --exclude '.*' --exclude '.*/**' --exclude '*.tmp' "$ARCHIVE" "${BACKUP_REMOTE:?BACKUP_REMOTE is not set}"
    # Everything is off the server now; keep one week locally so the disk never fills (a full disk stops archiving).
    find "$ARCHIVE/wal" -type f -mtime +7 -delete
    find "$ARCHIVE/base" -mindepth 1 -maxdepth 1 -type d -mtime +7 -exec rm -rf {} +
    echo "backup: archive copied to $BACKUP_REMOTE" ;;
  check)
    probe="${BACKUP_REMOTE:?BACKUP_REMOTE is not set}/.probe/$(date -u +%Y%m%dT%H%M%SZ)"
    echo "delete probe" | rclone rcat "$probe"
    if rclone deletefile "$probe" 2>/dev/null; then
      echo "backup: the off-server store let this server delete a file; fix its key and Object Lock" >&2; exit 1
    fi
    echo "backup: off-server store refuses deletes" ;;
  *) echo "usage: deploy/backup.sh base|copy|check" >&2; exit 2 ;;
esac
