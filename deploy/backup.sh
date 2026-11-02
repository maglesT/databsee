#!/usr/bin/env bash
# PL-11 backups, run by cron on the customer server (lines in README "Backups"):
#   deploy/backup.sh base   nightly: one consistent base backup of the whole server (all databases)
#   deploy/backup.sh copy   every 5 minutes: copy new WAL files and base backups off the server
# PostgreSQL archives every WAL file into $ARCHIVE/wal itself (archive_command in deploy/compose.yml), so with the
# latest base backup and the WAL after it the server can be restored to any point in time (deploy/restore.sh).
# Off-server: "rclone copy --immutable" adds files and never deletes or changes one; the bucket key in the
# customer secrets may add but not delete (deploy/backup-policy.json), so the server cannot erase a backup.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f deploy/secrets/backup.env ] && { set -a; . deploy/secrets/backup.env; set +a; }   # written by apply.ts
ARCHIVE=${ARCHIVE:-/var/lib/medhanta/archive}       # archive folder on the host
DB_ARCHIVE=${DB_ARCHIVE:-/archive}                  # the same folder as the database container sees it
IN_DB=${IN_DB-docker compose -f deploy/compose.yml exec -T db}  # runs a command next to the database
case "${1:-}" in
  base)
    stamp=$(date -u +%Y%m%dT%H%M%SZ)
    $IN_DB pg_basebackup -U postgres -D "$DB_ARCHIVE/base/$stamp" -F tar -z -X none --checkpoint=fast
    echo "backup: base backup $stamp" ;;
  copy)
    rclone copy --immutable "$ARCHIVE" "${BACKUP_REMOTE:?BACKUP_REMOTE is not set}"
    echo "backup: archive copied to $BACKUP_REMOTE" ;;
  *) echo "usage: deploy/backup.sh base|copy" >&2; exit 2 ;;
esac
