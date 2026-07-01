#!/usr/bin/env bash
# Blingbids git sync — always run from the real project path
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

if [ ! -d ".git" ]; then
  echo "Error: not a git repo at $REPO_ROOT" >&2
  exit 1
fi

echo "→ Syncing Blingbids at $REPO_ROOT"
git status -sb
git push origin main "$@"
