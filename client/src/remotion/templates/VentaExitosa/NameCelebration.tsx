import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type NameCelebrationProps = {
  nombre?: string;
};

export const NameCelebration = ({ nombre = "Vendedor" }: NameCelebrationProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.9 },
  });

  const rotateX = interpolate(nameSpring, [0, 1], [70, 0]);
  const translateZ = interpolate(nameSpring, [0, 1], [-400, 0]);
  const nameScale = interpolate(nameSpring, [0, 1], [0.6, 1]);
  const wobble = Math.sin(frame / 9) * 4;

  const subtitleSpring = spring({
    frame: frame - fps * 0.5,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1200,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#FFD700",
          textShadow: "0 4px 18px rgba(0,0,0,0.5)",
          opacity: subtitleSpring,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        ¡Felicidades!
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 110,
          fontWeight: 900,
          color: "white",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX + wobble}deg) translateZ(${translateZ}px) scale(${nameScale})`,
          textShadow:
            "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)",
        }}
      >
        {nombre}
      </div>

      <div
        style={{
          marginTop: 18,
          fontSize: 38,
          fontWeight: 600,
          color: "rgba(255,255,255,0.92)",
          opacity: subtitleSpring,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        ¡Venta realizada con exito!
      </div>
    </div>
  );
};
