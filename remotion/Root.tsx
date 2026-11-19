import { Composition } from "remotion";
import { DIMENSIONS, Edit, totalFrames, type EditProps } from "../src/video/Edit";
import type { EditSpec } from "../src/lib/types";

// Render an edit exported from the app:
//   npx remotion render remotion/index.ts Edit out.mp4 --props=./my-edit.json --public-dir=/path/to/your/media
const sample: EditSpec = {
  title: "Sample",
  aspect: "9:16",
  fps: 30,
  accent: "#3846F0",
  segments: [
    { type: "card", style: "slam", text: "One idea.", sub: "Every channel.", seconds: 2 },
    { type: "card", style: "title", text: "Distribution", sub: "Plan, script and edit in one place", seconds: 3 },
  ],
};

export const Root: React.FC = () => (
  <Composition
    id="Edit"
    component={Edit as React.FC<Record<string, unknown>>}
    defaultProps={{ spec: sample } as unknown as Record<string, unknown>}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={150}
    calculateMetadata={({ props }) => {
      const { spec } = props as unknown as EditProps;
      return { fps: spec.fps, durationInFrames: totalFrames(spec), ...DIMENSIONS[spec.aspect] };
    }}
  />
);
