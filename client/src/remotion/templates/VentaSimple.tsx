import React from "react";
import {
    AbsoluteFill,
    OffthreadVideo,
    Sequence,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
  } from "remotion";
  import "../styles/VentaSimple.css";

  type VentaSimpleProps = {
    videoUrl?: string;
    nombre?: string;
  };

  const DEFAULT_SELLER_NAME = "Luis";
  
  export const VentaSimple: React.FC<VentaSimpleProps> = ({
    videoUrl,
    nombre = DEFAULT_SELLER_NAME,
  }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
  
    const badge = spring({
      frame,
      fps,
      config: {
        damping: 12,
        stiffness: 120,
      },
    });
  
    const title = spring({
      frame: frame - 20,
      fps,
      config: {
        damping: 12,
        stiffness: 120,
      },
    });
  
    const button = spring({
      frame: frame - 170,
      fps,
      config: {
        damping: 10,
        stiffness: 120,
      },
    });
  
    return (
      <AbsoluteFill className="vs-container">
        <OffthreadVideo
          className="vs-video"
          src={videoUrl ?? staticFile("ventaBase.mp4")}
        />
  
        <div className="vs-overlay" />
  
        <div className="vs-content">
          <div
            className="vs-badge"
            style={{
              transform: `scale(${badge})`,
            }}
          >
            NUEVO
          </div>
  
          <div
            className="vs-title"
            style={{
              transform: `translateY(${40 - title * 40}px)`,
              opacity: title,
            }}
          >
            El producto que estabas buscando
          </div>
          <div className="vs-title" style={{ fontSize: 42 }}>
            {nombre}
          </div>
  
          <Sequence from={60}>
            <div className="vs-list">
              <div>✔ Calidad garantizada</div>
              <div>✔ Envío rápido</div>
              <div>✔ Oferta limitada</div>
            </div>
          </Sequence>
  
          <Sequence from={170}>
            <div
              className="vs-button"
              style={{
                transform: `scale(${button})`,
              }}
            >
              COMPRAR AHORA
            </div>
          </Sequence>
        </div>
      </AbsoluteFill>
    );
  };
