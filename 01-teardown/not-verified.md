# Not verified

What this run couldn't confirm, why, and what it would take.

- **Real frame rate and paint cost.** The cloud browser draws 3D in software with 2 CPUs, and got about 36 to 40 fps on the hero. **To check:** re-run the performance step in a browser with a real graphics card (your Chrome or the built-in browser).
- **Resizing a live page across 767 px.** In the cloud browser, the page went blank when resized from phone width to desktop width without reloading (the height dropped to 900 px and there were no canvases). This could be a real bug, or it could be WebGL contexts being lost under software rendering. **To check:** resize a real desktop Chrome window across 768 px.
- **The magnetic nav offset and the cursor ring's live size.** The source gives exact values (0.3 strength, 0.4 s, `power2.out`, and a ring that grows 36 → 56 px). The automated hover read back `none` and opacity 0, most likely because I checked the wrong wrapper element. The video shows the dot cursor working. **Status:** source read, not measured.
- **Labelled cursor states.** The code supports a "Drag" label, but no element on the live page uses `data-cursor-label`. It may be dead code, or used somewhere I didn't reach.
- **Compressed transfer sizes.** The page-weight numbers are uncompressed sizes. Real transfer is smaller for JS, CSS and the HDRI.
- **The preloader on a real connection.** The cloud run took 7.5 to 12 s, which isn't representative.
- **Phone gestures.** Drag-to-spin on the hero can, the side-swipe carousels and the accordion were read from source and seen in phone-width screenshots. They weren't tested with real touch gestures.
- **The newsletter and notify endpoints** (`/api/notify`). I didn't submit them, to avoid sending fake sign-ups to a real business.
- **Checkout.** It's a "coming fall 2026" notice with no real payment flow, so there was nothing past that to capture.
