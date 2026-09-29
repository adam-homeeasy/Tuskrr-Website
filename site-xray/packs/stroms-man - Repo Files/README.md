# Ströms Man: reference pack

Reference pack for https://stroms.com/pages/man, captured on 2026-09-29 (cloud Chromium, 1440 x 900, plus fresh loads at 360, 390, 768, 820, 1024, 1280, 1440 and 1920 wide). It is a spec for building a similar page, not material to reuse.

Start with `01-teardown/teardown.md`, then `recipes.md`, then `not-verified.md`.

## Folders

| Folder | What it holds |
|---|---|
| 01-teardown | `teardown.md` (the full write-up), `recipes.md` (how to build each signature effect, plus fonts), `not-verified.md` (every gap and how to close it) |
| 02-data | Cleaned JSON: `tokens.json` (colours, type, CSS variables, media queries), `motion.json` (fitted fade-in), `scroll-map.json` (section ranges, pixel rhythm), `scene-3d.json` (empty: no 3D), `interactions-and-responsive.json` (hover, states, responsive, a11y, weight, assets in one file) |
| 03-assets | Images the page loaded (93 files, 89 JPG and 4 PNG, about 11 MB) and the favicon. No fonts. |
| 04-code | Served CSS (19 files), JS (33 files, including the theme's `global.min.js` and `libs.min.js`) and HTML (served and rendered home page, plus 10 other routes) |
| 05-screens | `desktop-1440` and `phone-390` scroll shots, `sheets` (contact sheets of 16 shots each), `states` (search open, keyboard focus, hover, reduced motion, other routes), `video` (load, pointer and scroll recording) |
| 06-raw | Raw capture output: probe, section maps for desktop and phone, GSAP probe (empty), sampled motion, pointer, states, responsive, a11y, weight, assets list, bundle index, three probe (empty), run log |

## Rights notes

- **Fonts are NOT included.** The site uses **Akzidenz-Grotesk Pro** in two weights, Regular (400) and Light (300). Both are **paid** fonts (Berthold). The two font files were deliberately left out of the capture. Buy a licence or use the free lookalikes named at the end of `01-teardown/recipes.md`.
- The site's **images, video, models, copy and code are reference only and must not be reused.** That includes the photographs in `03-assets`, product names and prices, the Ströms wordmark and lion logo, the theme JavaScript and CSS in `04-code`, and the served HTML. The numbers, layouts and patterns in the teardown are for building your own version with your own assets.
- Third-party libraries seen on the site (Swiper, instant.page, body-scroll-lock) keep their own licences. Install them from their official sources.
- **Keep this repository private.**
