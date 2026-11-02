#!/usr/bin/env bash
# Builds and signs the bundle for one customer (run by GitHub Actions, .github/workflows/apply.yml).
# Contents: the platform release named in the config (git tag v<version>) with its node_modules, its images
# (docker save), and the customer's config and encrypted secrets from the current commit.
# Usage: deploy/bundle.sh customers/<name>.yaml <out dir> <signing key file>
set -euo pipefail
config=${1:?config} out=${2:?out dir} key=${3:?signing key}
customer=$(basename "$config" .yaml) version=$(yq -r .version "$config")
name=$customer-$version-$(git rev-parse --short HEAD)
work=$(mktemp -d) && trap 'rm -rf "$work"' EXIT
git archive "v$version" | tar -x -C "$work"
mkdir -p "$work/customers" && cp "$config" "${config%.yaml}.secrets.yaml.age" "$work/customers/"
(cd "$work" && npm ci --no-audit --no-fund >/dev/null)
docker build -q -t "medhanta/platform:$version" "$work" >/dev/null
docker pull -q postgres:17 >/dev/null && docker pull -q caddy:2 >/dev/null
docker save "medhanta/platform:$version" postgres:17 caddy:2 | gzip > "$work/images.tar.gz"
mkdir -p "$out" && tar -C "$work" -cf "$out/$name.tar" .
ssh-keygen -Y sign -q -f "$key" -n medhanta-bundle "$out/$name.tar"
echo "$out/$name.tar"
