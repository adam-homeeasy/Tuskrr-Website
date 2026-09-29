# Not verified: BASIC/DEPT (basicagency.com)

Captured 2026-09-29 in cloud Chromium. Each row says what could not be checked, why, and what would check it.

## Cloud limits that apply to every number

| Limit | Effect on this pack |
|---|---|
| WebGL is software-rendered, so frame rates read low | This site has no WebGL, but the 61 fps reading at the top of the page (`weight.json`) is a software-rendering figure and says nothing about a phone or laptop GPU |
| Transfer sizes are uncompressed | `weight.json` sizes (48236 KB total) are uncompressed; real downloads are smaller for text files. The probe's per-file sizes look compressed (for example `framework` 60 KB there versus 185 KB in `weight.json`), and which one is a true transfer size was not settled |
| Loader timings are slower than a real connection | First paint 776 ms and load 993 ms were recorded on the cloud link; a real visitor on a fast connection will see the sequence start sooner |
| Fitted timings are good to about one frame and read 10 to 15 percent long | Applies to every `fitted` value (the 45 entries in `motion.json`). Where the CSS gives a number, the CSS number is used instead |

## Video and layout

| Gap | Why it could not be checked | What would check it |
|---|---|---|
| None of the four mp4 files painted (hero loop, full reel, Google Store loop, spotlight video). The hero, the Google Store card and the spotlight video column are blank in every screenshot | All four are H.264 (`avc1`, read from the file headers); the cloud Chromium build does not decode it. Blank areas therefore have no picture, and the header's white text sits on the light page colour | Open the site in desktop Chrome with codecs and capture again, or play the four files in `03-assets/video` |
| Real spotlight height and real page height | The site sizes the video placeholder from the loaded video's width and height, and the video never loaded, so the placeholder had zero height. From the file (866 x 1214) and the column width (630 px) the spotlight would be about 883 px tall and the page about 10308 px. Inferred by arithmetic, not observed | Recapture with a browser that plays H.264; compare `scroll-map.json` |
| Header legibility over the hero | White header text over the video could not be checked. Over the plain page colour the ratio is 1.1 (`a11y.json`) | Capture with the video playing and measure the pixels behind the header |
| What the hero, reel and spotlight videos show, and the reel's audio | Pictures did not render, no audio captured | Watch the files in `03-assets/video` |
| Real page height after cookie consent | The 60 px cookie bar adds 60 px of footer padding; accepting removes it (9933 expected). Not tested | Click "Accept cookies", re-measure |
| Section `top` values in `scroll-map.json` (all read 900 for sections after the hero) | Recorded while sections were mid-transform, so unusable. Section positions in the teardown come from rect top plus eased translate in `motion_sampled.json` and from the capped translate values in `motion.json`; the clients and spotlight starts are within 1 px of a rounded value (2818 and 3855, versus 2819 and 3856 from the margin arithmetic) | Read `getBoundingClientRect` plus `scrollY` with smooth scroll disabled |
| Phone section start offsets | Only heights were read for 390 (1098, 411, 474, 600, 297, 5078, 1152) | Repeat the offset method on a 390 capture |

## Motion

| Gap | Why | What would check it |
|---|---|---|
| Real wheel and trackpad feel of the smooth scroll | The fitted captures came from scripted jumps (`scrollTo`), not wheel input. Real input produces many small scroll events that each restart the 60-frame tween | Record real wheel input on a real device and compare with the model |
| Behaviour on 120 Hz and 144 Hz screens | The tween counts frames, not milliseconds, so it should run faster on fast screens (inferred from the code only) | Test on a high refresh display |
| Exact scrollY at which the page turns dark and returns to bright | Worked out from the code and measured section offsets (about 3405 and about 4154 at 1440), not seen at the flip. Pixel samples are 300 px apart and none lands on the transition. The window would end later with the real, taller spotlight | Capture frames every 50 px between 3300 and 4600 with the videos playing |
| Colour flip on phones | The phone pixel stops (700 px apart) did not land in the spotlight's dark window, so the flip on a touch device is source read only. The touch path keeps the frame loop running but turns transform rendering off | Capture a real touch device between the clients and news sections |
| Series in `motion.json` marked `inferred` (`fx010`, `fx018` to `fx020`, `fx033`, `fx035` to `fx037`, `fx039` to `fx042`) | Not settled or too short to fit | Longer sampling per stop |
| On-load fitted curves differ in shape from the CSS easings (for example hero 1336 ms fitted versus 1000 ms in the CSS) | The sampler started mid-delay, so delay and duration blur together | Sample from navigation start with a fixed frame clock |
| Cursor disc behaviour | Only one pointer position was captured (x 1000, y 300). The lerp values are source read, not fitted from frames | Record a pointer sweep and fit the trail |
| Drag row response | Source read only; the row was not dragged in the capture | Script a pointer drag and sample `scrollLeft` per frame |
| Reel player (click to play, seeker drag, pause) | The click was not exercised, and the video would not decode anyway | Click the hero in a codec-capable browser |
| Wipe and scale keyframes (`wipe-in`, `wipe-out`, `scale-in`, `scale-out`, `translate-up-0`, `translate-up-25`) | Defined in the CSS but not shown to be used on the home page. They appear to belong to other pages | Trace their selectors on the inner pages |
| Grain look and the grain PNG | `noise.e8298e81.png` was referenced by the CSS (23 KB in the probe list) but was not saved to `03-assets`. The 20-per-second repositioning rate is inferred from how `steps(2)` works inside each keyframe gap | Download the PNG; record 2 seconds of frames of a flat area |
| Hover diffs for most controls are empty in `pointer.json` | The hover capture only recorded computed-style changes it caught, and it caught two: the menu dots and the cookie button colour. Hover looks for pill buttons, cards, awards, news rows, nav links and footer links are source read from the CSS, not measured | Hover each control and capture 10 frames |
| Third open state (`open_03_.png`) | The harness clicked something unlabelled and captured a frame with a dark panel on the left 760 px and the page colour on the right. It is unclear which control that was and whether it was opening or closing. Two other click attempts timed out (`states.json`) | Re-run with labelled selectors |
| Menu overlay open sequence | Only one full-open screenshot and one mid frame | Sample frames every 50 ms from click |
| Page transitions between routes | Read from the code (no exit animation; easing off for 250 ms). Not recorded as a video | Record a client-side navigation |

