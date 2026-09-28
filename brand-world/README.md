# Tuskrr brand world (v2)

The brand foundation and three brand-world options, built on the buyer and the
tagline **Arrive like you mean it.** Open `START-HERE.html` first.
Non-technical readers: see `HOW TO OPEN.txt`.

| File | Option | Idea |
|---|---|---|
| `option-a-the-entrance.html` | A. The Entrance | Every day has an entrance. Tuskrr is built for it. |
| `option-b-monday-to-monday.html` | B. Monday to Monday | The climb is your week. Tuskrr is there for all of it. |
| `option-c-sharp-lines.html` | C. Sharp Lines, Wild Heart | Structure on the outside. Your own edge on the inside. |

**Foundation (shared by all three):** early-career climbers aged 24 to 34 in
metro India, plus gift givers and corporate gifting. Triggers: "I've levelled
up. My bag hasn't." and "I see who you're becoming." Genuine leather, Rs 5,000
to 7,000, sold direct online and as gifts. Initials embossing on custom order.
Every option is designed for the phone first and includes a gifting route and
proof points (laptop fit, warranty, returns, cash on delivery are still to
confirm). The foundation lives in `src/worlds.mjs`.

Version 1 (three landscape-led worlds) is in git history, commit `1d5ff74`
and earlier.

## Rebuilding

```sh
node brand-world/src/extract-logos.mjs   # transparent logo PNGs from the supplied JPEGs
node brand-world/src/build.mjs           # writes the four HTML pages
node brand-world/src/proof.mjs           # contrast, overflow, tap targets, motion, copy rules
```

Needs Node 22 and Playwright with Chromium (extract and proof only).

- `src/shared.mjs`: assets, product facts, generated line art, motion layer
- `src/worlds.mjs`: the brand foundation and the copy for each world
- `src/sections.mjs`: section layouts shared by the three options
- `src/option-a.mjs`, `option-b.mjs`, `option-c.mjs`, `start-here.mjs`: one page each
- `assets/`: cleaned logo PNGs, product renders, OFL web fonts

## Motion

Ease-in-out `cubic-bezier(0.42, 0, 0.58, 1)`, 1s entrances, 16px travel,
delays on a 0.125s grid capped at 0.75s, 0.25s controls, and a 1s page fade
underneath (skipped when the URL has a hash). Honours reduced motion;
`?motion=off` and `?motion=force` override it.

## Open decisions

See "Still open" and "What we need back" in `START-HERE.html`: badge wordmark,
the gold S, laptop sizes, warranty, returns, cash on delivery, initials lead
time and price, the Diwali cut-off, vector logo files, a city photo shoot and a
trademark search on the tagline.
