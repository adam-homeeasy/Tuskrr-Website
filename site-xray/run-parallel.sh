#!/usr/bin/env bash
# Runs the X-Ray capture on seven of the eight sites, N at a time (default 3).
# Brunello Cucinelli is skipped: its bot protection blocks automated browsers.
set -u
cd "$(dirname "$0")/.."
N="${1:-3}"
run() { slug="$1"; url="$2"; out="site-xray/packs/${slug} - Repo Files"; mkdir -p "$out/06-raw"
  python3 site-xray/scripts/xray.py all "$url" "$out" > "$out/06-raw/run.log" 2>&1; echo "finished $slug"; }
export -f run
printf '%s\n' \
 "springsummer https://springsummer.dk/" \
 "basic-agency https://www.basicagency.com/" \
 "hellohello-outfit https://outfit.hellohello.is/" \
 "stroms-man https://stroms.com/pages/man" \
 "bread-and-boxers https://breadandboxers.com/se" \
 "offform https://offform.net/" \
 "unimatic-impronte https://www.unimaticwatches.com/pages/impronte-collection" \
 | xargs -P "$N" -L 1 bash -c 'run $0 $1'
