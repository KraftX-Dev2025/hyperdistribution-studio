/** The channels HyperMixer plans for. Keys match the classic board's platform ids. */
export const PLATFORMS: Record<string, { label: string; g: string; c: string; formats: string[] }> = {
  instagram: { label: "Instagram", g: "Ig", c: "#C1185B", formats: ["Reel", "Carousel", "Image post", "Story"] },
  tiktok: { label: "TikTok", g: "Tt", c: "#141622", formats: ["Video"] },
  youtube: { label: "YouTube", g: "Yt", c: "#C4000F", formats: ["Short", "Video"] },
  linkedin: { label: "LinkedIn", g: "in", c: "#0A66C2", formats: ["Post", "Document", "Video"] },
  x: { label: "X", g: "X", c: "#3A3F4B", formats: ["Post", "Thread", "Video"] },
  facebook: { label: "Facebook", g: "f", c: "#3B5FD9", formats: ["Post", "Reel", "Video"] },
  threads: { label: "Threads", g: "@", c: "#5B4BC4", formats: ["Post", "Thread"] },
};

export const pf = (k?: string) => PLATFORMS[k ?? ""] ?? { label: k || "Other", g: (k || "?").slice(0, 2), c: "#5C6176", formats: ["Post"] };

/** Formats that become a video edit before they're published. */
export const isVideo = (format?: string) => /Reel|Short|Video|Story|TikTok|Clip/i.test(format ?? "");

export const BRAND_COLORS = ["#3846F0", "#B4532A", "#1E7A46", "#C1185B", "#7A4A2A", "#0A66C2", "#5B4BC4", "#141622"];
