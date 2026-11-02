#!/usr/bin/env bash
# PL-11: prepares a point-in-time restore of the whole server into an empty data folder.
# Usage: deploy/restore.sh <base backup folder> <target time, e.g. "2026-11-02 14:05:00+00" | latest> <new data folder>
# The base backup and WAL come from $ARCHIVE (first fetch them back with
# "rclone copy $BACKUP_REMOTE $ARCHIVE" if the server was lost). Then start PostgreSQL on the new folder: it replays
# the WAL up to the target time and opens as a new timeline. After a real restore take a base backup at once
# (deploy/backup.sh base). A trial restore (CP-04) must use its own copy of the archive, never the live one.
# DB_ARCHIVE is the archive folder as the restored PostgreSQL sees it (/archive in the db container).
set -euo pipefail
base=${1:?base backup folder} target=${2:?target time or latest} data=${3:?new data folder}
DB_ARCHIVE=${DB_ARCHIVE:-/archive}
[ ! -e "$data" ] || [ -z "$(ls -A "$data")" ] || { echo "restore: $data is not empty" >&2; exit 1; }
mkdir -p "$data" && chmod 700 "$data"
tar -xzf "$base/base.tar.gz" -C "$data"
{
  echo "restore_command = 'cp $DB_ARCHIVE/wal/%f %p'"
  [ "$target" = latest ] || echo "recovery_target_time = '$target'"
  echo "recovery_target_action = 'promote'"
} >> "$data/postgresql.auto.conf"
touch "$data/recovery.signal"
[ "$(id -u)" != 0 ] || chown -R 999:999 "$data"   # the postgres user of the postgres:17 image
echo "restore: $data prepared from $base, target $target; start PostgreSQL on it"
