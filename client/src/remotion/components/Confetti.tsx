import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type ConfettiProps = {
  count?: number;
  startFrame?: number;
  colors?: string[];
};

type Particle = {
  x: number;
  delay: number;
  fallDuration: number;
  size: number;
  color: string;
  rotationSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  shape: "rect" | "circle";
};

const DEFAULT_COLORS = [
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#A78BFA",
  "#34D399",
  "#FB923C",
  "#F472B6",
];

// PRNG seeded por indice para que cada frame renderizado (incluso en procesos
// distintos durante el render) genere exactamente las mismas particulas.
function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const Confetti = ({ count = 70, startFrame = 0, colors = DEFAULT_COLORS }: ConfettiProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: seededRandom(i * 7 + 1) * 100,
      delay: Math.floor(seededRandom(i * 13 + 2) * fps * 1.5),
      fallDuration: Math.floor(fps * (2.2 + seededRandom(i * 19 + 3) * 1.8)),
      size: 8 + seededRandom(i * 23 + 4) * 14,
      color: colors[i % colors.length],
      rotationSpeed: (seededRandom(i * 29 + 5) - 0.5) * 18,
      swayAmplitude: 20 + seededRandom(i * 31 + 6) * 40,
      swaySpeed: 0.05 + seededRandom(i * 37 + 7) * 0.05,
      shape: i % 2 === 0 ? "rect" : "circle",
    }));
  }, [count, colors, fps]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((particle, i) => {
        const localFrame = frame - startFrame - particle.delay;
        if (localFrame < 0) return null;

        const progress = interpolate(localFrame, [0, particle.fallDuration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const y = -10 + progress * 120;
        const sway = Math.sin(localFrame * particle.swaySpeed) * particle.swayAmplitude;
        const rotation = localFrame * particle.rotationSpeed;
        const opacity = interpolate(progress, [0, 0.05, 0.85, 1], [0, 1, 1, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${particle.x}% + ${sway}px)`,
              top: `${y}%`,
              width: particle.size,
              height: particle.shape === "rect" ? particle.size * 0.4 : particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.shape === "circle" ? "50%" : 2,
              transform: `rotate(${rotation}deg)`,
              opacity,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
