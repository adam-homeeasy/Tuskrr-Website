# Traces the supplied logo JPEGs into SVG: the wordmark with one <path> per
# letter (so the S can take the brass accent) and the tusker monogram.
# These are traces, not the designer's vector files. Swap in the originals when they arrive.
# pip install potracer pillow numpy
# Run from the repo root: python3 site/src/tools/trace-logo.py
import zipfile, io
import numpy as np, potrace
from PIL import Image, ImageFilter

def contours(im, up=4, pad=4):
    im = im.convert('L'); a = np.array(im); ys, xs = np.where(a < 128)
    im = im.crop((xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad))
    im = im.resize((im.width * up, im.height * up), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    path = potrace.Bitmap(np.array(im) >= 128).trace(turdsize=20, alphamax=1.0, opticurve=True, opttolerance=0.2)
    out = []
    for c in path:
        s = c.start_point; d = [f'M{s.x:.0f} {s.y:.0f}']; xs = [s.x]
        for seg in c.segments:
            if seg.is_corner: d.append(f'L{seg.c.x:.0f} {seg.c.y:.0f}L{seg.end_point.x:.0f} {seg.end_point.y:.0f}'); xs.append(seg.c.x)
            else: d.append(f'C{seg.c1.x:.0f} {seg.c1.y:.0f} {seg.c2.x:.0f} {seg.c2.y:.0f} {seg.end_point.x:.0f} {seg.end_point.y:.0f}')
            xs.append(seg.end_point.x)
        out.append((min(xs), max(xs), ''.join(d) + 'Z'))
    return im.size, out

(w, h), cs = contours(Image.open('WhatsApp Image 2026-09-28 at 2.04.37 PM.jpeg'))
cs.sort(key=lambda c: c[0])
letters = []
for c in cs:  # a contour inside the previous letter's span is its counter (the holes in R)
    if letters and c[1] <= letters[-1][1] + 2: letters[-1][2].append(c[2])
    else: letters.append([c[0], c[1], [c[2]]])
paths = ''.join(f'<path class="l l-{"tuskrr"[i]}{i}" d="{"".join(l[2])}"/>' for i, l in enumerate(letters))
open('site/assets/logo/wordmark.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="currentColor" fill-rule="evenodd">{paths}</svg>')

with zipfile.ZipFile('WhatsApp Unknown 2026-09-28 at 3.09.58 PM.zip') as z:
    (w, h), cs = contours(Image.open(io.BytesIO(z.read('WhatsApp Image 2026-09-28 at 2.04.43 PM (1).jpeg'))))
open('site/assets/logo/monogram.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" fill="currentColor" fill-rule="evenodd"><path d="{"".join(c[2] for c in cs)}"/></svg>')
print('traced', len(letters), 'letters')
