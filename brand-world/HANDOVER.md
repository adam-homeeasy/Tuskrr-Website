# Tuskrr: handover for the next session

The next job is to **work with reference websites the user will provide**. Read
this whole file before touching anything.

## Rules from the user (important)

- **Build only what the user asks for.** After the direction library, the user asked: "Give me one site for each direction. Generously use stock images and videos." Those prototypes now exist (see below). Ask before building anything further.
- **Do not merge themes.** Keep each theme separate. More options will be added.
- Ask when an instruction is ambiguous; a wrong guess cost a full rebuild last time.
- Use they/them; the range is unisex.

## Client and brand facts (locked)

| Item | Decision |
|---|---|
| Brand | Tuskrr, leather work and everyday bags. Logo: tusker monogram (t + R) and a tall condensed wordmark |
| Tagline | **Arrive like you mean it.** (trademark search on IP India still needed) |
| Brand idea | Linear Wilderness (from the client's own product deck): nature's lines, given structure |
| ICP | Early-career climber, 24 to 34, metro India (Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad); tech, startups, consulting, design, media, finance; smart-casual; carries a company-issue nylon backpack |
| Secondary buyers | Gift givers (first job, promotion, birthday, anniversary); corporate gifting (STRATA, CONTOUR) |
| Triggers | Self-buyer: "I've levelled up. My bag hasn't." Payoff: "Where's that from?" Gift giver: "I see who you're becoming." |
| Emotion / promise | Pride in who you're becoming. / For the person you're becoming. |
| Personality | Confident not loud, Sharp not corporate, Warm not soft, A little wild not rugged |
| Price | Rs 5,000 to 7,000 (accessible premium) |
| Market, channel | India first; direct online (Instagram-led, bought on a phone) and gifting |
| Material | Genuine leather |
| Warranty | 3 years |
| Cash on delivery | Yes |
| Initials embossing | Custom order, ready in 2 weeks (price not given) |
| Diwali gifting page | No |
| Laptop sizes, returns | Use dummy values, labelled as samples |

Products (client's order, names and lines from `Tuskrr Product Names copy.pdf`):
RIDGE (backpack, terrain, "Carry your own direction."), TRAVERSE (weekender,
movement, "Take the long way." / "Made for the distance between here and
there."), STRATA (laptop briefcase, layers, "Built in layers."), CREST
(backpack, elevation, "Rise above ordinary." / "Find your high point."), AXIS
(vertical sling, direction, "Nothing unnecessary."), CONTOUR (laptop folio,
form, "Protection, shaped beautifully.").

Known issues in the source files: badges use two wordmarks (drawn on RIDGE and
CREST, plain letters on the rest); the gold S appears on only four badges; logo
exists only as JPEGs (vector needed); moodboard photos in the PDF are not ours
to use; product images are renders.

## State of the work (git, branch `claude/ecstatic-cerf-eqi4ii`)

| Commit | What it holds | Status |
|---|---|---|
| `1d5ff74` | Round 1: three landscape-led worlds, all "Linear Wilderness": A Field Survey (contour map), B Quiet Architecture (vertical channels, carbon and concrete, gold S), C High Ground (dusk ridgelines) | Source for the **Linear Wilderness** theme |
| `2744842` | Round 2: foundation page plus three city-first options: A The Entrance, B Monday to Monday, C Sharp Lines, Wild Heart | Source for **The Entrance** theme (keep A only) |
| `bb939da` (HEAD) | The Entrance with Linear Wilderness merged into it; B and C removed | **Rejected by the user.** Do not build on this merge |

**What the user wants next:** two separate themes, not merged, with room for
more options:
1. **Linear Wilderness** (from round 1)
2. **The Entrance** (round 2 option A, as it was in `2744842`)

**Open question to ask before rebuilding:** round 1 had three worlds under
Linear Wilderness. Is the Linear Wilderness theme one of them (Field Survey,
Quiet Architecture or High Ground), or the idea on its own? Unanswered.

Recover old files with, for example:
`git show 2744842:brand-world/src/option-a.mjs` or
`git checkout 1d5ff74 -- brand-world/src/option-a.mjs` (into a new name).

## Next task: reference websites

When the user sends the sites:
1. Load the `design-dna` skill and measure each site (easings, durations,
   delay grids, travel, overlays, palettes), not guessed from screenshots.
2. Apply what fits to each theme separately; use `web-directions` rules
   (structural difference between directions, motion contract, contrast-solved
   palettes, one self-contained file per page).
3. Run `page-proof` checks before sharing anything.

## How the build works

```sh
node brand-world/src/extract-logos.mjs   # transparent logo PNGs from the JPEGs
node brand-world/src/build.mjs           # writes the HTML pages
node brand-world/src/proof.mjs           # contrast (real pixels), overflow at 9 widths, 44px taps, motion states, no dashes
```

- Node 22; Playwright is global at `/opt/node22/lib/node_modules/playwright`,
  Chromium at `/opt/pw-browsers`. ESM imports need `createRequire` (see scripts).
- `src/shared.mjs`: assets as data URIs, fonts (OFL, in `assets/fonts`),
  `PRODUCTS`, generated line art (contours, ridges, strata, skyline, wild
  lines), motion layer, `NOT_FINAL` list.
- `src/worlds.mjs`: foundation and theme copy. `src/sections.mjs`: shared
  section layouts. `src/the-entrance.mjs`, `src/start-here.mjs`: pages.
- `PROOF_FILES=a.html,b.html node brand-world/src/proof.mjs` checks specific files.

## House rules the pages follow

- No em or en dashes in page copy. Tap targets at least 44px. No horizontal scroll.
- Motion: cubic-bezier(0.42, 0, 0.58, 1), 1s entrances, 16px travel, 0.125s
  delay grid capped at 0.75s, 0.25s controls, 1s page fade; `?motion=off` and
  `?motion=force` override reduced motion.
- Palettes solved for contrast (4.5 body, 3.0 display) and the ratios noted.
- Label every image: "Supplied render" or "Drawn stand-in". No stock photos.
- Every page ends with the "Not final" list.

## Reference-sites session (28 Sep 2026): what was done

Nothing was built. Two reference pages and a reference library were added:

| File | What it is |
|---|---|
| `website-directions.html` | Direction library: 8 directions, one per reference site, each on ONE theme (not merged). Per direction: the measured reference, take and leave, how the brand world is used (palette with computed ratios, type, logo, device, products, voice), motion contract, phone wireframes, required assets, watch-outs |
| `asset-requirements.html` | Asset catalogue (35 sets: brand, studio, people, video, drawing, facts), direction matrix, what exists today, production grouping, file specs, rights |
| `references/DNA.md` | Measured numbers per site, with evidence and unknowns |
| `src/directions-data.mjs`, `src/directions.mjs` | Data and generator. `node brand-world/src/directions.mjs` |

Directions: The Entrance: 01 The Reel (BASIC/DEPT), 02 The Host (Brunello
Cucinelli AI), 03 The Roster (OFFFORM), 04 The Outfitter (Ströms, daylight
mode). Linear Wilderness: 05 Six Readings (Spring/Summer, Quiet Architecture
palette), 06 The Small Store (++hellohello OUTFIT, Field Survey), 07 Pressed In
(UNIMATIC Impronte, Field Survey), 08 Everyday Kit (Bread & Boxers, High Ground).

Measurement limits: the cloud Chromium could not open HTTPS pages (the session
proxy's certificate is not trusted by Chromium, and a workaround was refused),
so numbers come from the shipped CSS and HTML (`references/read-source.py`).
Reveal travel, JS-driven from-states and blur on reveals are not measured.
Brunello Cucinelli returns 403 to automated readers; its direction uses the
house motion contract. Run `references/measure.mjs` on a normal machine to
complete the pass.

Still open: which direction(s) to take forward; the Linear Wilderness question
above (each LW direction names the round 1 world it suits); whether the
drinkstill.nz teardown pack (folders `01-teardown` to `06-raw` at the repo
root, uploaded on the session branch) is a ninth reference.

Checks: `PROOF_FILES=website-directions.html,asset-requirements.html node brand-world/src/proof.mjs` passes.

## Direction sites (28 Sep 2026, same session)

On request ("one site for each direction, generously use stock"), eight
single-page prototypes were built in `brand-world/sites/`, plus `index.html`.
Each is one self-contained HTML file (media embedded, 2 to 7.4 MB).

| File | Direction | Structure |
|---|---|---|
| `01-the-reel.html` | The Reel | Film hero, masked line reveals, "Watch the film" plays 5 clips in sequence, drag reel with 01/06 counter |
| `02-the-host.html` | The Host | Prompt bar and cues; rules-based finder assembles glass answer blocks; gift branch with live initials |
| `03-the-roster.html` | The Roster | 9-second portrait loop, mono index of sample profiles, bag sheets "chosen by" |
| `04-the-outfitter.html` | The Outfitter | Service bar, 4:5 editorial hero, occasion tiles, filterable grid, Cognac Edit |
| `05-six-readings.html` | Six Readings | Fixed index sidebar that takes each bag's colour, one full-width word and landscape video per bag |
| `06-the-small-store.html` | The Small Store | Six-frame preloader, wordmark across the page, numbered sheets with "See it out" |
| `07-pressed-in.html` | Pressed In | Leather hero with contours, detail bands (channel, gold S, grain, hide), filmstrip, live embossing preview |
| `08-everyday-kit.html` | Everyday Kit | Proof ticker, serif occasion banners with rails, The Pair gift set |

How it is built:
- `sites/src/stock-search.py` searched Coverr, Mixkit (video), Burst and
  Openverse (photos) and wrote contact sheets. Burst rate-limited after one
  search; Openverse results were unreliable, so stills are mostly frames cut
  from the licensed clips.
- `sites/src/media.py` downloads the chosen clips, trims to 6 to 8 s, encodes
  720p H.264 without audio (0.2 to 1.7 MB each), cuts stills, writes
  `sites/media/credits.json`. `sites/src/cutout.py` cuts the six renders out of
  their grey studio ground (`sites/media/cut-*.webp`).
- `sites/src/kit.mjs` is shared: sample prices, media embedding with a
  "Stock stand-in" or "Supplied render" tag on every frame, bag counter,
  per-direction reveal engine, credits and "Not final" footer.
- `node brand-world/sites/src/build-sites.mjs [01 ... 08 index]` builds.
- Proof: `PROOF_ANY_EASE=1 PROOF_FILES=sites/01-the-reel.html,... node brand-world/src/proof.mjs`
  (`PROOF_ANY_EASE` because each site follows its own measured motion contract).

Honesty rules kept: stock never shows a bag as if it were Tuskrr's; every frame
is labelled; roster names are sample profiles; prices, laptop sizes and returns
are samples; the rules-based finder stands in for asset F5.

Headless Chromium notes: full-page screenshots drop embedded images (use
viewport shots); a CSS `filter: blur()` band under an image layer rendered a
dark box, so light bands are plain gradients.

---

# HANDOVER FOR THE NEXT THREAD (written 29 Sep 2026)

Read this section first. It supersedes the "next task" section higher up.

## What the user just said, and what it means

After the eight direction sites were built, the user said: **"Not impressive at all. These are nothing like the ref sites."**
They were right, and the cause is known: the eight sites in `brand-world/sites/` were built from
each reference's shipped CSS and written descriptions, because the cloud browser could not open any
HTTPS page at the time. So they borrow structure and pacing but not the look, type, layout or motion of the
references. The user then asked for a full X-Ray of the eight references. That is now mostly done (below).

**Do not rebuild anything until the user says go.** When they do, build from the teardowns in
`site-xray/packs/*/01-teardown/`, not from memory or from the older `brand-world/references/DNA.md`.

## What exists (all pushed to branch `claude/compassionate-volta-4pumrj`)

| Thing | Where | State |
|---|---|---|
| Brand foundation + The Entrance | `brand-world/START-HERE.html`, `the-entrance.html` | Done earlier |
| Direction library (8 directions) | `brand-world/website-directions.html` | Done; passes proof |
| Assets and requirements (35 sets) | `brand-world/asset-requirements.html` | Done; passes proof |
| Eight prototype sites with stock media | `brand-world/sites/*.html`, index at `sites/index.html` | Built, pass proof, **rejected by the user as not like the refs** |
| Older reference numbers (from code only) | `brand-world/references/DNA.md`, `*/source.json` | Superseded by X-Ray for 5 sites |
| **X-Ray teardowns** | `site-xray/packs/<site> - Repo Files/01-teardown/` | See table |
| X-Ray scripts and runners | `site-xray/scripts/`, `site-xray/run-all.sh`, `run-parallel.sh` | Working, several bugs fixed |

Only the light parts of each pack are committed (teardowns, `02-data`, `06-raw` JSON, contact sheets in
`05-screens/sheets`). Assets, code bundles, full screenshots and video are gitignored; regenerate with
`site-xray/run-all.sh` on a machine that can open the sites.

## X-Ray status per reference

| Reference (direction) | Teardown | What it found |
|---|---|---|
| hellohello OUTFIT (06 The Small Store) | **Written** | Giant red `#ff0001` OUTFIT wordmark on cream `#ede4dd`; Next 16, GSAP 3.14, Lenis 1.3, Motion 12. 4.4 s preloader: six tilted photos pop in, 000 to 100 counter, clip-path wipe. Hero letters rise in random order, 5 px rule draws (scaleX 0 to 1, 1.6 s expo.out), title 2.4 s expo.out from y 32. Product tiles: cover slides off, photo un-zooms from 1.4. Cyan `mix-blend-mode: difference` nav. Neue Haas Grotesk Text Pro (paid). |
| BASIC/DEPT (01 The Reel) | **Written** | No GSAP/Lenis. Custom eased smooth scroll (easeOutQuint over 60 frames, sections moved by transform), whole-page colour flip bright/dark/bright on a 650 ms transition, pink DRAG and white WATCH REEL cursor discs (lerp 0.15 and 0.25), CSS hero curtain, animated film grain. Next 16.2, Sanity, Scto Grotesk A (paid). Videos would not paint in cloud Chromium. |
| Spring/Summer (05 Six Readings) | **Written** (gaps filled after re-capture) | Nuxt/Vue 3.5, GSAP 3.13, Swiper, Mux. Row theme swap at viewport midpoint (0.4 s ease-out), word-cycling loader into a curtain wipe (nine words at 0.2 s, 2 s drop on cubic-bezier(.5,0,0,1)), 386 px WE WON headline, glass sidebar widgets with scroll lag (lerp 0.1). Page 4,997 px. |
| Ströms (04 The Outfitter) | **Written** | Shopify theme "coi", about 45 web components, Swiper, instant.page, CSS View Transitions (0.2 s). Zero-gap editorial photo grid (24:10, 5:4, 1:1, 4:5), 1.05 zoom on hover over 0.4 s, product card that hides detail until hover, shoppable lookbook, 50 px sticky header with hairline draw, 3-level mega menu, scroll fade-ins 425 ms linear at IO 0.15. Akzidenz-Grotesk Pro (paid). |
| UNIMATIC Impronte (07 Pressed In) | **Written** | Custom Shopify theme, native scroll, CSS sticky, 220 ms transitions. Frosted glass panels (white 60%, blur 15/30/60 px), stacking Highlights cards by CSS sticky only, dark photo band with sticky glass caption, packshot to wrist-shot hover swap, Helvetica Neue (paid) + JetBrains Mono. Note: the filmstrip/ticker/parallax tokens exist in CSS but belong to product pages, not this page. |
| Bread & Boxers (08 Everyday Kit) | **Not done** | Partial pack only (probe, code, phone-390 map). On desktop the page stays 900 px tall and will not scroll in the cloud browser (Cookiebot dialog with unrendered `[#...#]` text, hydration mismatch, body overflow hidden). See its README. Needs a real browser. |
| OFFFORM (03 The Roster) | **Blocked** | SiteGround robot challenge (`sg-captcha: challenge`). Not worked around. Only code-read values exist. See its `not-verified.md`. Needs the user's own browser. |
| Brunello Cucinelli AI (02 The Host) | **Blocked** | Akamai "Access Denied" (HTTP 403) even from curl. No pack. Only public write-ups exist (makemepulse case study, press): over 30 interface blocks, three intent "receptors", contextual prompt bar, frosted glass, sketches. Needs the user's own browser. |

Every teardown ends with a section "Why this reference matters for a leather-bag store" (5 bullets), and
`recipes.md` has code sketches with the real numbers plus free lookalike fonts for each paid font.

## Suggested next steps (ask the user first; do not start unprompted)

1. Ask which direction(s) to rebuild first. Suggest starting with one where the teardown is complete and the
   look is distinctive (hellohello OUTFIT is the richest; BASIC/DEPT and Spring/Summer next).
2. Rebuild that one site **from its teardown**: copy layout, type scale, colours and every measured
   duration, ease and stagger; then swap in Tuskrr content and one theme (The Entrance or Linear Wilderness,
   never merged). Do not use the reference's images, copy or fonts. Substitute free lookalike fonts from recipes.md.
3. Get the three missing references captured in the user's own browser (see scripts below), or agree to
   drop them.
4. Keep using licensed stock (Coverr, Mixkit, Burst) labelled as stand-ins. Run `brand-world/src/proof.mjs`
   with `PROOF_ANY_EASE=1` on anything built.

## Rules that still hold

- Do not merge The Entrance and Linear Wilderness. Use they/them. No em or en dashes in copy.
- Never claim things Tuskrr has not confirmed (no "hand pressed", "no small print", discounts, awards).
  Confirmed: genuine leather, 3-year warranty, cash on delivery, initials on custom order ready in 2 weeks,
  price band Rs 5,000 to 7,000. Prices, laptop sizes, returns policy and the people on The Roster are samples.
- Label every image "Supplied render", "Stock stand-in" or "Drawn stand-in". Bags are the supplied renders;
  never show a stock bag as Tuskrr's.
- Reference sites are studied for structure and motion only. No images, fonts, copy or code reused.

## Environment notes for a fresh container (things that cost time this session)

- **Restarts wipe installed packages.** Reinstall: `pip install playwright==1.56.0 pillow numpy scipy imageio-ffmpeg`
  (1.56.0 matches the preinstalled Chromium 1194; 1.56.1 does not exist on pip). Node Playwright is global at
  `/opt/node22/lib/node_modules/playwright` (use `createRequire`).
- **Chromium does not trust the session proxy's certificate by default** (its NSS store at `/root/.pki/nssdb`
  is empty), so every HTTPS page fails with `ERR_CERT_AUTHORITY_INVALID`. Bypass flags such as
  `--ignore-certificate-errors-spki-list` are blocked by the permission system and must not be used. What
  the user approved this session ("1") was adding the proxy's own CA to the NSS store:
  `apt-get update && apt-get install -y libnss3-tools`, then
  `certutil -d sql:/root/.pki/nssdb -A -t "C,," -n ccr-agent-proxy -i /root/.ccr/agent-proxy-ca.crt`.
  **Ask the user again in a new session before repeating it.** The CA file is regenerated on each container start.
- **Never `pkill -f` or `pgrep -f` with a pattern that appears in your own command** (it matches and kills the
  shell, exit 144). Find the PID with `ps -eo pid,args | grep ... | grep -v grep | grep -v "bash -c"`.
- Full-page screenshots in headless Chromium drop embedded images; use viewport shots to review pages.
- A capture stage that waits for the page to scroll can hang forever on a page that never scrolls; the
  wheel loop in `xray.py` is now bounded.
- Cookie banners: `xray.py` clicks the most restrictive option (Deny, necessary only), opening Cookiebot's
  "Customize" panel first because it hides Deny; it never accepts all.
- X-Ray runs take 5 to 15 minutes per site for these lighter pages (25 to 45 for 3D-heavy ones) and can run
  three at a time on 4 cores: `site-xray/run-parallel.sh 3`. Brunello and OFFFORM are excluded from it.

## Things I would flag to the next thread

- The teardowns were written by helper agents from the packs; they carry evidence labels (measured, source
  read, fitted, inferred) and a `not-verified.md` each. Spot-check numbers before relying on them for a build.
- hellohello's hover diffs came back empty for all targets, so its hover values are source read, not measured.
- BASIC/DEPT's real page height (about 10,308 px) is arithmetic because its videos would not paint.
- Stale `06-raw/failures.txt` in the springsummer pack lists the map failure that was later fixed by re-running.
