/* FLIX Bomb: the one place for AdMob ids and switches (app only; the web build never loads AdMob).
   Real ids come from AdMob (apps.admob.com > Apps > FLIX Bomb > App settings / Ad units).
   An id left empty (or not in the ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX form) falls back to Google's TEST ad unit.
   IOS_APP_ID also goes into Info.plist (GADApplicationIdentifier) via tools/ios_admob.py.
   Ad pacing is a game rule (index.html: interstitial every 3rd finished game, never within 90 s of a rewarded ad, none with "No Ads"). */
window.FLIX_ADS_CONFIG = {
  forceTestAds: false,
  ids: {
    IOS_APP_ID: 'ca-app-pub-9939733946730095~9296380320',        // ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
    IOS_REWARDED: 'ca-app-pub-9939733946730095/6530616184',      // rewarded: +60 feathers in the shop (5 a day), daily reward x2
    IOS_INTERSTITIAL: 'ca-app-pub-9939733946730095/5109723304',  // interstitial: after every 3rd finished game
    IOS_BANNER: '',
    ANDROID_REWARDED: '',
    ANDROID_INTERSTITIAL: '',
    ANDROID_BANNER: ''
  },
  bannerEnabled: false,
  // Asks the iPhone's "Allow tracking?" question once. If false, also update App Store Connect > App Privacy.
  requestTracking: true,
  testDevices: []
};
