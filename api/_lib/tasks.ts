import type Anthropic from "@anthropic-ai/sdk";

type Content = string | Anthropic.Beta.BetaContentBlockParam[];
type Task = {
  effort: "low" | "medium" | "high";
  system: string;
  schema: Record<string, unknown>;
  content: (input: Record<string, unknown>) => Content;
};

const str = { type: "string" };
const num = { type: "number" };
const strs = { type: "array", items: str };
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  additionalProperties: false,
  required: Object.keys(properties),
  properties,
});
const J = (v: unknown) => JSON.stringify(v, null, 1);

const BRAIN = obj({
  summary: str, audience: str, personality: strs, tone: str, pillars: strs, hooks: strs,
  dos: strs, donts: strs, vocabulary: strs, hashtags: strs, ctaStyle: str, visual: str,
});

const SEGMENT = obj({
  type: { type: "string", enum: ["card", "clip"] },
  style: { type: "string", enum: ["slam", "title", "caption", ""] },
  text: str,
  sub: str,
  file: str,
  from: num,
  seconds: num,
  caption: str,
  look: { type: "string", enum: ["clean", "camcorder", "punch", "bw", ""] },
});

export const TASKS = {
  brain: {
    effort: "medium",
    system:
      "You build a brand brain: a compact, specific profile a content team can write from. Ground every field in the pages and notes you are given. Where the sources are thin, infer carefully from what is there and keep it plausible; never invent facts such as numbers, awards or customers. Write in plain language. Lists hold 3 to 8 short items.",
    schema: BRAIN,
    content: (i) =>
      `Brand: ${i.name}\nTagline: ${i.tagline || "(none)"}\nOwner's notes:\n${i.notes || "(none)"}\n\nPages read from the brand's links:\n${
        (i.pages as { url: string; text: string }[] | undefined)?.map((p) => `--- ${p.url}\n${p.text}`).join("\n\n") || "(no pages could be read)"
      }\n\nFill every field. "hooks" are opening lines in this brand's voice. "visual" describes the look of its photos and videos.`,
  },

  ideas: {
    effort: "medium",
    system:
      "You turn a brand's raw dumps (notes, links, half-thoughts, media names) into postable content ideas. Each idea has one clear angle, fits the brand brain, and says which formats suit it. Prefer ideas that can be shot or written this week.",
    schema: obj({ ideas: { type: "array", items: obj({ title: str, angle: str, hook: str, formats: strs }) } }),
    content: (i) =>
      `Brand brain:\n${J(i.brain)}\n\nChannels: ${J(i.channels)}\n\nDumps:\n${J(i.dumps)}\n\nGive ${i.count ?? 8} ideas.`,
  },

  blast: {
    effort: "medium",
    system:
      "You take one idea and adapt it for many brands and channels at once. Each version must sound like its brand (use its brain) and native to its platform: length, structure, hashtags and format conventions. Do not reuse the same opening line across versions. Return one post per target, using the target's id.",
    schema: obj({ posts: { type: "array", items: obj({ targetId: str, title: str, body: str, format: str }) } }),
    content: (i) => `Idea:\n${i.idea}\n\nTargets:\n${J(i.targets)}`,
  },

  script: {
    effort: "high",
    system: `You are a short-form video editor and scriptwriter. Given an idea, a brand brain and the user's media library, write a script and an edit decision list that a Remotion template will render.

Rules for the edit:
- Segments play in order. Total length should be close to the requested seconds.
- A "card" segment is a full-screen text card: style "slam" (punchy hook, 1 to 2 s), "title" (end card or chapter, 2 to 3 s) or "caption" (plain line on black). Set file "", from 0, caption "", look "".
- A "clip" segment uses one file from the library, by its exact path. "from" is the start time in seconds inside that file; from + seconds must not exceed the file's duration. Images can run 1 to 3 s. Set style "", text "", sub "". caption is the on-screen line ("" for none). look is clean, camcorder (retro/home-video), punch (fast zoom + flash on beat) or bw.
- Use only paths that appear in the library. If the library is empty, build the edit from cards only.
- Open with a hook in the first 2 seconds. Keep captions short, under 8 words.
- "music" is the path of an audio file from the library, or "" for none.`,
    schema: obj({
      hook: str,
      beats: { type: "array", items: obj({ line: str, visual: str }) },
      caption: str,
      hashtags: strs,
      edit: obj({ title: str, music: str, segments: { type: "array", items: SEGMENT } }),
    }),
    content: (i) => {
      const media = (i.media as { path: string; kind: string; duration?: number; thumb?: string }[] | undefined) ?? [];
      const blocks: Anthropic.Beta.BetaContentBlockParam[] = [
        {
          type: "text",
          text: `Idea: ${i.idea}\nBrand brain:\n${J(i.brain)}\nTarget: ${i.seconds} seconds, aspect ${i.aspect}, for ${i.platform || "short-form video"}.\nStyle notes from the user: ${i.style || "(none)"}\n\nMedia library (${media.length} files). Thumbnails follow, each labelled with its path:\n${media
            .map((m) => `- ${m.path} (${m.kind}${m.duration ? `, ${m.duration.toFixed(1)}s` : ""})`)
            .join("\n")}`,
        },
      ];
      for (const m of media) {
        const match = m.thumb?.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
        if (!match) continue;
        blocks.push({ type: "text", text: m.path });
        blocks.push({ type: "image", source: { type: "base64", media_type: match[1] as "image/jpeg", data: match[2] } });
      }
      return blocks;
    },
  },
} satisfies Record<string, Task>;

export type TaskName = keyof typeof TASKS;
