# HyperMixer

The content engine for businesses, free and open source, on the web, iPhone, iPad and Android. Built for founders, marketing teams and agencies running one brand or many. Connect your photos, clips and music, describe your brands, and it handles the rest end to end:

- **Brand brains** built from links. Paste a website, about page or profiles; Claude reads them and writes the brand's voice, audience, pillars, hooks, do's and don'ts.
- **Multi-channel planning** across 50+ channels (Instagram, TikTok, YouTube, LinkedIn, X, Reddit, Product Hunt, newsletters, press and more), with weekly targets per channel and a fire grid that shows where you're behind.
- **Ideas and dumps.** Throw in raw thoughts and links, turn them into ideas, and **blast** one idea across every brand and channel at once, each version in that brand's voice and native to the platform.
- **Video edits.** Write the script in a post, pick clips from your media folder (or let Claude pick them), and send it to [Remotion](https://www.remotion.dev). The MP4 renders right in your browser and shows up on the post.

Your data stays in your browser. Media files are read locally and never uploaded.

## Use it

1. Open the app and press **⚙ Settings**. Paste a Claude API key from [platform.claude.com](https://platform.claude.com/settings/keys). It is stored only in your browser and sent with each AI request; the server never saves it.
2. Press **Media** and connect the folder where your media lives. Chrome, Edge and Arc remember it between visits.
3. Add a **brand** with its links and channels, then press **Build brain**.
4. Dump ideas, plan the week, blast one idea everywhere, and send posts to Remotion.

## Run it yourself

```bash
git clone https://github.com/<you>/hypermixer
cd hypermixer
npm install
npm run dev        # app + API on http://localhost:5173
```

### Deploy to Vercel

Import the repo at [vercel.com/new](https://vercel.com/new). No settings are needed: Vercel detects Vite, serves the app, and runs `api/ai.ts` as a function. Optional environment variables are in [`.env.example`](.env.example), for example to pay for everyone's usage with your own key.

### Install it as an app

- **Any browser:** open the site and choose *Install* (Chrome, Edge) or *Share → Add to Home Screen* (Safari). It opens full screen and works offline.
- **iOS and Android apps:** the same web app, bundled with [Capacitor](https://capacitorjs.com). `npm run ios` opens Xcode and `npm run android` opens Android Studio. AI calls go to the hosted site set in `VITE_API_BASE`. Store release steps are in [docs/RELEASE.md](docs/RELEASE.md).

On phones there's no folder picker, so **Media** asks you to pick photos, clips and music from your library instead, and finished videos get a **Save or share** button.

### Work on the video template

`npm run studio` opens Remotion Studio on the edit template in `src/video/Edit.tsx`. Each finished render stores the edit it used (`spec`), so you can also render one from the CLI: save `{"spec": ...}` to `edit.json` and run `npx remotion render remotion/index.ts Edit out.mp4 --props=./edit.json --public-dir="/path/to/your/media"`.

## How it's built

The board itself is one page (`index.html` plus `public/legacy/app.js`), the same control desk as the original Distribution board: stats strip, fire grid, this week, pipeline and brands, with side panels for brands, posts, blasts, plans, media and the edit queue. It talks to a small set of services that `src/main.ts` provides:

| Service | Where | What it does |
| --- | --- | --- |
| Database | `src/shim/db.ts` | Brands, posts, dumps and renders, stored in this browser's IndexedDB |
| Claude | `src/shim/services.ts` → `api/ai.ts` | Sends a prompt (and images) with the user's own key; returns JSON |
| Link reader | `src/shim/services.ts` → `api/read-link.ts` | Reads brand links on the server for brand brains (refuses private addresses) |
| Uploads | `src/shim/assets.ts`, `public/sw.js` | Logos, images and finished videos, kept in Cache Storage at `/_blob/…` |
| Media folder | `src/shim/folder.ts` | Your folder of clips, photos and music, read locally and never uploaded |
| Renderer | `src/shim/render.ts`, `src/video/Edit.tsx` | Turns "Send to Remotion" edits into MP4s in the browser |

## Licensing

The code is MIT licensed. Video rendering uses Remotion, which is free for individuals and companies of up to 3 people; larger companies need a [Remotion company license](https://www.remotion.dev/license). The app asks for your license key (or `free-license`) before exporting.

## Contributing

Issues and pull requests are welcome. Run `npm run typecheck` before you open one.
