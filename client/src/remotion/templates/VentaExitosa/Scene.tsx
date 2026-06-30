import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, useCurrentFrame } from "remotion";
import { Confetti } from "../../components/Confetti";
import type { TemplateProps } from "../../types/template";
import { NameCelebration } from "./NameCelebration";

type SceneProps = Pick<TemplateProps, "introVideoUrl" | "nombre">;

export const Scene = ({ introVideoUrl, nombre = "Mi Producto" }: SceneProps) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 150], [1.18, 1.04], {
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.sin(frame / 14) * 0.01;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0c14", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom * pulse})` }}>
        <OffthreadVideo
          src={introVideoUrl ?? ""}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      <Confetti count={80} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <NameCelebration nombre={nombre} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
