#!/usr/bin/env python3
"""Adds the app-only scripts (app/native/*.js) to the iOS build of FLIX Bomb, after kaynak/build.py wrote www/index.html.
ads-config.js + ads.js: AdMob (window.FlixAds), native-bridge.js: App Store purchases (window.FlixNative),
flix-privacy.js: "Gizlilik Seçenekleri" next to the legal button, flix-net.js: online rooms without claude.ai (window.claude.use shim).
The web build (GitHub Pages / claude.ai) never loads them. Usage: python3 tools/app_scripts.py [www dir]"""
import pathlib, shutil, sys
app = pathlib.Path(__file__).resolve().parent.parent
www = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else app / 'www'
ORDER = ['ads-config.js', 'ads.js', 'native-bridge.js', 'flix-privacy.js', 'flix-net.js']
for f in ORDER: shutil.copy(app / 'native' / f, www / f)
page = www / 'index.html'
s = page.read_text(encoding='utf-8')
if 'src="ads-config.js"' not in s:
    tags = ''.join('<script src="%s"></script>' % f for f in ORDER)
    i = s.find('<script')
    assert i > 0, 'no <script> in www/index.html'
    s = s[:i] + tags + s[i:]
    page.write_text(s, encoding='utf-8')
print('app scripts added:', ', '.join(ORDER))
