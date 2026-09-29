# Reference pack: BASIC/DEPT (basicagency.com)

Site X-Ray capture of https://www.basicagency.com/ taken 2026-09-29 in cloud Chromium at 1440 x 900, plus a 390 x 844 phone pass and fresh loads at 360, 390, 768, 820, 1024, 1280, 1440 and 1920 wide. This pack is a build reference for the Tuskrr team. Start with `01-teardown/teardown.md`.

## Folders

| Folder | What it holds |
|---|---|
| `01-teardown/` | `teardown.md` (the full spec: page map, colours, type, components, motion, responsive, weight, port order), `recipes.md` (how to rebuild the five signature effects with code sketches, plus a fonts section), `not-verified.md` (every gap and how to close it) |
| `02-data/` | Cleaned data files: `tokens.json` (CSS variables, type scale, colours, keyframes, media queries), `motion.json` (45 fitted effects), `scroll-map.json` (sections and pixel rhythm), `scene-3d.json` (empty: no 3D), `interactions-and-responsive.json` (hover diffs, routes, widths, accessibility, weight, assets) |
| `03-assets/` | The site's own images (18 Sanity CDN files), 5 SVG logo files, 4 mp4 videos, and the social preview image. Reference only. Fonts and the grain PNG are not here. |
| `04-code/` | Served code: `css/` (4 stylesheets), `js/` (Next.js chunks and third-party scripts), `components/` (10 truncated module files), `html/` (server-rendered and rendered home page plus 9 other routes) |
| `05-screens/` | `desktop-1440/` (32 shots, 300 px steps), `phone-390/` (14 shots), `sheets/` (contact sheets of 16 shots, start here), `states/` (first view, hovers, menu open, keyboard focus, reduced motion, route shots), `video/` (a recorded load, pointer and scroll clip) |
| `06-raw/` | Raw capture output: `probe`, `map_desktop-1440`, `map_phone-390`, `motion_gsap` (empty: no GSAP), `motion_sampled`, `pointer`, `states`, `responsive`, `a11y`, `weight`, `assets`, `bundle_index`, `three` (skipped: no canvas), `run.log` |

## Rights notes

- Fonts are NOT included. The site uses **Scto Grotesk A** (weights 300, 400, 700), self-hosted from its own domain. **Treat it as a paid, commercial font**; its licence terms are not in the pack. Do not use it on Tuskrr unless a licence is bought. `teardown.md` and `recipes.md` name two free lookalikes: Inter Tight (Google Fonts) and Switzer (Fontshare).
- The site's images, video, models, copy and code are reference only and must not be reused. That covers everything in `03-assets/` and `04-code/`, the logo artwork (the BASIC/DEPT wordmark and B/D mark), the award logos and client logos, and all page text. Build with your own assets and your own wording.
- The tokens, timings and formulas in `01-teardown/` are observations of how the page works, for learning and for building an independent implementation. Rewrite the code in your own style rather than pasting it.
- Third-party names in the pack (Google, KFC, Wilson, Patagonia, AT&T, Ad Age, Webby Awards, Campaign, Adweek) are trademarks of their owners and appear only because they appear on the captured site.
- Keep this repository private.
