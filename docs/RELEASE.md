# Releasing HyperMixer

One codebase ships three ways. The web app is the source; the iOS and Android
apps bundle the same build with Capacitor.

| Where | What ships | Who does it |
| --- | --- | --- |
| Web | Vercel deploys `main` | Automatic on merge |
| Web app (PWA) | Same site, installable from the browser | Automatic |
| iOS / iPadOS | `ios/` Xcode project | Owner, on a Mac with Xcode |
| Android | `android/` Gradle project | Owner, with Android Studio |

App id on both stores: `com.kraftxworks.hypermixer`. It can't change after the first upload.

## Every release

```bash
npm ci
npm run build:app      # web build with VITE_API_BASE, then cap sync
```

`VITE_API_BASE` is the hosted site the apps call for AI and link reading
(default `https://hyperdistribution-studio.vercel.app`). If the site moves to a
new domain, rebuild the apps with the new value. The API allows the app
origins (`capacitor://localhost`, `https://localhost`) through CORS in
`api/_lib/cors.ts`.

Bump the version in both stores before each upload:
- iOS: Xcode → App target → General → Version and Build.
- Android: `android/app/build.gradle` → `versionName` and `versionCode` (+1 every upload).

After changing the icon in `resources/`, run `npm run icons`.

## iOS: App Store

Needs: an Apple Developer Program membership (99 USD a year), a Mac with Xcode 26+.

1. `npm run ios` opens Xcode.
2. App target → Signing & Capabilities → pick your Team. Xcode creates the signing certificate and profile.
3. In [App Store Connect](https://appstoreconnect.apple.com) → Apps → + → New App: name HyperMixer, bundle id `com.kraftxworks.hypermixer`, SKU `hypermixer`.
4. Xcode → Product → Archive → Distribute App → App Store Connect → Upload.
5. In App Store Connect: screenshots (6.9" iPhone and 13" iPad), description, keywords, support URL, privacy policy URL, App Privacy answers (no data collected by the developer; data stays on device), age rating. Then TestFlight, then Submit for Review.

Review notes to include: "HyperMixer is a content studio. AI features need the user's own Claude API key, entered in Settings. Media is picked from the photo library and processed on device."

## Android: Google Play

Needs: a Google Play Console account (25 USD once). New personal accounts must run a closed test with 12 testers for 14 days before production.

1. `npm run android` opens Android Studio.
2. Build → Generate Signed App Bundle → Android App Bundle → create a new upload keystore. **Back up the keystore and its passwords**; losing them blocks updates.
3. In [Play Console](https://play.google.com/console) → Create app → HyperMixer. Turn on Play App Signing.
4. Upload `app-release.aab` to Internal testing first, then Closed testing, then Production.
5. Store listing: icon (512 px, `public/icons/icon-512.png`), feature graphic 1024×500, phone and tablet screenshots, short and full description, privacy policy URL, Data safety form, content rating.

## Before the first submission

- A public privacy policy page (the stores require a URL).
- Store screenshots from a real device or simulator.
- Test on a device: pick media, render a video, Save or share, AI actions with a real key.
