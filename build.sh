#!/usr/bin/env bash
# Build loadable extension directories for Chrome and Firefox.
# Output: dist/chrome and dist/firefox, each a self-contained unpacked extension.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST="$ROOT/dist"

VERSION="$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$ROOT/shared/../chrome/manifest.json" | head -n1)"

build_target() {
  local target="$1"
  local out="$DIST/$target"
  rm -rf "$out"
  mkdir -p "$out"
  cp -R "$ROOT/shared/." "$out/"
  cp -R "$ROOT/$target/." "$out/"
  echo "built $out"

  local zip="$DIST/synapse-web-clipper-$target-$VERSION.zip"
  rm -f "$zip"
  (cd "$out" && zip -qr "$zip" .)
  echo "packaged $zip"
}

rm -rf "$DIST"
build_target chrome
build_target firefox
echo "done."
