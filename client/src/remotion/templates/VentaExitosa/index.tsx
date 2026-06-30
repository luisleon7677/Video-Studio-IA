import React from "react";
import { Sequence, staticFile } from "remotion";
import { Outro } from "../../components/Outro";
import { TransitionFade } from "../../components/TransitionFade";
import { INTRO_FRAMES, OUTRO_FRAMES, TRANSITION_FRAMES } from "../../constants/timeline";
import type { TemplateProps } from "../../types/template";
import { Scene } from "./Scene";

const DEFAULT_NAME = "Mi Producto";

export const VentaExitosa = ({
  nombre = DEFAULT_NAME,
  introVideoUrl,
  outroVideoUrl,
}: TemplateProps) => {
  const resolvedIntroVideoUrl =
    introVideoUrl ?? staticFile("videos/default-intro.mp4");
  const resolvedOutroVideoUrl =
    outroVideoUrl ?? staticFile("videos/default-outro.mp4");

  return (
    <>
      <Sequence durationInFrames={INTRO_FRAMES}>
        <Scene introVideoUrl={resolvedIntroVideoUrl} nombre={nombre} />
      </Sequence>

      <Sequence from={INTRO_FRAMES} durationInFrames={TRANSITION_FRAMES}>
        <TransitionFade
          from={<Scene introVideoUrl={resolvedIntroVideoUrl} nombre={nombre} />}
          to={<Outro videoUrl={resolvedOutroVideoUrl} />}
        />
      </Sequence>

      <Sequence from={INTRO_FRAMES + TRANSITION_FRAMES} durationInFrames={OUTRO_FRAMES}>
        <Outro videoUrl={resolvedOutroVideoUrl} />
      </Sequence>
    </>
  );
};
