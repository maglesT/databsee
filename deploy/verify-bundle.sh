#!/usr/bin/env bash
# PL-10: a bundle is applied only if it carries the owner's release signature (ssh-keygen -Y sign by GitHub Actions).
# Usage: deploy/verify-bundle.sh <bundle.tar> [allowed_signers]   (signature in <bundle.tar>.sig)
set -euo pipefail
bundle=${1:?bundle} signers=${2:-${MEDHANTA_SIGNERS:-/etc/medhanta/allowed_signers}}
ssh-keygen -Y verify -f "$signers" -I medhanta-release -n medhanta-bundle -s "$bundle.sig" < "$bundle" >/dev/null 2>&1 \
  || { echo "verify: $bundle is not signed by the release key; nothing applied" >&2; exit 1; }
echo "verify: $bundle signature good"
