# Site X-Ray pack: UNIMATIC Impronte Collection

Source page: https://www.unimaticwatches.com/pages/impronte-collection
Captured 2026-09-29 in cloud Chromium at 1440x900, plus fresh loads at 8 widths (360, 390, 768, 820, 1024, 1280, 1440, 1920).

Short version: a Shopify page with a custom theme. No GSAP, no Lenis, no page transitions, no WebGL. The design is glass panels, CSS sticky and native scroll. Start with `01-teardown/teardown.md`.

## Folders

| Folder | What it holds |
|---|---|
| `01-teardown/` | `teardown.md` (the full spec in 12 sections plus a Tuskrr note), `recipes.md` (how to rebuild the top 5 effects, and free font lookalikes), `not-verified.md` (every gap and how to close it) |
| `02-data/` | Cleaned data: `tokens.json` (CSS variables, type scale, colours, keyframes, media queries), `scroll-map.json` (sections with pixel ranges and colour rhythm), `motion.json` (frame-sampled effects, only the accent dot), `interactions-and-responsive.json` (pointer, states, responsive, accessibility, weight, assets), `scene-3d.json` (empty: no 3D) |
| `03-assets/` | 29 saved images: `brand/` (favicon, share image) and `images/cdn/` (hero, product packshots and wrist shots, band and highlight photos, footer banner, logo). Fonts are not here |
| `04-code/` | `css/` (theme `base.css` and `styles.css`, plus wishlist, wallet and Klaviyo CSS), `js/` (45 scripts, theme components readable, vendor code minified), `html/` (rendered and server HTML for this page, plus /collections/new-in, /collections/classic, 4 product pages, search, cart, wishlist) |
| `05-screens/` | `desktop-1440/` (18 scroll shots), `phone-390/` (8 shots), `sheets/` (contact sheets and a states sheet), `states/` (hover, open menu, keyboard focus, reduced motion, and route screenshots), `video/` (one .webm of load, pointer and scroll) |
| `06-raw/` | Raw capture output: probe, section maps at 1440 and 390, GSAP probe (empty), sampled motion, pointer, states, responsive, accessibility, weight, assets, bundle index, Three probe (skipped), run log |

## Rights notes

- **Fonts are not included.** The page uses Helvetica Neue (400, 700) and JetBrains Mono (400, 700 declared). **Helvetica Neue is a paid commercial font**: do not copy the site's woff2 files, and get your own licence or use a free lookalike (see `01-teardown/recipes.md`). JetBrains Mono is free and open source (SIL OFL), but the files are still not in this pack. IBM Plex Mono is declared by the newsletter form only and is free.
- **Reference only.** The site's images, video, models, copy and code are owned by UNIMATIC Watches and their vendors (Shopify theme authors, Klaviyo and other apps). Everything in `03-assets/`, `04-code/` and `05-screens/` is for study. Do not reuse it in a product. Write your own copy, shoot your own photos, and rebuild the code from the recipes.
- **Keep this repo private.** It holds third-party assets and code that must not be published or redistributed.
- Values in the teardown are labelled measured, source read, fitted or inferred. Anything not in the pack is listed in `01-teardown/not-verified.md`.
