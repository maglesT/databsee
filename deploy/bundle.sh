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
rm -rf "$work/customers" && mkdir "$work/customers" && cp "$config" "${config%.yaml}.secrets.yaml.age" "$work/customers/"
(cd "$work" && npm ci --no-audit --no-fund >/dev/null)
docker build -q -t "medhanta/platform:$version" "$work" >/dev/null
# Products kept in their own repo (D-29): image built at the pinned commit, migrations copied to db/<product>.
# A private repo is read with PRODUCT_SOURCE_TOKEN (GitHub Actions secret).
products=""
for p in $(yq -r '.licences[]' "$config"); do
  m="$work/apps/$p/manifest.json"
  repo=$(jq -r '.source.repo // empty' "$m") commit=$(jq -r '.source.commit // empty' "$m")
  [ -n "$repo" ] || continue
  src="$work/src/$p" && mkdir -p "$src" && git -C "$src" init -q
  auth=() && [ -n "${PRODUCT_SOURCE_TOKEN:-}" ] &&
    auth=(-c "http.extraHeader=Authorization: Basic $(printf 'x-access-token:%s' "$PRODUCT_SOURCE_TOKEN" | base64 -w0)")
  git -C "$src" "${auth[@]}" fetch -q --depth 1 "$repo" "$commit" && git -C "$src" checkout -q FETCH_HEAD
  docker build -q -f "$src/ops/Dockerfile" -t "medhanta/$p:$commit" "$src" >/dev/null
  # A product with a worker container (Operations' ML worker) builds it from ml/Dockerfile as medhanta/<p>-ml.
  if [ -f "$src/ml/Dockerfile" ]; then
    docker build -q -t "medhanta/$p-ml:$commit" "$src/ml" >/dev/null
    products="$products medhanta/$p-ml:$commit"
  fi
  # A product that migrates itself (manifest "migrate": "own", Batchwright) brings its migrations in its image.
  if [ "$(jq -r '.migrate // empty' "$m")" != own ]; then rm -rf "$work/db/$p" && cp -r "$src/db/migrations" "$work/db/$p"; fi
  rm -rf "$src"
  products="$products medhanta/$p:$commit"
done
rm -rf "$work/src"
others=$(grep -o 'image: [a-z]*:[0-9.]*$' "$work/deploy/compose.yml" | cut -d' ' -f2)   # pinned in compose.yml
for i in $others; do docker pull -q "$i" >/dev/null; done
docker save "medhanta/platform:$version" $products $others | gzip > "$work/images.tar.gz"
mkdir -p "$out" && tar -C "$work" -cf "$out/$name.tar" .
ssh-keygen -Y sign -q -f "$key" -n medhanta-bundle "$out/$name.tar"
echo "$out/$name.tar"
