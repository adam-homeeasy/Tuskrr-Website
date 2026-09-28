# drinkstill.nz reference pack

A full teardown of https://www.drinkstill.nz, captured on 28 Sep 2026. Use it as the reference for building the new site.

## What's in each folder

| Folder | What's in it | How to use it |
|---|---|---|
| `01-teardown` | `teardown.md` (the full breakdown), `recipes.md` (how to rebuild each effect), `not-verified.md` | Start here |
| `02-data` | `tokens.json` (colours, type, spacing), `motion.json` (every animation), `scroll-map.json` (every scroll trigger and pin), `scene-3d.json` (the 3D setup), `interactions-and-responsive.json` | Exact numbers for the build |
| `03-assets` | Can images, story photos, the `can.glb` 3D model, label textures, the studio HDRI, and brand files (OG image, icons) | Look and proportion reference |
| `04-code` | The site's CSS, its JS bundles, one file per component (`components/`), and HTML as served and as rendered | Check any detail against the real code |
| `05-screens` | 60 desktop screenshots down the page, 10 phone screenshots, state screens (cart, modal, 404, hovers, phone menu), contact sheets, and the hero video | Visual reference |
| `06-raw` | The raw capture data behind the teardown | Only needed to re-check a number |

## Rights: read before building

- **STILL's images, story photos, can model and label art** are here for reference only. The new site needs its own product images, photos and model.
- **Fonts aren't included.** Söhne, Söhne Breit and Tiempos are paid Klim fonts. `recipes.md` lists free lookalikes.
- **The HDRI** (`studio_small_03_1k.hdr`) is Poly Haven's "Studio Small 03", which is free to use (CC0). It can go in the new build.
- **Keep this repo private.** It holds another company's assets and code.
