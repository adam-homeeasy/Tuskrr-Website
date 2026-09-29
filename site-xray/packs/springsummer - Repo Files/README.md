# Spring/Summer (springsummer.dk) reference pack

Site X-Ray capture of https://springsummer.dk/ taken 2026-09-29 in cloud Chromium at 1440 x 900, plus fresh loads at 8 widths (360, 390, 768, 820, 1024, 1280, 1440, 1920). Start with `01-teardown/teardown.md`.

## Folders

| Folder | What it holds |
|---|---|
| `01-teardown/` | The written spec. `teardown.md` (layout, type, colour, motion, all evidence-labelled), `recipes.md` (how to rebuild each signature effect with real numbers, plus font lookalikes), `not-verified.md` (every gap and how to close it) |
| `02-data/` | Summary JSON from the capture: `motion.json` (GSAP tweens and sampled effects), `interactions-and-responsive.json`, `scene-3d.json`, `tokens.json` (CSS variables, colours, desktop and phone type rows) and `scroll-map.json` (page height 4997 at 1440, section boxes, pixel colour rhythm) |
| `03-assets/` | Images, brand files and SVGs downloaded from the site: case photos, Mux poster thumbnails, `Meta.jpg`, `favicon.svg`. The `svg/icons` folder is empty (404s). No fonts, no video files |
| `04-code/` | Shipped code for reading: `css/` (8 Nuxt stylesheets), `js/` (19 scripts, minified), `html/` (server-rendered and rendered home page, 6 category pages, 4 landing pages) |
| `05-screens/` | Screenshots and video: `states/` (first view, keyboard focus, reduced motion, 10 routes, 404), `sheets/states.png` (contact sheet), `video/load_pointer_scroll.webm` (25 s, 960 x 600), `desktop-1440/` (15 scroll stops), `phone-390/` (23 scroll stops) and contact sheets in `sheets/`. All home shots have the cookie dialog over them, and the phone shots show no content below the hero |
| `06-raw/` | Raw capture JSON: `probe`, `motion_gsap`, `motion_sampled`, `pointer`, `states`, `responsive`, `a11y`, `weight`, `assets`, `bundle_index`, `three`, `map_desktop-1440`, `map_phone-390` (re-run after a script fix; the original failure is still recorded in `failures.txt`), plus `run.log` |

## Rights notes

- **Fonts are NOT included.** The site uses PP Right Grotesk Compact Black, PP Neue Montreal Regular and PP Supply Mono Light (all Pangram Pangram, **paid** for commercial use) and Noto Sans TC (free). `recipes.md` names free lookalikes on Google Fonts and Fontshare.
- The site's images, video, models, logos, copy and code are **reference only**. Do not reuse them in a live build. Replace every asset and rewrite all copy.
- Client logos and case-study material belong to Spring/Summer and its clients.
- Keep this repository **private**.
