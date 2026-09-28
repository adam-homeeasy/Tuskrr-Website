#!/usr/bin/env python3
"""Same as nodecks-deck/scripts/render_pdf.py (A4 landscape, backgrounds, page
numbers, print media), with one sandbox-only aid: the Google Fonts link is
swapped for the same Archivo font inlined from assets/fonts before printing,
because the sandbox browser cannot reach Google Fonts reliably. The deck HTML
file on disk is unchanged and keeps its Google Fonts link."""
import base64, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

html, pdf, title = sys.argv[1], sys.argv[2], sys.argv[3]
font = base64.b64encode((Path(__file__).parent.parent / 'assets/fonts/archivo-var.woff2').read_bytes()).decode()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
    page = b.new_context().new_page()
    import re
    src = Path(html).read_text()
    src = re.sub(r'<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>', '', src)
    src = src.replace('<style>', '<style>@font-face{font-family:"Archivo";src:url(data:font/woff2;base64,' + font + ') format("woff2");font-weight:100 900;font-display:block}', 1)
    page.set_content(src, wait_until='load')
    page.evaluate("Promise.all(['400','600','700','800'].map(w => document.fonts.load(w + ' 20px Archivo')))")
    page.emulate_media(media='print')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(500)
    footer = ('<div style="font-size:8px; width:100%; text-align:center; color:#94a3b8; font-family:Archivo,system-ui,sans-serif; padding:0 18mm;">'
              f'{title} &middot; Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>')
    page.pdf(path=pdf, format='A4', landscape=True, print_background=True, display_header_footer=True,
             header_template='<div></div>', footer_template=footer, margin={'top': '10mm', 'bottom': '12mm', 'left': '0mm', 'right': '0mm'})
    b.close()
print('Wrote', pdf, round(Path(pdf).stat().st_size / 1024), 'KB')
