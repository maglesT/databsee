#!/usr/bin/env bash
# PL-11 backups, run by cron on the customer server (lines in README "Backups"):
#   deploy/backup.sh base   nightly: one consistent base backup of the whole server (all databases)
#   deploy/backup.sh copy   every 5 minutes: copy new WAL files and base backups off the server
#   deploy/backup.sh check  at every apply: the off-server remote is reachable (writes and deletes nothing)
# PostgreSQL archives every WAL file into $ARCHIVE/wal itself (archive_command in deploy/compose.yml), so with the
# latest base backup and the WAL after it the server can be restored to any point in time (deploy/restore.sh).
# Off-server: "rclone copy --immutable" to the remote in the customer config (default Google Drive) adds files and
# never deletes or changes a copied one, so backups are secure from alteration and inadvertent erasure (211.68(b)).
# MED-02: the remote is an rclone crypt remote ("secure", over the backup folder; key BACKUP_KEY from the age secrets),
# so file names and contents leave the server encrypted; this script refuses to copy without the key. Each base backup
# carries SHA256SUMS of its files, which deploy/restore.sh checks before restoring.
set -euo pipefail
cd "$(dirname "$0")/.."
# Settings written by apply.ts; a value already set by the caller wins.
state=${MEDHANTA_STATE:-/var/lib/medhanta/state}
if [ -f "$state/backup.env" ]; then
  while IFS='=' read -r k v; do v=${v#\'}; [ -n "${!k:-}" ] || export "$k=${v%\'}"; done < "$state/backup.env"
fi
ARCHIVE=${ARCHIVE:-/var/lib/medhanta/archive}       # archive folder on the host
DB_ARCHIVE=${DB_ARCHIVE:-/archive}                  # the same folder as the database container sees it
IN_DB=${IN_DB-docker compose -f deploy/compose.yml exec -T db}  # runs a command next to the database
secure() {   # MED-02: the crypt remote's password, from the key (rclone wants it obscured; read on stdin, not argv)
  [ -n "${BACKUP_KEY:-}" ] || { echo "backup: BACKUP_KEY is not set: refusing to copy backups off the server unencrypted" >&2; exit 1; }
  [ "${RCLONE_CONFIG_SECURE_TYPE:-}" = crypt ] && [ "${BACKUP_REMOTE:-}" = secure: ] ||
    { echo "backup: BACKUP_REMOTE must be the crypt remote secure: (RCLONE_CONFIG_SECURE_TYPE=crypt)" >&2; exit 1; }
  RCLONE_CONFIG_SECURE_PASSWORD=$(printf '%s' "$BACKUP_KEY" | rclone obscure -)
  export RCLONE_CONFIG_SECURE_PASSWORD
}
case "${1:-}" in
  base)
    stamp=$(date -u +%Y%m%dT%H%M%SZ)       # written under a dot name, renamed when complete (never copied half-done)
    # MED-02: SHA256SUMS lists every file of the base backup (checked by restore.sh), written before the rename.
    $IN_DB sh -c "pg_basebackup -U postgres -D '$DB_ARCHIVE/base/.$stamp' -F tar -z -X none --checkpoint=fast &&
      cd '$DB_ARCHIVE/base/.$stamp' && files=\$(ls) && sha256sum \$files > SHA256SUMS && cd / &&
      mv '$DB_ARCHIVE/base/.$stamp' '$DB_ARCHIVE/base/$stamp'"
    echo "backup: base backup $stamp" ;;
  copy)
    secure
    mkdir -p "$ARCHIVE/wal" "$ARCHIVE/base"     # a new server has no base backup yet
    exec 9>"$ARCHIVE/.copy.lock"; flock -n 9 || { echo "backup: a copy is still running"; exit 0; }
    status=0
    rclone copy --immutable --exclude '.*' --exclude '.*/**' --exclude '*.tmp' "$ARCHIVE" "${BACKUP_REMOTE:?BACKUP_REMOTE is not set}" || status=$?
    # Keep one week locally so the disk never fills (a full disk stops archiving); delete only files the remote has,
    # even when the copy reported a problem.
    remote=$(rclone lsf -R --files-only "$BACKUP_REMOTE")
    find "$ARCHIVE/wal" "$ARCHIVE/base" -type f -mtime +7 | while read -r f; do
      grep -qxF "${f#"$ARCHIVE"/}" <<<"$remote" && rm -f "$f"
    done
    find "$ARCHIVE/base" -mindepth 1 -type d -empty -delete
    [ "$status" = 0 ] || { echo "backup: copy to $BACKUP_REMOTE FAILED (exit $status)" >&2; exit "$status"; }
    echo "backup: archive copied to $BACKUP_REMOTE" ;;
  check)
    secure
    rclone lsf --max-depth 1 "${BACKUP_REMOTE:?BACKUP_REMOTE is not set}" >/dev/null 2>&1 || rclone mkdir "$BACKUP_REMOTE"
    echo "backup: $BACKUP_REMOTE reachable" ;;
  *) echo "usage: deploy/backup.sh base|copy|check" >&2; exit 2 ;;
esac
