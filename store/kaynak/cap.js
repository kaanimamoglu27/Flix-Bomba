const { chromium } = require('playwright'); const fs = require('fs'); const D = __dirname + '/..';
const html = () => '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>' + fs.readFileSync(D + '/flix-bomba.html', 'utf8');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const lang of ['tr', 'en']) {
    const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, hasTouch: true }); const errs = [];
    await p.route('**/*', (r) => { const u = r.request().url(); const m = u.match(/three@0\.170\.0\/(.*)$/); if (m) return r.fulfill({ path: D + '/cdn/package/' + m[1], contentType: 'text/javascript' }); if (u === 'http://game.local/') return r.fulfill({ contentType: 'text/html', body: html() }); r.abort(); });
    p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript("localStorage.setItem('flix_bomba1', JSON.stringify({lang:'" + lang + "',name:'Flix',xp:2600,tuy:12500,own:['flix','kick','wu','flick','buzul'],tip:{macera:1,bulmaca:1,arena:1},day:{last:'x',n:0},st:{" + Array.from({length:25},(_, i)=>'"'+(i+1)+'":'+(i%4==1?2:3)).join(',') + ',' + Array.from({length:9},(_, i)=>'"'+(26+i)+'":'+(i%3==2?2:3)).join(',') + "},wOwn:[0,1],sk:{flix:7},skOwn:{flix:[0,3,5,7]}}))");
    await p.goto('http://game.local/'); await p.waitForTimeout(5000);
    const S = async (n) => { await p.waitForTimeout(1200); await p.screenshot({ path: __dirname + '/raw/' + lang + '_' + n + '.png' }); console.log(lang, n); };
    await p.evaluate(() => { document.getElementById('daily').hidden = true; if (document.getElementById('intro')) document.getElementById('intro').hidden = true; });
    await p.evaluate(() => { __fb.SV.sk.flix = 0; __fb.renderHome(); }); await S(1);
    // arena with explosions
    const play = async (mode, opt, pred) => p.evaluate(([mode, opt, pred]) => { const f = __fb, G = f.G; G.auto = true; f.startGame(mode, opt); f.sim(140); let n = 0; const ok = new Function('G', 'return ' + pred); while (n < 60 * 60 && !(ok(G) && G.state === 'play')) { f.sim(2); n += 2; } return [n, G.state, G.flames.size]; }, [mode, opt, pred]);
    console.log(await play('arena', { th: 0 }, 'G.flames.size>=5 && G.players.filter(q=>q.alive).length>=4 && G.bombs.length>=1')); await S(2);
    console.log(await play('arena', { th: 1 }, 'G.flames.size>=4 && G.players.filter(q=>q.alive).length>=3')); await S('3a');
    console.log(await play('arena', { th: 3 }, 'G.flames.size>=4 && G.players.filter(q=>q.alive).length>=3')); await S('3b');
    console.log(await play('arena', { th: 4 }, 'G.flames.size>=4 && G.players.filter(q=>q.alive).length>=3')); await S('3c');
    console.log(await play('arena', { th: 2 }, 'G.flames.size>=4 && G.players.filter(q=>q.alive).length>=3')); await S('3d');
    console.log(await play('macera', { world: 0, level: 6 }, 'G.flames.size>=3 && G.mons.filter(m=>m.alive).length>=2')); await S(8);
    await p.evaluate(() => { __fb.startGame('bulmaca', { level: 5 }); __fb.sim(150); }); await S(7);
    await p.evaluate(() => { __fb.G.auto = false; __fb.goHome(); __fb.openLevels('macera', 1); }); await S(4);
    await p.evaluate(() => { document.getElementById('levels').hidden = true; __fb.SV.sk.flix = 7; __fb.renderHome(); }); await p.click('#skinBtn'); await p.waitForTimeout(400); await p.click('#skGrid [data-k="7"]'); await S(5);
    await p.click('#skins [data-close]'); await S('6');
    await p.evaluate(() => { __fb.mmStart('quick'); for (let i = 0; i < 260 && !(__fb.MM.go > 0); i++) __fb.mmTick(0.05); for (let i = 0; i < 8; i++) __fb.mmTick(0.05); }); await S('9');
    console.log(errs.join('\n') || 'no errors'); await p.close();
  }
  await b.close();
})();
