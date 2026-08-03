#!/bin/sh
# Sync CLAUDE.md (source of truth) into .github/copilot-instructions.md.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SOURCE="$ROOT/CLAUDE.md"
TARGET="$ROOT/.github/copilot-instructions.md"

usage() {
  cat <<'EOF'
Usage: scripts/sync-ai-instructions.sh [--check]

  (no args)  Regenerate .github/copilot-instructions.md from CLAUDE.md.
  --check    Exit 1 (and print a diff) if the generated file is stale.
  --help     Show this message.
EOF
}

generate() {
  cat <<'EOF'
<!-- GENERATED FILE — DO NOT EDIT.
     Source: CLAUDE.md · Regenerate: ./scripts/sync-ai-instructions.sh -->

EOF
  cat "$SOURCE"
}

MODE=sync
case "${1-}" in
  --check) MODE=check ;;
  --help|-h) usage; exit 0 ;;
  "") ;;
  *) echo "unknown option: $1" >&2; usage >&2; exit 2 ;;
esac

if [ ! -f "$SOURCE" ]; then
  echo "missing source: $SOURCE" >&2
  exit 1
fi

if [ "$MODE" = check ]; then
  EXPECTED=$(mktemp)
  trap 'rm -f "$EXPECTED"' EXIT
  generate >"$EXPECTED"
  if [ ! -f "$TARGET" ]; then
    echo "stale: .github/copilot-instructions.md is missing" >&2
    echo "run ./scripts/sync-ai-instructions.sh" >&2
    exit 1
  fi
  if ! diff -u "$TARGET" "$EXPECTED"; then
    echo "stale: .github/copilot-instructions.md does not match CLAUDE.md" >&2
    echo "run ./scripts/sync-ai-instructions.sh" >&2
    exit 1
  fi
  echo "up to date"
  exit 0
fi

mkdir -p "$ROOT/.github"
generate >"$TARGET"
echo "synced: CLAUDE.md -> .github/copilot-instructions.md"
