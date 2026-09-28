"""Cuts the six supplied renders out of their light studio backgrounds so the
bags can stand on any direction's ground. Background = light, low-saturation
pixels connected to the image border. Writes brand-world/sites/media/cut-<id>.webp.

Run: python3 brand-world/sites/src/cutout.py
"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '..', 'assets', 'img')
OUT = os.path.join(HERE, '..', 'media')

for pid in ['ridge', 'traverse', 'strata', 'crest', 'axis', 'contour']:
    im = Image.open(os.path.join(SRC, pid + '.jpg')).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    lum = a.mean(axis=2)
    sat = a.max(axis=2) - a.min(axis=2)
    cand = (lum > 150) & (sat < 28)
    lab, n = ndimage.label(cand)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    fg = ~bg
    # keep the largest foreground body plus anything big, fill holes inside the bag
    lab2, n2 = ndimage.label(fg)
    if n2:
        sizes = ndimage.sum(fg, lab2, range(1, n2 + 1))
        keep = np.isin(lab2, [i + 1 for i, s in enumerate(sizes) if s > 0.002 * fg.size])
        fg = ndimage.binary_fill_holes(keep)
    # enclosed background (inside handle loops): big light, low-saturation areas
    inner = [i for i in range(1, n + 1) if i not in border]
    if inner:
        sz = ndimage.sum(cand, lab, inner)
        holes = np.isin(lab, [i for i, s in zip(inner, sz) if s > 0.0015 * cand.size])
        fg &= ~holes
    fg = ndimage.binary_opening(fg, iterations=1)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = im.copy()
    rgba.putalpha(alpha)
    rgba = rgba.crop(rgba.getbbox())
    rgba.save(os.path.join(OUT, f'cut-{pid}.webp'), 'WEBP', quality=86, method=6)
    print(pid, rgba.size, f"{os.path.getsize(os.path.join(OUT, f'cut-{pid}.webp')) / 1e3:.0f} KB")
