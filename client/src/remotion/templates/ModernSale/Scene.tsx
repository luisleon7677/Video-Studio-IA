import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TemplateProps } from "../../types/template";

type SceneProps = Pick<TemplateProps, "introVideoUrl" | "nombre">;

export const Scene = ({ introVideoUrl, nombre = "Vendedor" }: SceneProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame: frame - fps,
    fps,
    config: {
      damping: 14,
      stiffness: 110,
    },
  });

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={introVideoUrl ?? ""}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "black",
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0,0,0,0.32)",
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 86,
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: "center",
            textShadow: "0 10px 28px rgba(0,0,0,0.55)",
            transform: `translateY(${40 - titleProgress * 40}px) scale(${
              0.94 + titleProgress * 0.06
            })`,
            opacity: titleProgress,
          }}
        >
          Venta de {nombre}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
