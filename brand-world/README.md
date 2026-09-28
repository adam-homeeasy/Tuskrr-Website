# Tuskrr brand world options

Three brand-world directions to choose from before the website is designed.
Open `START-HERE.html` first. Non-technical readers: see `HOW TO OPEN.txt`.

| File | Option | Idea |
|---|---|---|
| `option-a-field-survey.html` | A. Field Survey | Linear Wilderness, read as a map |
| `option-b-quiet-architecture.html` | B. Quiet Architecture | Linear Wilderness, built as architecture |
| `option-c-high-ground.html` | C. High Ground | Linear Wilderness, walked as a journey |

All three share the name, logo, the six products (RIDGE, TRAVERSE, STRATA,
CREST, AXIS, CONTOUR) and Tuskrr's own product stories and campaign lines from
`Tuskrr Product Names copy.pdf`. They differ in idea, palette, type, graphic
language, photography direction, voice and website structure. Each page is one
self-contained file (fonts and images inlined), so it can be forwarded alone.

## Rebuilding

```sh
node brand-world/src/extract-logos.mjs   # transparent logo PNGs from the supplied JPEGs
node brand-world/src/build.mjs           # writes the four HTML pages
node brand-world/src/proof.mjs           # contrast, overflow, tap targets, motion, copy rules
```

Needs Node 22 and Playwright with Chromium (extract and proof only).

- `src/shared.mjs`: assets, product facts, generated line art, motion layer
- `src/worlds.mjs`: the copy for each world
- `src/option-a.mjs`, `option-b.mjs`, `option-c.mjs`, `start-here.mjs`: one page each
- `assets/`: cleaned logo PNGs, product renders, OFL web fonts

## Motion

Ease-in-out `cubic-bezier(0.42, 0, 0.58, 1)`, 1s entrances, 16px travel,
delays on a 0.125s grid capped at 0.75s, 0.25s controls, and a 1s page fade
underneath (skipped when the URL has a hash). Honours reduced motion;
`?motion=off` and `?motion=force` override it.

## Open decisions

See "What we found in the files" and "What we need back" in `START-HERE.html`:
badge wordmark consistency, the gold S, the two campaign lines for TRAVERSE and
CREST, vector logo files, licensed photography, and gender positioning of AXIS.
