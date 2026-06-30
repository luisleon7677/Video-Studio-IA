import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import "../styles/Cinema.css";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const colors = ["#F8C537", "#48A8FF", "#32D4A4", "#F04F5F", "#FFFFFF"];

type CinematicZoomCelebrationProps = {
  videoUrl?: string;
  nombre?: string;
};

export const CinematicZoomCelebration: React.FC<CinematicZoomCelebrationProps> = ({
  videoUrl,
  nombre = "Juan Perez",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = frame / Math.max(1, durationInFrames - 1);
  const saleMoment = Math.round(fps * 6);
  const badgeOut = saleMoment + Math.round(fps * 3);
  const cinematicPush = Math.round(durationInFrames * 0.68);
  const outroStart = durationInFrames - Math.round(fps * 0.75);

  const fadeIn = interpolate(frame, [0, fps * 0.55], [0, 1], clamp);
  const fadeOut = interpolate(frame, [outroStart, durationInFrames], [1, 0], clamp);
  const sceneOpacity = fadeIn * fadeOut;

  const ambient = interpolate(frame, [fps * 0.5, fps * 1.6], [0, 1], clamp);
  const saleEnergy = interpolate(frame, [saleMoment - fps * 0.25, saleMoment + fps * 0.55], [0, 1], clamp);
  const impact = interpolate(frame, [saleMoment, saleMoment + 7, saleMoment + 24], [0, 1, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  const baseZoom = interpolate(progress, [0, 1], [1.02, 1.085]);
  const pushZoom = interpolate(frame, [cinematicPush, cinematicPush + fps * 1.2], [0, 0.035], clamp);
  const impactZoom = interpolate(impact, [0, 1], [0, 0.032]);
  const scale = baseZoom + pushZoom + impactZoom;

  const translateX = interpolate(progress, [0, 1], [0, -18]);
  const translateY = interpolate(progress, [0, 1], [0, -8]);
  const shake =
    frame >= saleMoment && frame <= saleMoment + 15
      ? Math.sin(frame * 2.6) * interpolate(frame, [saleMoment, saleMoment + 15], [8, 0], clamp)
      : 0;

  const videoBrightness = interpolate(ambient, [0, 1], [0.86, 1.02]) + impact * 0.08;
  const blur = interpolate(impact, [0, 1], [0, 1.8]);
  const sweepX = interpolate(progress, [0, 1], [-28, 124]);

  const badgeSpring = spring({
    frame: frame - saleMoment,
    fps,
    config: {
      damping: 16,
      stiffness: 130,
      mass: 0.72,
    },
  });
  const badgeExit = interpolate(frame, [badgeOut - 15, badgeOut], [1, 0], clamp);
  const badgeOpacity = interpolate(badgeSpring, [0, 0.34, 1], [0, 1, 1], clamp) * badgeExit;

  return (
    <AbsoluteFill
      className="cinemaScene"
      style={{
        fontFamily,
        opacity: sceneOpacity,
      }}
    >
      <AbsoluteFill
        className="cinemaScene__videoLayer"
        style={{
          filter: `brightness(${videoBrightness}) contrast(1.09) saturate(1.18) blur(${blur}px)`,
          transform: `translate(${translateX + shake}px, ${translateY}px) scale(${scale})`,
        }}
      >
        <OffthreadVideo className="cinemaScene__video" src={videoUrl ?? staticFile("ventaBase.mp4")} />
      </AbsoluteFill>

      <AbsoluteFill className="cinemaScene__sideShade" />

      <AbsoluteFill
        className="cinemaScene__ambientGlow"
        style={{
          opacity: ambient * 0.78,
        }}
      />

      <AbsoluteFill
        className="cinemaScene__saleGlow"
        style={{
          opacity: saleEnergy * 0.7,
          transform: `scale(${1 + impact * 0.2})`,
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(108deg, transparent ${sweepX - 14}%, rgba(255,255,255,0.18) ${sweepX}%, transparent ${
            sweepX + 14
          }%)`,
          mixBlendMode: "screen",
          opacity: 0.48,
        }}
      />

      {Array.from({ length: 9 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const top = 10 + ((i * 15) % 74);
        const pulse = 0.36 + Math.sin((frame + i * 14) / 26) * 0.16;

        return (
          <div
            key={`cinematic-beam-${i}`}
            className={`cinemaScene__beam ${
              i % 3 === 0 ? "cinemaScene__beam--gold" : "cinemaScene__beam--blue"
            }`}
            style={{
              left: side < 0 ? -150 : undefined,
              right: side > 0 ? -150 : undefined,
              top: `${top}%`,
              opacity: ambient * pulse,
              transform: `rotate(${side * (16 + (i % 4) * 7)}deg)`,
            }}
          />
        );
      })}

      {Array.from({ length: 4 }).map((_, i) => {
        const local = ((frame + i * 23) % 104) / 104;
        const size = 420 + i * 150;
        const opacity =
          ambient * interpolate(local, [0, 0.14, 0.78, 1], [0, 0.17, 0.06, 0]) +
          saleEnergy * interpolate(local, [0, 0.14, 0.78, 1], [0, 0.18, 0.05, 0]);

        return (
          <div
            key={`focus-ring-${i}`}
            className="cinemaScene__focusRing"
            style={{
              width: size,
              height: size,
              border: `${4 - i * 0.55}px solid rgba(248,197,55,0.64)`,
              opacity,
              transform: `translate(-50%, -50%) scale(${interpolate(local, [0, 1], [0.4, 1.85])})`,
            }}
          />
        );
      })}

      {Array.from({ length: 78 }).map((_, i) => {
        const x = (i * 131) % 1920;
        const baseY = -140 - ((i * 41) % 540);
        const fall = ((frame * (1 + (i % 8) * 0.13) + i * 29) % 1330) - 130;
        const centerMask = x > 720 && x < 1240 ? 0.45 : 1;
        const size = 8 + (i % 5) * 4;
        const sway = Math.sin((frame + i * 10) / 18) * (18 + (i % 4) * 11);

        return (
          <div
            key={`cinematic-confetti-${i}`}
            className="cinemaScene__confetti"
            style={{
              left: x,
              top: baseY + fall,
              width: i % 3 === 0 ? size * 2.1 : size,
              height: i % 3 === 0 ? size * 0.55 : size * 1.2,
              borderRadius: i % 3 === 0 ? 999 : 3,
              backgroundColor: colors[i % colors.length],
              opacity: ambient * centerMask * 0.72,
              transform: `translateX(${sway}px) rotate(${frame * (2 + (i % 6) * 0.4) + i * 21}deg)`,
            }}
          />
        );
      })}

      {Array.from({ length: 34 }).map((_, i) => {
        const burst = interpolate(frame, [saleMoment + 2, saleMoment + 32, saleMoment + 64], [0, 1, 0], clamp);
        const angle = (i / 34) * Math.PI * 2;
        const distance = interpolate(burst, [0, 1], [18, 500 + (i % 4) * 48]);

        return (
          <div
            key={`sale-burst-${i}`}
            className="cinemaScene__burst"
            style={{
              backgroundColor: colors[(i + 2) % colors.length],
              opacity: interpolate(burst, [0, 0.22, 1], [0, 0.95, 0], clamp),
              transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
            }}
          />
        );
      })}

      <AbsoluteFill
        className="cinemaScene__badgeLayout"
      >
        <div
          className="cinemaScene__badge"
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${interpolate(badgeSpring, [0, 1], [60, 0])}px) scale(${interpolate(
              badgeSpring,
              [0, 1],
              [0.92, 1]
            )})`,
          }}
        >
          <div className="cinemaScene__status">
            <span className="cinemaScene__statusDot" />
            Venta confirmada
          </div>

          <div className="cinemaScene__title">
            Venta exitosa
          </div>

          <div className="cinemaScene__meta">
            <div>
              <div className="cinemaScene__label">
                Vendedor
              </div>
              <div className="cinemaScene__seller">
                {nombre}
              </div>
            </div>

            <div className="cinemaScene__saleCode">
              #000158
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        className="cinemaScene__flash"
        style={{
          opacity: interpolate(frame, [saleMoment, saleMoment + 5, saleMoment + 18], [0, 0.6, 0], clamp),
        }}
      />

      <AbsoluteFill className="cinemaScene__topShade" />
    </AbsoluteFill>
  );
};
