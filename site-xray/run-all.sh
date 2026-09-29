#!/usr/bin/env bash
# Runs the Site X-Ray capture on the eight Tuskrr reference sites, one after another.
# Needs: python3 with playwright (and its Chromium), pillow, ffmpeg. Run from the repo root.
# Each pack lands in site-xray/packs/<slug> - Repo Files/ . A full run takes 25 to 45 minutes per site.
set -u
cd "$(dirname "$0")/.."
run() { slug="$1"; url="$2"; out="site-xray/packs/${slug} - Repo Files"; mkdir -p "$out/06-raw"
  echo "== $slug"; python3 site-xray/scripts/xray.py all "$url" "$out" 2>&1 | tee "$out/06-raw/run.log"; }
run springsummer         https://springsummer.dk/
run basic-agency         https://www.basicagency.com/
run hellohello-outfit    https://outfit.hellohello.is/
run stroms-man           https://stroms.com/pages/man
run brunello-cucinelli   https://shop.brunellocucinelli.com/en-gb/ai   # blocks automated browsers: expect failures, see not-verified.md
run bread-and-boxers     https://breadandboxers.com/se
run offform              https://offform.net/
run unimatic-impronte    https://www.unimaticwatches.com/pages/impronte-collection
