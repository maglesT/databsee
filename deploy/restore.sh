#!/usr/bin/env bash
# PL-11: prepares a point-in-time restore of the whole server into an empty data folder.
# Usage: deploy/restore.sh <base backup folder> <target time, e.g. "2026-11-02 14:05:00+00" | latest> <new data folder>
# The base backup and WAL come from $ARCHIVE (first fetch them back with
# "rclone copy $BACKUP_REMOTE $ARCHIVE" if the server was lost). Then start PostgreSQL on the new folder: it replays
# the WAL up to the target time and opens. Archiving is off in the restored copy; switch it on again
# (archive_mode = on) once that copy becomes the live server. CP-04: the site restores a real backup periodically.
set -euo pipefail
base=${1:?base backup folder} target=${2:?target time or latest} data=${3:?new data folder}
ARCHIVE=${ARCHIVE:-/var/lib/medhanta/archive}
[ ! -e "$data" ] || [ -z "$(ls -A "$data")" ] || { echo "restore: $data is not empty" >&2; exit 1; }
mkdir -p "$data" && chmod 700 "$data"
tar -xzf "$base/base.tar.gz" -C "$data"
{
  echo "restore_command = 'cp $ARCHIVE/wal/%f %p'"
  [ "$target" = latest ] || echo "recovery_target_time = '$target'"
  echo "recovery_target_action = 'promote'"
  echo "archive_mode = 'off'"
} >> "$data/postgresql.auto.conf"
touch "$data/recovery.signal"
echo "restore: $data prepared from $base, target $target; start PostgreSQL on it"
