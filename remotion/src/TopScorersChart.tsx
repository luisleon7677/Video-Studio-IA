import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MAX_GOALS, TOP_SCORERS, type Scorer } from "./data/top-scorers";

const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});

const COLORS = {
  background: "#0a0f1a",
  panel: "#111827",
  text: "#f8fafc",
  muted: "#94a3b8",
  axis: "#1e293b",
  bar: "#2563eb",
  barHighlight: "#38bdf8",
  gold: "#fbbf24",
  silver: "#cbd5e1",
  bronze: "#d97706",
};

const REVEAL_SECONDS = 1;
const BAR_AREA_WIDTH = 2200;

const getRevealFrame = (rank: number, fps: number) =>
  (10 - rank) * REVEAL_SECONDS * fps;

const getRankColor = (rank: number) => {
  if (rank === 1) return COLORS.gold;
  if (rank === 2) return COLORS.silver;
  if (rank === 3) return COLORS.bronze;
  return COLORS.muted;
};

const ScorerRow: React.FC<{
  scorer: Scorer;
  maxBarWidth: number;
}> = ({ scorer, maxBarWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealFrame = getRevealFrame(scorer.rank, fps);

  const entryProgress = spring({
    frame: frame - revealFrame,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const barProgress = spring({
    frame: frame - revealFrame - 4,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  if (frame < revealFrame) {
    return null;
  }

  const barWidth = (scorer.goals / MAX_GOALS) * maxBarWidth * barProgress;
  const rowOpacity = interpolate(entryProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rowTranslateX = interpolate(entryProgress, [0, 1], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const goalsOpacity = interpolate(barProgress, [0.35, 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 520px 1fr",
        alignItems: "center",
        gap: 32,
        opacity: rowOpacity,
        transform: `translateX(${rowTranslateX}px)`,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: COLORS.panel,
          border: `2px solid ${getRankColor(scorer.rank)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: getRankColor(scorer.rank),
          fontSize: 34,
          fontWeight: 800,
        }}
      >
        {scorer.rank}
      </div>

      <div
        style={{
          color: COLORS.text,
          fontSize: 42,
          fontWeight: 700,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {scorer.name}
      </div>

      <div
        style={{
          position: "relative",
          height: 72,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: barWidth,
            height: "100%",
            borderRadius: 18,
            background: `linear-gradient(90deg, ${COLORS.bar} 0%, ${COLORS.barHighlight} 100%)`,
            boxShadow: "0 10px 30px rgba(37, 99, 235, 0.35)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 28,
              opacity: goalsOpacity,
            }}
          >
            <span
              style={{
                color: COLORS.text,
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: 0.5,
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.45)",
              }}
            >
              {Math.round(scorer.goals * barProgress).toLocaleString("es-ES")}{" "}
              goles
            </span>
          </div>
        </div>

        {barWidth < maxBarWidth * 0.18 && (
          <span
            style={{
              marginLeft: 24,
              color: COLORS.text,
              fontSize: 38,
              fontWeight: 800,
              opacity: goalsOpacity,
            }}
          >
            {Math.round(scorer.goals * barProgress).toLocaleString("es-ES")} goles
          </span>
        )}
      </div>
    </div>
  );
};

export const TopScorersChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subtitleOpacity = interpolate(frame, [fps * 0.3, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        fontFamily,
        padding: "120px 140px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 72, opacity: titleOpacity }}>
        <div
          style={{
            color: COLORS.text,
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -1.5,
          }}
        >
          Top 10 Goleadores
        </div>
        <div
          style={{
            marginTop: 16,
            color: COLORS.muted,
            fontSize: 38,
            fontWeight: 500,
            opacity: subtitleOpacity,
          }}
        >
          Ranking histórico · Revelado del puesto 10 al 1
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px 0",
        }}
      >
        {TOP_SCORERS.map((scorer) => (
          <ScorerRow
            key={scorer.rank}
            scorer={scorer}
            maxBarWidth={BAR_AREA_WIDTH}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 48,
          height: 2,
          backgroundColor: COLORS.axis,
          width: BAR_AREA_WIDTH + 642,
          marginLeft: "auto",
        }}
      />
    </AbsoluteFill>
  );
};
