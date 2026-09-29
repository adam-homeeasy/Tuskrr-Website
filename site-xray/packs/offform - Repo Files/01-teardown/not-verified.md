# offform.net: not captured

Captured on 2026-09-29. The site sits behind a SiteGround robot challenge (response header `sg-captcha: challenge`, page title "Robot Challenge Screen"). The headless browser only ever received the challenge page, so nothing about the real site was captured. Page height read 900 px, no tweens, no canvases.

I did not work around the challenge.

What would check it: run `site-xray/run-all.sh` (or the one-site command in site-xray/scripts/xray.py) from a normal browser session on your own machine, where the challenge does not fire. What is already known from the shipped HTML/CSS of the public page (read earlier with curl, see brand-world/references/offform/source.json): WordPress, jQuery, Lenis, 15 canvas elements, hero reveal `clip-path inset(0 0 100% 0)` to `inset(0)` over 0.65s on cubic-bezier(0.76,0,0.24,1), UI motion 0.35s on cubic-bezier(0.22,1,0.36,1), stagger steps of 0.04s, ground #0b0b0b, accent #ff4fd8, 9 and 10 px uppercase monospace type. Those values are source read only and unverified in a live browser.
