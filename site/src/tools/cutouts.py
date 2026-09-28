# Cuts the six bags out of their studio backgrounds into site/assets/img/*.webp.
# pip install "rembg[cpu]" pillow   (downloads the isnet-general-use model on first run)
# Run from the repo root: python3 site/src/tools/cutouts.py
import zipfile, io
from rembg import remove, new_session
from PIL import Image

ZIP = 'WhatsApp Unknown 2026-09-28 at 3.09.58 PM.zip'
SRC = {'crest': '44 PM (1)', 'ridge': '44 PM', 'strata': '45 PM (1)', 'traverse': '45 PM', 'contour': '46 PM (1)', 'axis': '46 PM'}
session = new_session('isnet-general-use')
with zipfile.ZipFile(ZIP) as z:
    for name, stamp in SRC.items():
        im = Image.open(io.BytesIO(z.read(f'WhatsApp Image 2026-09-28 at 2.04.{stamp}.jpeg'))).convert('RGB')
        out = remove(im, session=session)
        out = out.crop(out.getbbox())
        out.save(f'site/assets/img/{name}.webp', 'WEBP', quality=86, method=6)
        print(name, out.size)
