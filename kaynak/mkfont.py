# Adds the Turkish letters Lilita One lacks (ğ Ğ ş Ş İ) to the latin subset. OFL font; internal name changed.
import math, sys
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
f=TTFont('lilita_latin_orijinal.woff2'); cm=f.getBestCmap(); gs=f.getGlyphSet(); glyf=f['glyf']; hmtx=f['hmtx']
def rec(name):
    p=DecomposingRecordingPen(gs); gs[name].draw(p); return p.value
def contours(name):
    out=[];cur=[]
    for op in rec(name):
        cur.append(op)
        if op[0] in('closePath','endPath'): out.append(cur);cur=[]
    return out
def bounds(ops):
    from fontTools.pens.recordingPen import RecordingPen
    r=RecordingPen(); r.value=list(ops); b=BoundsPen(None); r.replay(b); return b.bounds
def draw(pen,ops,dx=0,dy=0,sx=1,sy=1):
    from fontTools.pens.recordingPen import RecordingPen
    r=RecordingPen(); r.value=list(ops); r.replay(TransformPen(pen,(sx,0,0,sy,dx,dy)))
def add(name,code,parts,adv_from):
    pen=TTGlyphPen(None)
    for ops,dx,dy in parts: draw(pen,ops,dx,dy)
    g=pen.glyph(); glyf[name]=g; g.recalcBounds(glyf)
    hmtx[name]=(hmtx[adv_from][0], g.xMin if hasattr(g,'xMin') else hmtx[adv_from][1])
    for t in f['cmap'].tables:
        if t.isUnicode(): t.cmap[code]=name
flat=lambda cs:[o for c in cs for o in c]
# --- dot: from 'i' (the contour that sits highest)
ic=contours('i'); dot=max(ic,key=lambda c:bounds(c)[1]); db=bounds(dot)
# reference heights for capital accents from Odieresis dots
oc=contours('Odieresis'); od=sorted(oc,key=lambda c:bounds(c)[1])[-1]; ob=bounds(od)
print('i dot',db,'O dieresis dot',ob)
def center(name): b=bounds(flat(contours(name))); return (b[0]+b[2])/2, b
# İ
cx,b=center('I'); add('Idotaccent',0x130,[(flat(contours('I')),0,0),(dot,cx-(db[0]+db[2])/2, ob[1]-db[1])],'I')
# cedilla
ced=flat(contours('cedilla')); cb=bounds(ced); ccb=bounds(flat(contours('ccedilla'))); print('cedilla',cb,'ccedilla ymin',ccb[1])
dyc=ccb[1]-cb[1]   # same depth as in ç
for base,name,code in (('s','scedilla',0x15f),('S','Scedilla',0x15e)):
    cx,b=center(base); add(name,code,[(flat(contours(base)),0,0),(ced,cx-(cb[0]+cb[2])/2+6,dyc)],base)
# breve: thick smile built from two arcs
def breve(cx,ybot,w,h,t):
    pts=[];N=14
    for i in range(N+1):
        a=math.pi+math.pi*i/N; pts.append((cx+w/2*math.cos(a), ybot+h+ (h)*math.sin(a)))      # outer, left->right through bottom
    wi=w/2-t*0.92; hi=h-t*0.78
    for i in range(N+1):
        a=2*math.pi-math.pi*i/N; pts.append((cx+wi*math.cos(a), ybot+h+ hi*math.sin(a)))       # inner, right->left
    ops=[('moveTo',(pts[0],))]+[('lineTo',(p,)) for p in pts[1:]]+[('closePath',())]
    return ops
# lower-case accent height from udieresis dots
uc=contours('udieresis'); ud=sorted(uc,key=lambda c:bounds(c)[1])[-1]; ub=bounds(ud); print('u dieresis dot',ub)
cx,b=center('g'); add('gbreve',0x11f,[(flat(contours('g')),0,0),(breve(cx+4,ub[1]-6,250,ub[3]-ub[1]+4,72),0,0)],'g')
cx,b=center('G'); add('Gbreve',0x11e,[(flat(contours('G')),0,0),(breve(cx+10,ob[1]-4,270,ob[3]-ob[1]+2,74),0,0)],'G')
order=f.getGlyphOrder()
for n in ('Idotaccent','scedilla','Scedilla','gbreve','Gbreve'):
    if n not in order: order.append(n)
f.setGlyphOrder(order); f['maxp'].numGlyphs=len(order)
if 'post' in f: f['post'].formatType=3.0
for rec_ in f['name'].names:
    if rec_.nameID in (1,4,6,16):
        s=rec_.toUnicode().replace('Lilita One','Lilita Flix TR').replace('LilitaOne','LilitaFlixTR'); rec_.string=s
asc=f['hhea'].ascent; print('hhea asc',asc,'winAscent',f['OS/2'].usWinAscent,'Idot top',glyf['Idotaccent'].yMax,'Gbreve top',glyf['Gbreve'].yMax)
f.flavor=None; f.save('lilita_tr.ttf'); f.flavor='woff2'; f.save('lilita_tr.woff2')
import os; print(os.path.getsize('lilita_tr.woff2'))
