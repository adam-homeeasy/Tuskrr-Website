# Tuskrr: handover for the next session

The next job is to **work with reference websites the user will provide**. Read
this whole file before touching anything.

## Rules from the user (important)

- **Do not build until the user says go.** Last instruction (reference-sites session): "Don't build anything"; write directions, assets and requirements only.
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
