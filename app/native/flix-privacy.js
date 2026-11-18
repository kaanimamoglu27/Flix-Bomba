/* FLIX privacy options (app only): Google requires a way to change or withdraw ad consent (UMP privacy options
   entry point) for players in the EEA / UK / Switzerland. Next to the "Yasal Bilgiler" button
   (data-flixlegal="legal", present in every FLIX game's settings / menu) this adds a "Gizlilik Seçenekleri" button
   with the same look. When the game has a settings sheet (#settings or [data-flixsettings]) only the legal buttons in it
   get one (not the small home-screen row, which would wrap); otherwise every legal button does. The label follows the
   page language (<html lang>), also when the player switches it. It is shown only when Google says it is required (FlixAds.privacyOptionsRequired(), ads.js)
   and reopens Google's consent form (FlixAds.showPrivacyOptions()). Works for buttons the game draws later too. */
(function () {
  var Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
  var MARK = 'data-flixprivacy';
  function required() { var A = window.FlixAds; return !!(A && A.privacyOptionsRequired && A.privacyOptionsRequired()); }
  function tr() { return (document.documentElement.lang || 'tr').toLowerCase().indexOf('tr') === 0; }
  function label() { return tr() ? 'Gizlilik Seçenekleri' : 'Privacy Options'; }
  // a two-part row (e.g. <span>Yasal Bilgiler</span><span>Aç</span>) gets the same two parts
  function fill(b) {
    var t = '🔒 ' + label();
    if (b.getAttribute('data-flixrow') === '1') {
      if (b.firstChild && b.firstChild.textContent === t) return;
      b.innerHTML = '<span></span><span></span>'; b.firstChild.textContent = t; b.lastChild.textContent = tr() ? 'Aç' : 'Open';
    } else if (b.textContent !== t) b.textContent = t;
  }
  function targets() {
    var all = [].slice.call(document.querySelectorAll('[data-flixlegal="legal"]'));
    var inSettings = all.filter(function (b) { return b.closest && b.closest('#settings, [data-flixsettings]'); });
    return inSettings.length ? inSettings : all;
  }
  function sync() {
    var on = required();
    document.querySelectorAll('[' + MARK + ']').forEach(function (b) { fill(b); b.hidden = !on; b.style.display = on ? '' : 'none'; });
  }
  function decorate() {
    var want = targets();
    // a button added earlier next to a legal button that is no longer a target goes away
    document.querySelectorAll('[' + MARK + ']').forEach(function (b) { var prev = b.previousElementSibling; if (!prev || want.indexOf(prev) < 0) b.parentNode.removeChild(b); });
    want.forEach(function (legal) {
      var next = legal.nextElementSibling;
      if (next && next.hasAttribute(MARK)) return;
      var b = document.createElement(legal.tagName === 'A' ? 'a' : 'button');
      b.className = legal.className; b.setAttribute(MARK, '1');
      if (legal.getAttribute('type')) b.setAttribute('type', legal.getAttribute('type'));
      if (legal.children.length >= 2) b.setAttribute('data-flixrow', '1');
      fill(b);
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var A = window.FlixAds; if (!A || !A.showPrivacyOptions || b.disabled) return;
        b.disabled = true;
        A.showPrivacyOptions().then(function () { b.disabled = false; sync(); }, function () { b.disabled = false; });
      });
      legal.parentNode.insertBefore(b, legal.nextSibling);
    });
    sync();
  }
  window.addEventListener('flixprivacy', sync);
  function startObserver() {
    decorate();
    var t = 0;
    new MutationObserver(function () { if (!t) t = setTimeout(function () { t = 0; decorate(); }, 60); })
      .observe(document.body, { childList: true, subtree: true });
    // language switch: the game sets <html lang>
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.body) startObserver(); else document.addEventListener('DOMContentLoaded', startObserver);
})();
