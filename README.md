# Flix Bomba (v1.3)


**6 dil, ipuçları, reklam aralığı (2026-11-18):**
- Diller: Türkçe (varsayılan, cihaz dili ne olursa olsun), English (oyunun kendi İngilizcesi), Français, Deutsch, Español, العربية. Ayarlar'daki eski TR/EN düğmesi yerine 6 dilli seçici. Daha önce İngilizce oynayanın seçimi korunur.
- Çeviri: `i18n/ceviri_*.tsv` (Türkçe metin anahtar). `T(tr, en)` fr/de/es/ar'da metni bu tablodan alır, kalanları `i18n/flix-i18n.js` ekranda çevirir. `kaynak/build.py` dil katmanını sayfaya kendisi ekler; tabloya satır ekleyip `python3 kaynak/build.py index.html` yeter.
- Nasıl Oynanır'a 2 sayfa: 💡 İpuçları ve 📺 Reklamlar.
- Hata: Macera ipucu "20 bölüm" diyordu, her haritada 25 bölüm var.
- Reklam: geçiş reklamları arasında (ve açılıştan sonra) en az 2 dakika; önceden kısa bulmaca denemelerinde her 3 denemede bir çıkabiliyordu.
- Kaynak değişiklikleri meta.js, ui12.js, ui13.js, body12.html'de; `patch12.py` → `game_v12.js`/`shell_v12.html` kopyası → `patch13.py` → `build.py` ile üretildi.
**Satın alma düzeltmesi (2026-11-17):** ödeme ekranı açılır açılmaz kalıcı ürün veriliyordu, ödemeyi kapatsan bile kalıyordu. cordova-plugin-purchase ödeme ekranı açıkken geçici bir "virtual" işlem oluşturuyor ve `store.owned()` onu sahip olunmuş sayıyor. `native-bridge.js` artık sadece gerçek, onaylanmış ya da bitmiş işlemlere bakıyor (`realOwned`).
3D bomba-labirent oyunu. Tek dosya: `index.html` (kaynaklar `kaynak/`). Önceki sürümler: `v14.html`, `v131.html`, `v12.html`, `v11.html`, `v1.html`. App Store görselleri ve ikon: `store/`. iOS paketi: `app/` (Capacitor, kök `index.html` ve `store/icon-1024.png` dosyalarını kullanır).

Modlar: Macera (5 harita x 25 = 125 bölüm: canavarları patlat, gizli kapıyı bul, çık), Arena (4 kişilik maç), Bulmaca (12 bölüm, sınırlı bomba), Online (hızlı eşleşme ya da oda koduyla 2-4 kişi).
Online yalnızca oyunun claude.ai bağlantısında çalışır (sayfanın canlı oda özelliğini kullanır). Hızlı eşleşmede 10 saniye içinde kimse gelmezse maç bilgisayar oyuncularıyla başlar.

v1.2: Türkçe/İngilizce, profil (isim, seviye, istatistik), avatar özelleştirme (yüz, zemin, çerçeve, rozet), tüy ekonomisi, 7 günlük ödül, mağaza (tüy paketleri `bomba_tuy_*`, `bomba_noads`; web'de deneme), ödüllü ve geçiş reklam bağlantıları (`window.FlixAds`, web'de Flix tanıtım kartı), maç öncesi rakip ekranı.

v1.3: 5 harita (Çimen, Karlı: fitil daha yavaş, Çöl: alev daha uzun sürer, Uzay: herkes daha hızlı, Yanardağ: menzil +1). Macerada her haritada 25 bölüm, bölüm başına 3 yıldız; sonraki harita yıldızla ya da tüyle açılır. Arena ve Online'da harita rastgele gelir. Karakter başına 8 kozmetik skin (3 sıradan, 2 nadir, 2 epik, 1 efsanevi; güç vermez). Görselli Nasıl Oynanır, hareketli ana ekran. v1.3.1: daha hareketli müzik.

