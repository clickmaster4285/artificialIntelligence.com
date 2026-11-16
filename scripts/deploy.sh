#!/usr/bin/env bash
# Skew-safe production deploy for the self-hosted Next.js site (nginx -> PM2 -> next start).
#
# Why this exists: running `next build` inside the directory the live server
# is reading makes /_next/static chunks return HTTP 500 while the build runs,
# and leaves the old process regenerating ISR pages against the new build.
# (Reproduced locally; see PRODUCTION_FIX_REPORT.md.)
#
# What it does:
#   1. Builds each release in its own directory, so the live release is never touched.
#   2. Copies every older /_next/static file into the new release (never overwrites,
#      never deletes), so HTML cached anywhere keeps resolving its chunks.
#   3. Sets NEXT_DEPLOYMENT_ID so open browser tabs hard-reload instead of
#      requesting chunks from a build they were not rendered with.
#   4. Smoke-tests the new release on a spare port BEFORE switching traffic.
#   5. Switches the `current` symlink atomically, reloads PM2, and verifies the
#      live process reports the new deployment id. Previous releases are kept.
#
# Layout (created on first run):
#   $APP_DIR/releases/<timestamp>-<sha>/   one checkout + build per release
#   $APP_DIR/current -> releases/<...>     what PM2 runs
#   $APP_DIR/shared/.env                   production env file (copied into each release)
#
# Required env: APP_DIR, REPO_URL, PM2_APP_NAME
# Optional env: BRANCH (main), PORT (3000), SMOKE_PORT (3999), KEEP_RELEASES (5)
#
# Usage:     APP_DIR=/var/www/cm-ai REPO_URL=git@github.com:org/repo.git PM2_APP_NAME=cm-ai scripts/deploy.sh
# Rollback:  APP_DIR=... PM2_APP_NAME=... scripts/deploy.sh --rollback
#
# Review the variables against the real server before the first run.
set -euo pipefail

: "${APP_DIR:?set APP_DIR}"
: "${PM2_APP_NAME:?set PM2_APP_NAME}"
BRANCH="${BRANCH:-main}"
PORT="${PORT:-3000}"
SMOKE_PORT="${SMOKE_PORT:-3999}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
RELEASES="$APP_DIR/releases"
CURRENT="$APP_DIR/current"

log() { printf '[deploy %s] %s\n' "$(date +%H:%M:%S)" "$*"; }
die() { log "ERROR: $*"; exit 1; }

live_dpl_id() {
  curl -fsS --max-time 10 "http://127.0.0.1:$1/" | grep -o 'data-dpl-id="[^"]*"' | head -1 | cut -d'"' -f2
}

switch_to() {
  ln -sfn "$1" "$APP_DIR/current.tmp"
  mv -Tf "$APP_DIR/current.tmp" "$CURRENT"
  pm2 reload "$PM2_APP_NAME" --update-env
}

if [[ "${1:-}" == "--rollback" ]]; then
  active="$(readlink -f "$CURRENT")"
  # Release names start with a timestamp, so string order is age order.
  previous="$(ls -1d "$RELEASES"/*/ | sed 's#/$##' | sort | awk -v a="$active" '$0 < a' | tail -1)"
  [[ -n "$previous" ]] || die "no previous release to roll back to"
  log "rolling back $(basename "$active") -> $(basename "$previous")"
  switch_to "$previous"
  log "rolled back; check the site"
  exit 0
fi

: "${REPO_URL:?set REPO_URL}"
[[ -f "$APP_DIR/shared/.env" ]] || die "missing $APP_DIR/shared/.env"
mkdir -p "$RELEASES"

