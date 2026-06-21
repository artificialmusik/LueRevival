#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${1:-LueRevival}"
VISIBILITY="${2:---public}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is not installed. Install GitHub CLI or create https://github.com/YOUR_USER/${REPO_NAME} manually, then:" >&2
  echo "  git remote add origin https://github.com/YOUR_USER/${REPO_NAME}.git" >&2
  echo "  git push -u origin main" >&2
  exit 1
fi

gh auth status >/dev/null

git init >/dev/null 2>&1 || true
git add -A
if ! git diff --cached --quiet; then
  git commit -m "Initial LueRevival modern AlpacaBoards rewrite"
fi
git branch -M main
gh repo create "${REPO_NAME}" "${VISIBILITY}" --source . --push --description "Modern Docker-ready AlpacaBoards/LUE-style forum revival"
