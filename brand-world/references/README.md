# Reference library

Eight reference sites for the Tuskrr website, read on 28 Sep 2026.

| Slug | Site | Direction |
|---|---|---|
| basic-agency | https://www.basicagency.com/ | 01 The Reel (The Entrance) |
| brunello-cucinelli-ai | https://shop.brunellocucinelli.com/en-gb/ai | 02 The Host (The Entrance). Not measured: HTTP 403 |
| offform | https://offform.net/ | 03 The Roster (The Entrance) |
| stroms-man | https://stroms.com/pages/man | 04 The Outfitter (The Entrance) |
| springsummer | https://springsummer.dk/ | 05 Six Readings (Linear Wilderness) |
| hellohello-outfit | https://outfit.hellohello.is/ | 06 The Small Store (Linear Wilderness) |
| unimatic-impronte | https://www.unimaticwatches.com/pages/impronte-collection | 07 Pressed In (Linear Wilderness) |
| bread-and-boxers | https://breadandboxers.com/se | 08 Everyday Kit (Linear Wilderness) |

- `DNA.md`: the numbers, with evidence and what is not proven.
- `<slug>/source.json`: raw counts from the shipped HTML and CSS.
- `read-source.py`: re-reads the sites (curl, no browser). `python3 brand-world/references/read-source.py`
- `measure.mjs`: the live-browser pass (computed styles, mid-entrance samples,
  screenshots at 1440 and 390). It could not run in the cloud session because
  Chromium did not trust the session's network certificate. Run it on a normal
  machine: `node brand-world/references/measure.mjs`.