STAMP="$(date +%Y%m%d%H%M%S)"
TMP="$RELEASES/.incoming-$STAMP"
log "checking out $BRANCH"
git clone --quiet --depth 1 --branch "$BRANCH" "$REPO_URL" "$TMP" || die "clone of $BRANCH failed"
# Read the sha from the clone itself so the deployment id always matches the code built.
SHA="$(git -C "$TMP" rev-parse --short=12 HEAD)"
NEW="$RELEASES/$STAMP-$SHA"
mv "$TMP" "$NEW"
log "release $NEW ($BRANCH@$SHA)"
cp "$APP_DIR/shared/.env" "$NEW/.env"

cd "$NEW"
log "installing dependencies"
npm ci --no-audit --no-fund

log "building (live site untouched)"
NODE_ENV=production NEXT_DEPLOYMENT_ID="$SHA" npm run build

# Carry forward chunks from older releases. --ignore-existing: the new build's
# own files always win; nothing is deleted.
for old in "$RELEASES"/*/; do
  old="${old%/}"
  [[ "$old" == "$NEW" || ! -d "$old/.next/static" ]] && continue
  cp -rn "$old/.next/static/." "$NEW/.next/static/" 2>/dev/null || true
done
log "static assets preserved: $(find "$NEW/.next/static" -type f | wc -l) files"

log "smoke-testing new release on :$SMOKE_PORT"
PORT="$SMOKE_PORT" npx next start -p "$SMOKE_PORT" >"$NEW/smoke.log" 2>&1 &
SMOKE_PID=$!
trap 'kill $SMOKE_PID 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do curl -fsS --max-time 2 "http://127.0.0.1:$SMOKE_PORT/robots.txt" >/dev/null 2>&1 && break; sleep 1; done
for path in / /glossary/embeddings /nlp-development-cost /build-vs-buy-ai /sitemap.xml; do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "http://127.0.0.1:$SMOKE_PORT$path")"
  [[ "$code" == 200 ]] || die "smoke test $path returned $code (live site unchanged; see $NEW/smoke.log)"
done
home="$(curl -fsS "http://127.0.0.1:$SMOKE_PORT/")"
for chunk in $(grep -o '/_next/static/[^"?]*\.js' <<<"$home" | sort -u); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$SMOKE_PORT$chunk")"
  [[ "$code" == 200 ]] || die "chunk $chunk returned $code (live site unchanged)"
done
kill "$SMOKE_PID" 2>/dev/null || true
trap - EXIT
log "smoke test passed"

PREVIOUS="$(readlink -f "$CURRENT" 2>/dev/null || true)"
log "switching traffic to $(basename "$NEW")"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  switch_to "$NEW"
else
  ln -sfn "$NEW" "$CURRENT"
  (cd "$CURRENT" && pm2 start npm --name "$PM2_APP_NAME" -- start -- -p "$PORT")
  pm2 save
fi

for _ in $(seq 1 60); do [[ "$(live_dpl_id "$PORT" 2>/dev/null)" == "$SHA" ]] && break; sleep 1; done
if [[ "$(live_dpl_id "$PORT" 2>/dev/null)" != "$SHA" ]]; then
  log "live process is not serving $SHA. PM2 may have kept the old working directory."
  log "fix: pm2 delete $PM2_APP_NAME && cd $CURRENT && pm2 start npm --name $PM2_APP_NAME -- start -- -p $PORT && pm2 save"
  [[ -n "$PREVIOUS" ]] && log "rollback: scripts/deploy.sh --rollback (previous: $(basename "$PREVIOUS"))"
  exit 1
fi
log "live on :$PORT is serving deployment $SHA"

# Keep the newest releases for rollback. Their chunks already live on in the
# current release, so pruning old directories never breaks cached HTML.
ls -1d "$RELEASES"/*/ | sort | head -n "-$KEEP_RELEASES" | while read -r dir; do
  [[ "$(readlink -f "$dir")" == "$(readlink -f "$CURRENT")" ]] && continue
  log "pruning old release $(basename "$dir")"
  rm -rf "$dir"
done

log "done. Purge only HTML at the CDN if one is added later; /_next/static is immutable."
