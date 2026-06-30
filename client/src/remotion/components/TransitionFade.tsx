import type { ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type TransitionFadeProps = {
  from: ReactNode;
  to: ReactNode;
};

export const TransitionFade = ({ from, to }: TransitionFadeProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - progress }}>{from}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: progress }}>{to}</AbsoluteFill>
    </AbsoluteFill>
  );
};
