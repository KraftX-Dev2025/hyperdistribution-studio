export type Status = "idea" | "drafting" | "scheduled" | "posted";
export const STATUSES: Status[] = ["idea", "drafting", "scheduled", "posted"];

export type Channel = {
  id: string;
  platform: string; // key of PLATFORMS
  label?: string; // for platform "other"
  handle: string;
  url: string;
  cadence: number; // target posts per week
};

export type Brain = {
  summary: string;
  audience: string;
  personality: string[];
  tone: string;
  pillars: string[];
  hooks: string[];
  dos: string[];
  donts: string[];
  vocabulary: string[];
  hashtags: string[];
  ctaStyle: string;
  visual: string;
};

export type Brand = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  links: string[]; // website, profiles, articles used to build the brain
  notes: string; // anything the user wants the brain to know
  channels: Channel[];
  brain?: Brain;
  brainBuiltAt?: string;
  linkStatus?: Record<string, "read" | "failed">;
  createdAt: string;
};

export type Post = {
  id: string;
  brandId: string;
  channelId: string;
  title: string;
  body: string;
  format: string;
  status: Status;
  date: string; // YYYY-MM-DD or ""
  blastId?: string;
  scriptId?: string;
  createdAt: string;
};

/** Raw material: a thought, a link, a voice-note transcript, a media file name. */
export type Dump = {
  id: string;
  brandId: string | null; // null = shared across brands
  text: string;
  media?: string[]; // file paths inside the connected folder
  kind: "dump" | "idea";
  used: boolean;
  createdAt: string;
};

export type Segment =
  | { type: "card"; text: string; sub?: string; seconds: number; style: "slam" | "title" | "caption" }
  | {
      type: "clip";
      file: string; // path inside the media folder
      from: number; // seconds into the source
      seconds: number;
      caption?: string;
      look: "clean" | "camcorder" | "punch" | "bw";
    };

export type EditSpec = {
  title: string;
  aspect: "9:16" | "1:1" | "16:9";
  fps: number;
  accent: string;
  music?: string; // path inside the media folder
  segments: Segment[];
};

export type Script = {
  id: string;
  brandId: string;
  idea: string;
  hook: string;
  beats: { line: string; visual: string }[];
  caption: string;
  hashtags: string[];
  edit: EditSpec;
  createdAt: string;
};

export type Settings = {
  apiKey: string; // stays in this browser, sent only to this app's /api route per request
  remotionLicense: string; // "free-license" for individuals and companies that qualify
};

export type Workspace = {
  version: 1;
  brands: Brand[];
  posts: Post[];
  dumps: Dump[];
  scripts: Script[];
  settings: Settings;
};

export const emptyWorkspace = (): Workspace => ({
  version: 1,
  brands: [],
  posts: [],
  dumps: [],
  scripts: [],
  settings: { apiKey: "", remotionLicense: "" },
});

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const now = () => new Date().toISOString();
