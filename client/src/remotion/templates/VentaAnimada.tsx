import React from "react";
import "../styles/VentaAnimada.css";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type VentaAnimadaProps = {
  videoUrl?: string;
  nombre?: string;
};

const DEFAULT_VIDEO_URL =
  "https://universityibc.s3.us-east-1.amazonaws.com/dashboard/video_studio/plantillas_remotion/venta4.mp4";
const DEFAULT_SELLER_NAME = "Luis";

export const VentaAnimada: React.FC<VentaAnimadaProps> = ({
  videoUrl = DEFAULT_VIDEO_URL,
  nombre = DEFAULT_SELLER_NAME,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const buttonScale = spring({
    frame: frame - 70,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
    },
  });

  const zoom =
    frame < 270
      ? 1 + (frame / 270) * 0.12
      : 1.12;

  return (
    <AbsoluteFill className="container">

      <OffthreadVideo
        className="video"
        src={videoUrl}
        style={{
          transform: `scale(${zoom})`,
        }}
      />

      <div className="overlay" />

      <Sequence from={0}>
        <div
          className="titleContainer"
          style={{
            transform: `scale(${titleScale})`,
          }}
        >
          <h1 className="title">
            ¡OFERTA ESPECIAL!
          </h1>

          <p className="subtitle">
            Vendedor: {nombre}
          </p>
        </div>
      </Sequence>

      <Sequence from={70}>
        <div
          className="button"
          style={{
            transform: `scale(${buttonScale})`,
          }}
        >
          COMPRA AHORA
        </div>
      </Sequence>

      <div className="shine" />
    </AbsoluteFill>
  );
};