## Responsive and accessibility

| Gap | Why | What would check it |
|---|---|---|
| Breakpoint effects at 480, 720, 1024, 1280 | `responsive.json` `breakpointsFound` is empty and `h1`, `visibleNavLinks` and `hamburger` never change (the site has no h1 and always keeps its links in the DOM). Breakpoints are from the CSS. No screenshots exist at 768, 820, 1024 or 1280 | Screenshot the home page at each real breakpoint |
| `customCursor: false` at every width in `responsive.json` | Wrong for 1440, where cursors exist (`pointer.json`). That flag cannot be trusted | Fix the detector or read cursors from pointer runs at each width |
| Live resize versus fresh load differences | 1024 gives 8288 live versus 8156 fresh; 390 gives 9391 live versus 9335 fresh. Cause unknown (touch mode, image loading and re-measure timing are guesses) | Repeat with images and fonts fully loaded and wait for stability before reading |
| Keyboard tab order and focus visibility | The harness reached only the accessiBe widget (`focus.el` = `access-widget-ui`). The full tab path, focus behaviour of the hero hit area and close buttons were not walked | Tab through the page and screenshot each stop |
| Screen reader behaviour | Not run. The header menubar roles and the accessiBe overlay could change what is announced | Test with NVDA or VoiceOver |
| Accessibility results are mixed with a third-party overlay | accessiBe injects extra elements and a screen-reader link (`skipLink: false` counts only the site's own) | Re-run with the overlay blocked |
| Contrast of text over video and photographs | Only flat colour pairs were measured | Sample pixels behind text once videos play |
| Reduced motion | Layout and tween counts matched the normal run and no rule exists, but the screenshot was taken at the top only | Capture the load sequence with `prefers-reduced-motion: reduce` on |

## Code, licences and rights

| Gap | Why | What would check it |
|---|---|---|
| Scto Grotesk A foundry and licence terms | Not stated in the CSS or the files. Font files were not downloaded (by design) | Check the font file's name table or ask the site owner |
| Package versions for styled-jsx and the Sanity packages | Not exposed in the bundles; only React 19.2.5, Next 16.2.4 and Sanity API version `v2023-03-01` were found | Read `package.json` if the source is available |
| The components folder holds 10 truncated module files (about 20 KB each) | The bundle saver kept the first 20000 characters. The full modules were read from `_app`, `142`, `651` and `851` chunks instead | Re-run the saver with no size limit |
| Inner pages (`/about`, `/services`, `/blog`, `/thinking`, `/careers`, `/contact`, case studies) | Only status, title, height and saved HTML exist; no motion or component capture. The awards lightbox, team overlay, sound players, contact form and filters are source read only | Run the full X-Ray on each route |
| Form behaviour | No forms were submitted (rule). The newsletter POST to `/api/subscribe` and the SoundCloud call to `/api/soundcloud` were not tested | Test with a throwaway address in a sandbox |
| Hotjar and LinkedIn behaviour | Blocked by the site's Content Security Policy in the capture (console errors) | Capture from a browser profile without the block |
| Broken link on the site | `/thinking/categories/brandbeats` returns 404 and the menu's Brandbeats card links to it (`states.json`, `probe.json` links). The footer links to `/thinking/category/brandbeats` (singular), which was not requested | Re-check both URLs live |
| Prefetch weight | 38 fetch files (10494 KB) come from route prefetch when links come within 200 px of the viewport, and the 24 MB reel was downloaded although its element only sets `preload = metadata`. It is unclear how much of this a normal visit loads | Measure a human-like visit with network throttling |
