# OUTFIT by ++hellohello: reference pack

Reference pack for https://outfit.hellohello.is/ (the ++hellohello merch store). Captured 2026-09-29 in cloud Chromium at 1440 x 900, plus fresh loads at 8 widths (360, 390, 768, 820, 1024, 1280, 1440, 1920). Built so another team can rebuild the layout, type, colour and motion. Start with `01-teardown/teardown.md`.

## Folders

| Folder | What it holds |
|---|---|
| `01-teardown/` | The written analysis. `teardown.md` (12 sections plus the Tuskrr note), `recipes.md` (how to rebuild each signature effect, and font lookalikes), `not-verified.md` (every gap and the cloud limits) |
| `02-data/` | Structured results: `tokens.json` (CSS variables, colours, type scale, keyframes, media queries), `motion.json` (27 GSAP effects), `scroll-map.json` (sections, pixel rhythm, ScrollTrigger list), `scene-3d.json` (empty: no 3D), `interactions-and-responsive.json` (pointer, states, responsive, a11y, weight, assets) |
| `03-assets/` | Files pulled from the live site: `images/preloader/` (6 photos), `images/1455/0837/files/` (26 product photos from the Shopify CDN), `brand/` (favicon, icon, Open Graph image). Fonts are not here |
| `04-code/` | Shipped code for reading: `js/` (21 built chunks), `components/` (30 extracted module files such as `Preloader.js`, `Cursor.js`, `Item.js`), `html/` (rendered home page and the server HTML of every visited route). Minified, with some long strings cut to `<long string>` |
| `05-screens/` | Screenshots: `desktop-1440/` (12 scroll stops), `phone-390/` (7 stops), `sheets/` (contact sheets), `states/` (first view, keyboard focus, reduced motion, and one shot per route), `video/` (one pointer and scroll recording) |
| `06-raw/` | Raw capture output: `probe`, `map_desktop-1440`, `map_phone-390`, `motion_gsap` (all 347 tweens and 35 timelines), `motion_sampled`, `pointer`, `states`, `responsive`, `a11y`, `weight`, `assets`, `bundle_index`, `three`, and `run.log` |

## Rights notes

- **Fonts are NOT included.** The site uses **Neue Haas Grotesk Text Pro** (Monotype / Linotype), three files: regular, Medium and Bold. **This is a paid font.** You need your own commercial web licence to use it. `recipes.md` names free lookalikes (Inter Tight from Google Fonts, Switzer from Fontshare).
- The site's **images, video, models, copy and code are reference only and must not be reused.** This covers the product photos, the six preloader photos, the OUTFIT wordmark paths, the ++hellohello logo, the Open Graph image, the shipped JavaScript and CSS, and all text. Use them to study layout and motion, then rebuild with your own assets and your own code.
- The libraries the site uses (GSAP, Lenis, Next.js, React, Motion, NumberFlow, Sonner, Tailwind) have their own licences. Check each one before using it in a product.
- **Keep this repo private.** It holds another company's assets and code.
- Product names, prices and brand names belong to their owners. Nothing in this pack is affiliated with them.
