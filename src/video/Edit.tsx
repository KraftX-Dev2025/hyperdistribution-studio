import { AbsoluteFill, Img, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Video } from "@remotion/media";
import type { EditSpec, Segment } from "../lib/types";

export type EditProps = {
  spec: EditSpec;
  /** Map of media path -> URL. In the browser these are object URLs from the
   *  connected folder. Leave empty for CLI renders, where files are read from
   *  --public-dir via staticFile(). */
  srcs?: Record<string, string>;
};

export const DIMENSIONS: Record<EditSpec["aspect"], { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "16:9": { width: 1920, height: 1080 },
};

export const totalFrames = (spec: EditSpec) =>
  Math.max(1, spec.segments.reduce((n, s) => n + Math.max(1, Math.round(s.seconds * spec.fps)), 0));

const isImage = (p: string) => /\.(jpe?g|png|webp|gif|avif)$/i.test(p);
const FONT = '"Inter", "Helvetica Neue", Arial, sans-serif';

export const Edit: React.FC<EditProps> = ({ spec, srcs }) => {
  const src = (p: string) => srcs?.[p] ?? staticFile(p);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONT }}>
      <Series>
        {spec.segments.map((seg, i) => (
          <Series.Sequence key={i} durationInFrames={Math.max(1, Math.round(seg.seconds * spec.fps))}>
            {seg.type === "card" ? (
              <Card seg={seg} accent={spec.accent} />
            ) : (
              <Clip seg={seg} url={src(seg.file)} hasMusic={!!spec.music} />
            )}
          </Series.Sequence>
        ))}
      </Series>
      {spec.music ? <Audio src={src(spec.music)} volume={0.7} /> : null}
    </AbsoluteFill>
  );
};

const Card: React.FC<{ seg: Extract<Segment, { type: "card" }>; accent: string }> = ({ seg, accent }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const base = width / 12;
  if (seg.style === "slam") {
    return (
      <AbsoluteFill style={{ background: "#0B0B0F", justifyContent: "center", alignItems: "center", padding: base }}>
        <div style={{ transform: `scale(${interpolate(pop, [0, 1], [1.8, 1])})`, opacity: pop, color: "#fff", fontSize: base * 1.1, fontWeight: 900, lineHeight: 1.05, textAlign: "center", textTransform: "uppercase", letterSpacing: -2 }}>
          {seg.text}
        </div>
        {seg.sub ? <div style={{ marginTop: base / 2, color: accent, fontSize: base / 2.4, fontWeight: 700 }}>{seg.sub}</div> : null}
      </AbsoluteFill>
    );
  }
  if (seg.style === "title") {
    return (
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${accent} 0%, #0B0B0F 70%)`, justifyContent: "center", alignItems: "center", padding: base }}>
        <div style={{ opacity: pop, transform: `translateY(${interpolate(pop, [0, 1], [40, 0])}px)`, color: "#fff", fontSize: base * 0.95, fontWeight: 800, textAlign: "center", lineHeight: 1.1 }}>{seg.text}</div>
        {seg.sub ? <div style={{ opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: base / 2, color: "#fff", fontSize: base / 2.6, fontWeight: 500 }}>{seg.sub}</div> : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: base }}>
      <div style={{ opacity: pop, color: "#fff", fontSize: base * 0.7, fontWeight: 700, textAlign: "center" }}>{seg.text}</div>
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ seg: Extract<Segment, { type: "clip" }>; url: string; hasMusic: boolean }> = ({ seg, url, hasMusic }) => {
  const frame = useCurrentFrame();
  const { fps, width, durationInFrames } = useVideoConfig();
  const base = width / 12;
  const punch = seg.look === "punch" ? interpolate(frame, [0, 6], [1.25, 1.05], { extrapolateRight: "clamp" }) : 1;
  const drift = isImage(seg.file) ? interpolate(frame, [0, durationInFrames], [1, 1.12]) : 1;
  const filter =
    seg.look === "camcorder" ? "saturate(0.6) contrast(1.15) sepia(0.15)" :
    seg.look === "bw" ? "grayscale(1) contrast(1.2)" : "none";
  const media = { width: "100%", height: "100%", objectFit: "cover" as const, transform: `scale(${punch * drift})`, filter };
  const flash = seg.look === "punch" ? interpolate(frame, [0, 4], [0.7, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill>
      {isImage(seg.file) ? (
        <Img src={url} style={media} />
      ) : (
        <Video src={url} trimBefore={Math.round(seg.from * fps)} volume={hasMusic ? 0.25 : 1} style={media} />
      )}
      {seg.look === "camcorder" ? <Camcorder frame={frame} fps={fps} base={base} /> : null}
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
      {seg.caption ? (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: base * 2.6, paddingInline: base }}>
          <div style={{ color: "#fff", fontSize: base * 0.62, fontWeight: 800, textAlign: "center", lineHeight: 1.15, textShadow: "0 3px 0 #000, 0 0 18px rgba(0,0,0,.8)", WebkitTextStroke: "2px #000" }}>
            {seg.caption}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const Camcorder: React.FC<{ frame: number; fps: number; base: number }> = ({ frame, fps, base }) => {
  const secs = Math.floor(frame / fps);
  return (
    <AbsoluteFill style={{ padding: base / 2, color: "#fff", fontFamily: "monospace", fontSize: base / 2.8, textShadow: "0 0 4px #000" }}>
      <div style={{ display: "flex", alignItems: "center", gap: base / 5 }}>
        <span style={{ width: base / 3, height: base / 3, borderRadius: "50%", background: "#f33", opacity: Math.floor(frame / (fps / 2)) % 2 ? 0.2 : 1 }} />
        REC
      </div>
      <div style={{ position: "absolute", right: base / 2, top: base / 2 }}>00:00:{String(secs).padStart(2, "0")}</div>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 2px, transparent 2px 4px)", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};
