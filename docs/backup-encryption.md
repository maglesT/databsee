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
