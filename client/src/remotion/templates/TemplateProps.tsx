import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

export type SaleSceneProps = {
    videoUrl?: string;
    nombre?: string;
  };

const DEFAULT_VIDEO_URL =
  "https://universityibc.s3.us-east-1.amazonaws.com/dashboard/video_studio/plantillas_remotion/testventa.mp4";
const DEFAULT_SELLER_NAME = "Venta Props";

export const SaleScene: React.FC<SaleSceneProps> = ({
  videoUrl = DEFAULT_VIDEO_URL,
  nombre = DEFAULT_SELLER_NAME,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // El texto aparece aproximadamente a la mitad del video
  const startFrame = Math.floor(durationInFrames / 2);

  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: {
      damping: 12,
      stiffness: 120,
    },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const scale = interpolate(progress, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill>

      {/* Video de fondo */}
      <OffthreadVideo
        src={videoUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Capa oscura */}
      <AbsoluteFill
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
      />

      {/* Texto */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity,
            transform: `scale(${scale})`,
            color: "white",
            fontSize: 80,
            fontWeight: "bold",
            textAlign: "center",
            padding: "0 80px",
            textShadow: "0 8px 20px rgba(0,0,0,.6)",
          }}
        >
          Venta de
          <br />
          {nombre}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
