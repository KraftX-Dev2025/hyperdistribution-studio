# Releasing HyperMixer

One product, three places. The web app is the product; the iOS and Android
apps are an [Expo](https://expo.dev) shell in `mobile/` that opens the live
site and adds native saving, sharing and the back button. Builds and store
uploads run in Expo's cloud (EAS), so no Xcode or Android Studio is needed.

| Where | What ships | How |
| --- | --- | --- |
| Web | The site on Vercel | Deploy `main` |
| Web app (PWA) | Same site, installable from the browser | Automatic |
| iOS / iPadOS | `mobile/` built by EAS | `npm run build:store` then `npm run submit` |
| Android | `mobile/` built by EAS | Same commands |

App id on both stores: `com.kraftxworks.hypermixer`. It can't change after the first upload.

Because the apps load the live site, **most updates need no app release**: deploy the
site and every phone gets it on next open. Rebuild the apps only when `mobile/`
changes (icon, splash, permissions, native features). The site the apps open is
`expo.extra.webUrl` in `mobile/app.json`; it must be the public production URL
(Vercel previews sit behind a login).

## One-time setup

Needs: a free Expo account, an Apple Developer Program membership (99 USD a year),
a Google Play Console account (25 USD once).

```bash
cd mobile
npm install
npx eas-cli@latest login       # your Expo account
npx eas-cli@latest init        # links the app to your Expo account (adds the project id to app.json)
```

EAS creates and stores the iOS certificates and the Android upload key for you the
first time you build. Say yes when it offers.

## Try it on your phone first

```bash
cd mobile
npm run build:preview          # Android APK + iOS internal build
```

- Android: open the link EAS prints on the phone and install the APK.
- iPhone: EAS asks to register your device (it opens a page to install a profile), then gives an install link.

## Release to the stores

```bash
cd mobile
npm run build:store            # store builds; version numbers go up on their own
npm run submit                 # uploads to App Store Connect and Google Play
```

### App Store

1. In [App Store Connect](https://appstoreconnect.apple.com) → Apps → + → New App: name HyperMixer, bundle id `com.kraftxworks.hypermixer`, SKU `hypermixer`. (`eas submit` can create it for you.)
2. Fill the listing from [STORE-LISTING.md](STORE-LISTING.md): screenshots (6.9" iPhone and 13" iPad), description, keywords, support URL, privacy policy URL, App Privacy answers (no data collected by the developer; data stays on device), age rating.
3. Test in TestFlight, then Submit for Review, with the review notes from STORE-LISTING.md.

### Google Play

1. In [Play Console](https://play.google.com/console) → Create app → HyperMixer. Turn on Play App Signing.
2. The first upload must be done by hand: download the `.aab` from the EAS build page and upload it to Internal testing. After that, `npm run submit` works (it needs a Google service account key; EAS walks you through it).
3. New personal accounts must run a closed test with 12 testers for 14 days before production.
4. Fill the listing from [STORE-LISTING.md](STORE-LISTING.md): icon (512 px, `public/icons/icon-512.png`), feature graphic 1024×500, phone and tablet screenshots, privacy policy URL, Data safety form, content rating.

## Before the first submission

- A public privacy policy page (the stores require a URL).
- The site deployed to production with this branch, since the apps open it.
- Test on a device: pick media, render a video, Save or share, AI actions with a real key.
