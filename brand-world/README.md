# Tuskrr brand world

The brand foundation and the brand world, **The Entrance**, built on the buyer,
the tagline **Arrive like you mean it.** and Linear Wilderness from round 1.
Open `START-HERE.html` first, then `the-entrance.html`.
Non-technical readers: see `HOW TO OPEN.txt`.

**Foundation:** early-career climbers aged 24 to 34 in metro India, plus gift
givers and corporate gifting. Triggers: "I've levelled up. My bag hasn't." and
"I see who you're becoming." Genuine leather, Rs 5,000 to 7,000, sold direct
online and as gifts.

**Confirmed:** genuine leather, 3-year warranty, cash on delivery, initials
embossed on custom order (ready in 2 weeks). No Diwali page.
**Sample values (replace before launch):** laptop sizes per bag
(`LAPTOP` in `src/worlds.mjs`) and the returns policy.

Earlier rounds are in git history: round 1 (three landscape-led worlds) at
commit `1d5ff74`, round 2 (three city-first options) at commit `2744842`.

## Rebuilding

```sh
node brand-world/src/extract-logos.mjs   # transparent logo PNGs from the supplied JPEGs
node brand-world/src/build.mjs           # writes the four HTML pages
node brand-world/src/proof.mjs           # contrast, overflow, tap targets, motion, copy rules
```

Needs Node 22 and Playwright with Chromium (extract and proof only).

- `src/shared.mjs`: assets, product facts, generated line art, motion layer
- `src/worlds.mjs`: the brand foundation and The Entrance's copy
- `src/sections.mjs`: section layouts for the brand-world page
- `src/the-entrance.mjs`, `src/start-here.mjs`: one page each
- `assets/`: cleaned logo PNGs, product renders, OFL web fonts

## Motion

Ease-in-out `cubic-bezier(0.42, 0, 0.58, 1)`, 1s entrances, 16px travel,
delays on a 0.125s grid capped at 0.75s, 0.25s controls, and a 1s page fade
underneath (skipped when the URL has a hash). Honours reduced motion;
`?motion=off` and `?motion=force` override it.

## Open decisions

See "Still open" and "What we need back" in `START-HERE.html`: badge wordmark,
the gold S on every badge, the price for custom initials, real laptop sizes and
returns policy, vector logo files, the photo shoot, a trademark search on the
tagline, and the reference websites for the site build.
