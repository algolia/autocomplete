#!/usr/bin/env bash
#
# Local mirror of the "Bundle Size" GitHub workflow
# (.github/workflows/compressed-size.yml). Measures the gzipped size of the
# same tracked bundles and, optionally, diffs against a saved baseline.
#
# Usage:
#   yarn build                          # bundles must exist first
#   scripts/bundle-size.sh              # print current gzipped sizes
#   scripts/bundle-size.sh > base.txt   # save a baseline (e.g. from next)
#   scripts/bundle-size.sh base.txt     # print sizes + delta vs baseline
#
# Sizes come from node's zlib at level 9, which is what the `gzip-size`
# package behind compressed-size-action uses. GNU gzip is close but not equal:
# it deflates slightly differently and writes a filename header, so on
# autocomplete-core it reports 9622 bytes where zlib reports 9565.

set -euo pipefail
shopt -s nullglob

cd "$(dirname "$0")/.."

# Keep this list in sync with the `pattern` in compressed-size.yml. Every glob
# names an exact file, so the workflow's `exclude` has nothing left to match.
globs=(
  packages/*/dist/umd/index.production.js
  packages/*/dist/theme.min.css
)

baseline="${1:-}"

# We've cd'd to the repo root above, so resolve a relative baseline against
# the caller's original directory ($OLDPWD) rather than the repo root.
if [[ -n "$baseline" && "$baseline" != /* ]]; then
  baseline="$OLDPWD/$baseline"
fi

if [[ -n "$baseline" && ! -f "$baseline" ]]; then
  printf 'baseline file not found: %s\n' "$baseline" >&2
  exit 1
fi

# Look up a path's byte size in the baseline file (bash 3.2 has no assoc arrays).
lookup_base() { awk -v p="$1" '$2 == p { print $1; exit }' "$baseline"; }

fmt_kb() { awk "BEGIN { printf \"%.2f kB\", $1 / 1000 }"; }

gzip_size() {
  node -e 'const {gzipSync}=require("zlib");const {readFileSync}=require("fs");process.stdout.write(String(gzipSync(readFileSync(process.argv[1]),{level:9}).length))' "$1"
}

for glob in "${globs[@]}"; do
  for file in $glob; do
    bytes=$(gzip_size "$file")

    if [[ -n "$baseline" ]]; then
      old="$(lookup_base "$file")"
      if [[ -z "$old" ]]; then
        delta="  (new)"
      else
        diff=$((bytes - old))
        if [[ "$diff" -eq 0 ]]; then
          delta="  (=)"
        else
          sign=$([[ "$diff" -gt 0 ]] && printf '+' || printf '')
          delta="  (${sign}$(fmt_kb "$diff"))"
        fi
      fi
      printf "%s\t%s%s\n" "$(fmt_kb "$bytes")" "$file" "$delta"
    else
      # Baseline-friendly output: raw bytes + path (re-readable by this script).
      printf "%s %s\n" "$bytes" "$file"
    fi
  done
done
