const { chromium } = require('playwright'); const fs = require('fs'); const D = __dirname + '/..';
const b64 = (f, t) => 'data:' + t + ';base64,' + fs.readFileSync(__dirname + '/' + f).toString('base64');
const FONT = `@font-face{font-family:Rubik;font-weight:300 900;src:url(${b64('rubik-latin-ext.woff2', 'font/woff2')}) format('woff2');unicode-range:U+0100-02AF,U+1E00-1EFF}@font-face{font-family:Rubik;font-weight:300 900;src:url(${b64('rubik-latin.woff2', 'font/woff2')}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}`;
const LOGO = b64('logo.png', 'image/png');
const html = () => '<!doctype html><html><head><meta charset="utf-8"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>' + fs.readFileSync(D + '/flix-bomba.html', 'utf8');
const BOMB = (s) => `<svg viewBox="0 0 200 220" width="${s}" style="overflow:visible"><defs><radialGradient id="bg" cx=".34" cy=".3" r=".8"><stop offset="0" stop-color="#5b6fa8"/><stop offset=".35" stop-color="#1c2f66"/><stop offset="1" stop-color="#060c26"/></radialGradient><radialGradient id="sp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#ffe14a"/><stop offset=".7" stop-color="#ff7a12"/><stop offset="1" stop-color="#ff3b00" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="100" cy="212" rx="70" ry="10" fill="#001a40" opacity=".28"/>
<path d="M118 52 C124 28 150 22 158 6" fill="none" stroke="#3a2a14" stroke-width="13" stroke-linecap="round"/><path d="M118 52 C124 28 150 22 158 6" fill="none" stroke="#d9b36a" stroke-width="7" stroke-linecap="round" stroke-dasharray="6 7"/>
<rect x="92" y="38" width="50" height="30" rx="8" fill="#ffc21a" stroke="#06143a" stroke-width="7" transform="rotate(14 117 53)"/>
<circle cx="100" cy="128" r="82" fill="url(#bg)" stroke="#06143a" stroke-width="8"/>
<ellipse cx="66" cy="92" rx="26" ry="16" fill="#fff" opacity=".55" transform="rotate(-32 66 92)"/><circle cx="46" cy="120" r="6" fill="#fff" opacity=".45"/>
<circle cx="160" cy="4" r="44" fill="url(#sp)"/><path d="M160 -40 L168 -8 L200 4 L168 14 L160 46 L152 14 L120 4 L152 -8Z" fill="#fff8c8"/></svg>`;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  let PORT;
  if (!fs.existsSync(__dirname + '/ports.json')) {
    const p = await b.newPage({ viewport: { width: 430, height: 932 } });
    await p.route('**/*', (r) => { const u = r.request().url(); const m = u.match(/three@0\.170\.0\/(.*)$/); if (m) return r.fulfill({ path: D + '/cdn/package/' + m[1], contentType: 'text/javascript' }); if (u === 'http://game.local/') return r.fulfill({ contentType: 'text/html', body: html() }); r.abort(); });
    await p.goto('http://game.local/'); await p.waitForTimeout(5000);
    PORT = await p.evaluate(() => { const o = {}; o.flix = __fb.portrait('flix', 0, 1400); for (const c of ['wu', 'kick', 'flick', 'buzul']) o[c] = __fb.portrait(c, 0, 700); return o; });
    fs.writeFileSync(__dirname + '/ports.json', JSON.stringify(PORT)); await p.close();
  } else PORT = JSON.parse(fs.readFileSync(__dirname + '/ports.json'));
  const shot = async (w, h, body, out) => { const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }); await p.setContent('<!doctype html><meta charset="utf-8"><style>' + FONT + '*{box-sizing:border-box}body{margin:0;width:' + w + 'px;height:' + h + 'px;overflow:hidden;font-family:Rubik,sans-serif;position:relative}</style>' + body); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250); await p.screenshot({ path: __dirname + '/' + out }); await p.close(); console.log(out); };
  // ---------- icons
  const rays = (c1, c2) => `repeating-conic-gradient(from 0deg at 50% 58%, ${c1} 0 9deg, ${c2} 9deg 18deg)`;
  const icon = (v) => {
    const bg = v === 'A' ? ['#2aa5ff', '#1389ee', '#bfe8ff'] : v === 'B' ? ['#ffd21f', '#ffbe0a', '#fff3b0'] : ['#f0341c', '#dc2410', '#ff9a6a'];
    return `<div style="position:absolute;inset:0;background:${rays(bg[0], bg[1])}"></div><div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 55%, ${bg[2]} 0, transparent 46%)"></div>
    <img src="${PORT.flix}" style="position:absolute;left:-290px;top:-40px;width:1330px;filter:drop-shadow(0 18px 0 rgba(0,20,60,.22))">
    <div style="position:absolute;right:${v === 'C' ? 30 : 40}px;bottom:44px;transform:rotate(8deg)">${BOMB(370)}</div>
    <img src="${LOGO}" style="position:absolute;left:34px;top:30px;width:330px;filter:drop-shadow(0 6px 0 rgba(0,20,60,.25))">`;
  };
  for (const v of ['A', 'B', 'C']) await shot(1024, 1024, icon(v), 'icon_' + v + '.png');
  // ---------- store frames
  const W = 1290, H = 2796;
  const CAP = {
    tr: [['BOMBAYI KOY', 'KAÇ, PATLAT!', 'Flix dünyasında 3D bomba labirenti'], ['4 KİŞİLİK', 'ARENA', 'Son ayakta kalan raundu alır'], ['5 FARKLI', 'HARİTA', 'Kar, çöl, uzay, yanardağ: her birinin kuralı ayrı'], ['125 BÖLÜM', 'MACERA', 'Yıldız topla, yeni haritaları aç'], ['40 SKIN', 'TARZINI SEÇ', 'Sıradan, nadir, epik ve efsanevi görünüşler'], ['ONLINE', 'MAÇ', 'Hızlı eşleş ya da arkadaşınla oda kur'], ['BULMACA', 'MODU', 'Az bombayla bütün altın kasaları patlat'], ['CANAVARLARI', 'PATLAT', 'Gizli kapıyı bul, bölümü bitir']],
    en: [['DROP THE BOMB', 'RUN, BOOM!', 'A 3D bomb maze in the world of Flix'], ['4 PLAYER', 'ARENA', 'Last one standing takes the round'], ['5 DIFFERENT', 'MAPS', 'Snow, desert, space, volcano: each has its own rule'], ['125 LEVEL', 'ADVENTURE', 'Collect stars, unlock new maps'], ['40 SKINS', 'PICK YOUR STYLE', 'Common, rare, epic and legendary looks'], ['ONLINE', 'MATCHES', 'Quick match or a room with your friend'], ['PUZZLE', 'MODE', 'Blow up every gold crate with few bombs'], ['BLAST THE', 'MONSTERS', 'Find the hidden door, clear the level']]
  };
  const COL = [['#1c8ff0', '#0b5fc4'], ['#19b45a', '#0c8a3e'], ['#7b4be0', '#4a23b0'], ['#ff8a12', '#e85d00'], ['#f0341c', '#b81808'], ['#12306e', '#081a44'], ['#10a6b8', '#087688'], ['#e8479a', '#b01e6c']];
  const SRC = ['1', '2', null, '4', '5', '9', '7', '8'];
  for (const lang of ['tr', 'en']) for (let i = 0; i < 8; i++) {
    const c = CAP[lang][i], col = COL[i]; const img = (n) => b64('raw/' + lang + '_' + n + '.png', 'image/png');
    const PW = 1010, PH = Math.round(PW * 2796 / 1290);
    let inner;
    if (SRC[i]) inner = `<img src="${img(SRC[i])}" style="width:100%;display:block">`;
    else inner = `<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;width:100%;height:100%;gap:8px;background:#06143a">` + [['3a', lang === 'tr' ? 'KARLI' : 'SNOW'], ['3d', lang === 'tr' ? 'ÇÖL' : 'DESERT'], ['3b', lang === 'tr' ? 'UZAY' : 'SPACE'], ['3c', lang === 'tr' ? 'YANARDAĞ' : 'VOLCANO']].map(([n, t]) => `<div style="position:relative;overflow:hidden"><img src="${img(n)}" style="position:absolute;width:136%;left:-18%;top:-13%"><b style="position:absolute;left:18px;top:18px;background:#ffd21f;color:#06143a;border:5px solid #06143a;border-radius:18px;padding:8px 22px;font-size:40px;font-weight:900">${t}</b></div>`).join('') + `</div>`;
    const body = `<div style="position:absolute;inset:0;background:linear-gradient(170deg,${col[0]},${col[1]})"></div>
    <div style="position:absolute;inset:0;opacity:.13;background:${rays('#fff', 'transparent')}"></div>
    <img src="${LOGO}" style="position:absolute;left:535px;top:56px;width:220px">
    <div style="position:absolute;left:0;right:0;top:118px;text-align:center;font-weight:900;line-height:.98;letter-spacing:-1px">
      <div style="height:150px"></div>
      <div style="font-size:${c[0].length > 11 ? 122 : 142}px;color:#fff;-webkit-text-stroke:14px #06143a;paint-order:stroke fill;text-shadow:0 12px 0 #06143a">${c[0]}</div>
      <div style="font-size:${c[1].length > 11 ? 122 : 142}px;color:#ffd21f;-webkit-text-stroke:14px #06143a;paint-order:stroke fill;text-shadow:0 12px 0 #06143a;margin-top:10px">${c[1]}</div>
      <div style="display:inline-block;margin-top:44px;background:#06143a;color:#fff;font-size:46px;font-weight:600;letter-spacing:0;padding:18px 40px;border-radius:28px;max-width:1150px;line-height:1.15">${c[2]}</div>
    </div>
    <div style="position:absolute;left:${(W - PW) / 2 - 16}px;top:800px;width:${PW + 32}px;height:${PH + 32}px;border-radius:112px;background:#06143a;box-shadow:0 30px 0 rgba(0,10,40,.3);padding:16px"><div style="width:${PW}px;height:${PH}px;border-radius:96px;overflow:hidden">${inner}</div></div>`;
    await shot(W, H, body, 'out/' + lang + '_' + (i + 1) + '.png');
  }
  await b.close();
})();
