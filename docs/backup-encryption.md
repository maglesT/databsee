# Encrypted off-server backups

The base backups and WAL files that `deploy/backup.sh copy` sends off the server hold every record, signature and password
hash. They are encrypted on the server before they leave it, with a key only the customer holds. The store (Google Drive by
default) only ever sees encrypted names and contents.

## How it works
`backup.sh` puts an rclone `crypt` remote (`offsitecrypt:`) on top of the store remote (`offsite:<backup.path>`).
Contents are encrypted with NaCl secretbox (XSalsa20 + Poly1305), file names too (standard filename encryption). The
password reaches rclone only through its environment (`rclone obscure` reads it from stdin): it is never on a command line
or in a crontab. `--immutable` still applies: copied files are never changed or deleted.

## Set it up
1. Make two long random strings, for example `openssl rand -base64 32` twice (password and salt).
2. Add them to the customer secrets file (age, edited in memory, never printed):
   ```yaml
   backup_crypt:
     password: <random string>
     salt: <another random string>     # optional but recommended
   ```
3. Keep a copy of both strings **offline, outside the server and outside the store** (customer's password safe). Without them
   the backups cannot be read. This is the customer's key custody; write who holds it in the validation pack.
4. Apply the config. `apply` writes them to `backup.env` (mode 600) and `backup.sh check` prints no encryption warning.
5. `deploy/backup.sh copy`: the store now shows files with unreadable names. Nothing readable is uploaded.

If the secrets have no `backup_crypt`, `backup.sh copy` stops with "copy REFUSED". Only a demo may set
`backup: { allow_unencrypted: true }` in the customer config (then the copy runs with a warning).

## Keep the store apart (MED-02)
- **A Google account used only for backups**, not the owner's or anyone's mail account. Turn on 2-step verification;
  put its recovery codes in the same sealed envelope as the key. Authorise rclone (`rclone authorize "drive"`) with that
  account, `scope: drive.file`, and share the folder with nobody. A phished personal account then reaches nothing.
- **Sealed offline copy of the key**: print `backup_crypt` once, seal it in an envelope signed across the flap by two
  people, keep it in the site safe (and one with the owner), and record where in `customers/<name>.changes.md`.
- **Version history and trash**: Drive keeps earlier versions of a file and trashed files for 30 days. Files deleted or
  changed with the server's token can be brought back from that account within that time. Check the trash and a file's
  "Manage versions" at each trial restore (CP-04). The copy stays add-only (`rclone copy --immutable`).
- **Checksums**: every base backup carries `SHA256SUMS` of its files. `deploy/restore.sh` refuses a base backup that
  does not match it or has none. Base backups taken before this have none, so take a new one (`backup.sh base`).

## Switching an existing site on
Files already in the store stay unencrypted under the old names (immutable). The crypt remote starts a fresh, encrypted
copy of the whole local archive, so: apply the key, run `copy` once, check, then remove the old plain files from the store by hand.
The local archive keeps one week; take a base backup (`backup.sh base`) right after switching so a complete encrypted set exists.

## Restore from an encrypted store (lost server)
On the new server, with `backup.env` or the same two values in the environment:
```
export BACKUP_REMOTE=offsite:<backup.path> BACKUP_CRYPT_PASSWORD=... BACKUP_CRYPT_SALT=...   # from the offline copy
export RCLONE_CONFIG_OFFSITECRYPT_TYPE=crypt RCLONE_CONFIG_OFFSITECRYPT_REMOTE=$BACKUP_REMOTE
export RCLONE_CONFIG_OFFSITECRYPT_PASSWORD=$(printf %s "$BACKUP_CRYPT_PASSWORD" | rclone obscure -)
export RCLONE_CONFIG_OFFSITECRYPT_PASSWORD2=$(printf %s "$BACKUP_CRYPT_SALT" | rclone obscure -)
rclone copy offsitecrypt: /var/lib/medhanta/archive
```
then `deploy/restore.sh` as in the README. Do a trial restore from the encrypted store once (CP-04) before go-live.
