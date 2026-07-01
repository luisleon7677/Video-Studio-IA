import React from "react";
import { Audio, Sequence, useVideoConfig } from "remotion";

type BackgroundMusicProps = {
  music?: string;
  musicStart?: number;
  musicDuration?: number;
};

export function BackgroundMusic({
  music,
  musicStart = 0,
  musicDuration = 0,
}: BackgroundMusicProps) {
  const { fps, durationInFrames } = useVideoConfig();

  if (!music || musicDuration <= 0) {
    return null;
  }

  const startFrom = Math.max(0, Math.round(musicStart * fps));
  const durationFrames = Math.max(1, Math.round(musicDuration * fps));
  const endAt = startFrom + durationFrames;

  return (
    <Sequence durationInFrames={Math.min(durationFrames, durationInFrames)}>
      <Audio src={music} startFrom={startFrom} endAt={endAt} />
    </Sequence>
  );
}
