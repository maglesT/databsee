#!/usr/bin/env bash
# PL-10, MED-07: signs a built bundle with the release key (ssh-keygen -Y sign; checked by deploy/verify-bundle.sh).
# Run by GitHub Actions in a step of its own, the only step that holds the key. Writes <bundle.tar>.sig.
# Usage: BUNDLE_SIGNING_KEY=<ed25519 private key> deploy/sign-bundle.sh <bundle.tar>
set -euo pipefail
bundle=${1:?bundle}
key=$(mktemp) && trap 'rm -f "$key"' EXIT
printf '%s\n' "${BUNDLE_SIGNING_KEY:?BUNDLE_SIGNING_KEY is not set}" > "$key"
ssh-keygen -Y sign -q -f "$key" -n medhanta-bundle "$bundle"
echo "sign: $bundle.sig"