v1.4 (iOS uygulaması için): `index.html` artık tam bir belge (doctype + telefon viewport ayarı; eksikliği uygulamada arayüzü 980 piksel genişlikte çizdiriyordu). three.js ve yazı tipleri dosyanın içine gömülü, hiçbir ağ isteği yok, uygulama internetsiz açılır. Uygulamada (Capacitor) Online modu gizlenir (claude.ai sayfasının oda özelliğine bağlı). Mağazada tüy paketleri ve Geri Yükle yalnızca `window.FlixNative.buy` varsa, reklam düğmeleri ve Reklamları Kaldır yalnızca `window.FlixAds` varsa görünür. Köprüler: `FlixNative.buy(id)`, `.restore()`, `.price(id)`; teslim için `window.__fkuGrant(id, txId)`; `FlixAds.showRewarded()` -> 'rewarded', `.showInterstitial()`, `.setScreen(n)`, `.setAdsRemoved(v)`. Ürünler: `bomba_tuy_1000/3500/7000/16000` (tüketilen), `bomba_noads` (kalıcı).

v1.4.1: `build.py` artık tam sayfayı kendisi üretiyor (TestFlight derlemesi ham sayfayı paketlediği için arayüz bozuk çıkıyordu). Flix logosu kırmızı zeminli; app ikonu ve mağaza görselleri yeni logoyla yenilendi.

v1.3 (App Store sürüm numarasıyla eşitlendi, önceki iç numara 1.4.1): Türkçe karakter düzeltmesi. Başlık yazı tipi Lilita One'da ğ, Ğ, ş, Ş, İ harfleri yoktu ve bu harfler başka bir yazı tipiyle çiziliyordu. Beş harf yazı tipine eklendi (`kaynak/mkfont.py`, kaynak `lilita_latin_orijinal.woff2`, çıktı `fonts.css` içindeki ikinci Lilita yüzü). `check_page.py` bu yüzün sayfada olduğunu da doğrular. Önceki sayfa `v141.html`.

## Derleme
`kaynak/` içinde: `python3 patch12.py` (game_v11.js + meta.js + ui12.js -> game.js, shell_v11.html + css12.css + body12.html -> shell.html), sonra `python3 patch13.py` (game_v12.js + ui13.js -> game.js, shell_v12.html + css13.css -> shell.html; game_v12.js ve shell_v12.html patch12 çıktısının kopyasıdır), sonra `python3 build.py [çıktı.html]`. `build.py` tek başına tam sayfayı üretir (doctype, UTF-8, telefon viewport ayarı, gömülü `fonts.css`, gömülü `vendor_three.js`); sadece Python gerekir. iOS iş akışı da bunu çağırır. Uygulamaya ham `shell.html` ya da başlıksız bir sayfa koymayın: viewport ve charset eksik olunca arayüz 980 piksel genişlikte çizilir ve emojiler bozuk karakter olur. `vendor_three.js` = three 0.170 + RoundedBoxGeometry + RoomEnvironment, esbuild ile `--format=iife --global-name=__T3` olarak bir kez üretildi.

- `kaynak/chars.js`: karakter modelleri ve özellikleri (Flix, Usta Wu, Kick, Flick, Buzul Flix).
- `kaynak/world.js`: ada haritası, bloklar, bomba, patlama, güçler, canavarlar, kapı.
- `kaynak/meta.js`: dil, profil, seviye, avatar, bilgisayar oyuncuları, eşleşme ekranı, reklam, mağaza, günlük ödül.
- `kaynak/ui12.js`: arayüz ve düğmeler. `kaynak/game_v11.js`: oyun mantığı, botlar, online (`NET`). Test: `window.__fb`.
- `kaynak/ui13.js`: haritalar ve yıldızlar, bölüm ekranı, skin ekranı, Nasıl Oynanır sayfaları. `kaynak/music.js`: müzik motoru.
- `kaynak/puzgen.js`: bulmaca üretici ve çözücü.
- Izgara kuralları ve bot döngüsü MattSkala/html5-bombergirl (MIT) temel alınarak yeniden yazıldı. Müzik motoru: fecolinhares/super-kart-3djs (MIT).
