import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
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

const palette = ["#F8C537", "#F04F5F", "#32D4A4", "#4CA7FF", "#FFFFFF"];

export const SaleCelebration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const triggerFrame = Math.round(fps * 6);
  const cardExitFrame = triggerFrame + Math.round(fps * 3);
  const outroStart = durationInFrames - Math.round(fps * 0.7);
  const progress = frame / Math.max(1, durationInFrames - 1);
  const celebrationFrame = Math.max(0, frame - triggerFrame);
  const ambientFrame = Math.max(0, frame - Math.round(fps * 0.5));

  const fadeIn = interpolate(frame, [0, fps * 0.7], [0, 1], clamp);
  const fadeOut = interpolate(frame, [outroStart, durationInFrames], [1, 0], clamp);
  const sceneOpacity = fadeIn * fadeOut;

  const celebration = interpolate(
    frame,
    [triggerFrame - fps * 0.25, triggerFrame + fps * 0.45],
    [0, 1],
    clamp
  );
  const ambientCelebration = interpolate(frame, [fps * 0.5, fps * 1.6], [0, 1], clamp);

  const impact = interpolate(
    frame,
    [triggerFrame, triggerFrame + 8, triggerFrame + 22],
    [0, 1, 0],
    clamp
  );

  const shake =
    frame >= triggerFrame && frame <= triggerFrame + 16
      ? Math.sin(frame * 2.8) * interpolate(frame, [triggerFrame, triggerFrame + 16], [13, 0], clamp)
      : 0;

  const cardEntry = spring({
    frame: frame - triggerFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 118,
      mass: 0.75,
    },
  });
  const cardExit = interpolate(frame, [cardExitFrame - 14, cardExitFrame], [1, 0], clamp);

  const cardY = interpolate(cardEntry, [0, 1], [72, 0]);
  const cardScale = interpolate(cardEntry, [0, 1], [0.9, 1]);
  const cardFloat = Math.sin(celebrationFrame / 18) * 4 * celebration;
  const cardPulse = 1 + Math.sin(celebrationFrame / 13) * 0.012 * celebration;

  const backgroundZoom = interpolate(progress, [0, 1], [1.02, 1.09]);
  const videoBrightness = interpolate(ambientCelebration, [0, 1], [0.72, 0.86]);
  const sweepX = interpolate(progress, [0, 1], [-35, 120]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07080C",
        color: "#FFFFFF",
        fontFamily,
        overflow: "hidden",
        opacity: sceneOpacity,
        transform: `translateX(${shake}px)`,
      }}
    >
      <OffthreadVideo
        src={staticFile("ventaBase.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `brightness(${videoBrightness}) saturate(1.24) contrast(1.07)`,
          transform: `scale(${backgroundZoom})`,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(5,7,12,0.78) 0%, rgba(5,7,12,0.38) 47%, rgba(5,7,12,0.86) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.2) 0%, rgba(248,197,55,0.22) 18%, rgba(7,8,12,0) 58%)",
          opacity: ambientCelebration * 0.48,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 58%, rgba(248,197,55,0) 0%, rgba(248,197,55,0.13) 34%, rgba(7,8,12,0) 62%)",
          opacity: ambientCelebration * 0.58,
          transform: `scale(${1 + Math.sin(ambientFrame / 34) * 0.03})`,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(248,197,55,0.34) 0%, rgba(248,197,55,0.12) 28%, rgba(7,8,12,0) 66%)",
          opacity: celebration * 0.75,
          transform: `scale(${1 + impact * 0.28})`,
        }}
      />

      {Array.from({ length: 10 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const top = 12 + ((i * 13) % 68);
        const pulse = 0.35 + Math.sin((ambientFrame + i * 11) / 24) * 0.18;

        return (
          <div
            key={`beam-${i}`}
            style={{
              position: "absolute",
              left: side < 0 ? -120 : undefined,
              right: side > 0 ? -120 : undefined,
              top: `${top}%`,
              width: 620,
              height: 9,
              borderRadius: 999,
              background:
                i % 3 === 0
                  ? "linear-gradient(90deg, rgba(248,197,55,0), rgba(248,197,55,0.72), rgba(248,197,55,0))"
                  : "linear-gradient(90deg, rgba(76,167,255,0), rgba(76,167,255,0.52), rgba(76,167,255,0))",
              filter: "blur(0.4px)",
              opacity: ambientCelebration * pulse,
              transform: `rotate(${side * (18 + (i % 4) * 7)}deg)`,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, transparent ${sweepX - 18}%, rgba(255,255,255,0.2) ${sweepX}%, transparent ${
            sweepX + 18
          }%)`,
          mixBlendMode: "screen",
          opacity: 0.55,
        }}
      />

      {Array.from({ length: 4 }).map((_, i) => {
        const loop = ((ambientFrame + i * 19) % 92) / 92;
        const scale = interpolate(loop, [0, 1], [0.2, 2.35]);
        const opacity =
          ambientCelebration * interpolate(loop, [0, 0.12, 0.78, 1], [0, 0.18, 0.06, 0]) +
          celebration * interpolate(loop, [0, 0.12, 0.78, 1], [0, 0.22, 0.06, 0]);

        return (
          <div
            key={`ring-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "48%",
              width: 520 + i * 110,
              height: 520 + i * 110,
              borderRadius: 999,
              border: `${5 - i}px solid rgba(248,197,55,0.82)`,
              boxShadow: "0 0 34px rgba(248,197,55,0.55)",
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          />
        );
      })}

      {Array.from({ length: 92 }).map((_, i) => {
        const column = (i * 97) % 1920;
        const baseY = -180 - ((i * 43) % 700);
        const speed = 1.1 + (i % 9) * 0.18;
        const travel = ((ambientFrame * speed + i * 31) % 1420) - 160;
        const sway = Math.sin((ambientFrame + i * 12) / 17) * (20 + (i % 5) * 12);
        const rotate = ambientFrame * (2.1 + (i % 7) * 0.45) + i * 23;
        const size = 9 + (i % 5) * 5;
        const isRibbon = i % 3 === 0;
        const edgeMask = column > 650 && column < 1270 ? 0.42 : 1;

        return (
          <div
            key={`confetti-${i}`}
            style={{
              position: "absolute",
              left: column,
              top: baseY + travel,
              width: isRibbon ? size * 2.4 : size,
              height: isRibbon ? size * 0.58 : size * 1.35,
              borderRadius: isRibbon ? 999 : 3,
              background: palette[i % palette.length],
              boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
              opacity:
                ambientCelebration *
                edgeMask *
                interpolate(frame, [fps * 0.5, fps * 2], [0, 0.78], clamp),
              transform: `translateX(${sway}px) rotate(${rotate}deg)`,
            }}
          />
        );
      })}

      {Array.from({ length: 44 }).map((_, i) => {
        const burst = interpolate(
          frame,
          [triggerFrame + 2, triggerFrame + 38, triggerFrame + 76],
          [0, 1, 0.65],
          clamp
        );
        const angle = (i / 44) * Math.PI * 2;
        const distance = interpolate(burst, [0, 1], [20, 620 + (i % 4) * 55]);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <div
            key={`burst-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "49%",
              width: 11,
              height: 11,
              borderRadius: 999,
              background: palette[(i + 1) % palette.length],
              opacity: interpolate(burst, [0, 0.18, 1], [0, 1, 0], clamp),
              transform: `translate(${x}px, ${y}px) scale(${interpolate(burst, [0, 1], [0.5, 1.25])})`,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          padding: "0 54px 46px 0",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 520,
            minHeight: 250,
            borderRadius: 22,
            padding: "24px 26px 26px",
            background:
              "linear-gradient(145deg, rgba(14,16,24,0.92), rgba(24,27,40,0.74))",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow:
              "0 32px 90px rgba(0,0,0,0.46), 0 0 0 8px rgba(248,197,55,0.08), 0 0 84px rgba(248,197,55,0.34)",
            textAlign: "center",
            opacity: interpolate(cardEntry, [0, 0.32, 1], [0, 1, 1], clamp) * cardExit,
            transform: `translateY(${cardY + cardFloat}px) scale(${cardScale * cardPulse})`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              height: 36,
              padding: "0 16px",
              borderRadius: 999,
              background: "rgba(50,212,164,0.16)",
              border: "1px solid rgba(50,212,164,0.44)",
              color: "#7CFFD9",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0,
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#32D4A4",
                boxShadow: "0 0 22px #32D4A4",
              }}
            />
            Venta confirmada
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 40,
              lineHeight: 0.94,
              color: "#FFFFFF",
              fontWeight: 900,
              letterSpacing: 0,
              textShadow: "0 10px 34px rgba(0,0,0,0.42)",
            }}
          >
            VENTA REGISTRADA
          </div>

          <div
            style={{
              height: 4,
              width: 250,
              margin: "16px auto 18px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(240,79,95,0.95), rgba(248,197,55,0.95), rgba(50,212,164,0.95), rgba(76,167,255,0.95))",
              boxShadow: "0 0 32px rgba(248,197,55,0.42)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                borderRadius: 14,
                padding: "14px 16px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.13)",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.62)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Vendedor
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 25,
                  lineHeight: 1.02,
                  color: "#FFFFFF",
                  fontWeight: 900,
                }}
              >
                Juan Perez
              </div>
            </div>

            <div
              style={{
                borderRadius: 14,
                padding: "14px 16px",
                background: "rgba(248,197,55,0.12)",
                border: "1px solid rgba(248,197,55,0.42)",
                textAlign: "left",
                boxShadow: "inset 0 0 34px rgba(248,197,55,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.66)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Numero de venta
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 28,
                  lineHeight: 1,
                  color: "#F8C537",
                  fontWeight: 900,
                  textShadow: "0 0 30px rgba(248,197,55,0.34)",
                }}
              >
                #000154
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 14,
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "linear-gradient(135deg, #F8C537, #F04F5F)",
                boxShadow: "0 0 36px rgba(248,197,55,0.48)",
                transform: `scale(${1 + impact * 0.2})`,
              }}
            />
            Excelente trabajo
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 18%, rgba(0,0,0,0.32) 100%)",
          opacity: 0.55,
        }}
      />

      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: interpolate(frame, [triggerFrame, triggerFrame + 5, triggerFrame + 19], [0, 0.75, 0], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          }),
        }}
      />
    </AbsoluteFill>
  );
};
