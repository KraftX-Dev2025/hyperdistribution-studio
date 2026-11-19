# HyperDistribution Studio

A free, open-source content studio. Connect a folder of your photos, clips and music, describe your brands, and it handles the rest end to end:

- **Brand brains** built from links. Paste a website, about page or profiles; Claude reads them and writes the brand's voice, audience, pillars, hooks, do's and don'ts.
- **Multi-channel planning** across 50+ channels (Instagram, TikTok, YouTube, LinkedIn, X, Reddit, Product Hunt, newsletters, press and more), with weekly targets per channel and a fire grid that shows where you're behind.
- **Ideas and dumps.** Throw in raw thoughts and links, turn them into ideas, and **blast** one idea across every brand and channel at once, each version in that brand's voice and native to the platform.
- **Scripts and video edits.** Claude writes the script and cuts it from your own media folder. Tweak any segment, preview it live with [Remotion](https://www.remotion.dev), and export an MP4 right in the browser.

Your data stays in your browser. Media files are read locally and never uploaded.

## Use it

1. Open the app and go to **Settings**. Paste a Claude API key from [platform.claude.com](https://platform.claude.com/settings/keys). It is stored only in your browser and sent with each AI request; the server never saves it.
2. Go to **Media folder** and connect the folder where your media lives. Chrome, Edge and Arc remember it between visits.
3. Add a **brand** with its links and channels, then press **Build brain**.
4. Dump ideas, blast them, and script videos.

## Run it yourself

```bash
git clone https://github.com/<you>/hyperdistribution-studio
cd hyperdistribution-studio
npm install
npm run dev        # app + API on http://localhost:5173
```

### Deploy to Vercel

Import the repo at [vercel.com/new](https://vercel.com/new). No settings are needed: Vercel detects Vite, serves the app, and runs `api/ai.ts` as a function. Optional environment variables are in [`.env.example`](.env.example), for example to pay for everyone's usage with your own key.

### Render with the Remotion CLI

The browser export is fine for short edits. For long or high-quality renders, press **Download edit** in the studio and run:

```bash
npx remotion render remotion/index.ts Edit out.mp4 --props=./edit.json --public-dir="/path/to/your/media"
```

`npm run studio` opens Remotion Studio on the same composition.

## How it's built

| Piece | Where |
| --- | --- |
| UI (Vite, React, TypeScript) | `src/` |
| Workspace storage (IndexedDB) and backups | `src/lib/store.tsx` |
| Media folder (File System Access API, with a fallback for other browsers) | `src/lib/media.tsx` |
| Channel catalogue | `src/lib/platforms.ts` |
| Video template (Remotion) | `src/video/Edit.tsx`, CLI entry in `remotion/` |
| Claude calls, prompts and JSON schemas | `api/ai.ts`, `api/_lib/tasks.ts` |
| Link reader for brand brains | `api/_lib/readLink.ts` (refuses private and local addresses) |

Each AI feature is one entry in `api/_lib/tasks.ts`: a system prompt, a JSON schema and a function that builds the message. Add a task there and call it with `ai("your-task", input, key)` from the UI.

## Licensing

The code is MIT licensed. Video rendering uses Remotion, which is free for individuals and companies of up to 3 people; larger companies need a [Remotion company license](https://www.remotion.dev/license). The app asks for your license key (or `free-license`) before exporting.

## Contributing

Issues and pull requests are welcome. Run `npm run typecheck` before you open one.
