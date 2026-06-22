import { ThreeCanvas } from "@remotion/three";
import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

// ─── 3D helpers ──────────────────────────────────────────────────────────────

const RotatingCube: React.FC<{
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
  startFrame?: number;
}> = ({ position, color, size = 1, speed = 0.018, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);
  const entry = spring({ frame: local, fps, config: { damping: 14, stiffness: 80 } });
  const s = entry * size;
  return (
    <mesh
      position={position}
      rotation={[local * speed, local * speed * 0.7, local * speed * 0.4]}
      scale={[s, s, s]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
    </mesh>
  );
};

const RotatingTorus: React.FC<{
  position: [number, number, number];
  color: string;
  startFrame?: number;
}> = ({ position, color, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);
  const entry = spring({ frame: local, fps, config: { damping: 14, stiffness: 60 } });
  return (
    <mesh
      position={position}
      rotation={[local * 0.014, local * 0.02, local * 0.008]}
      scale={[entry, entry, entry]}
    >
      <torusGeometry args={[0.65, 0.13, 16, 50]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
};

const FloatingSphere: React.FC<{
  position: [number, number, number];
  color: string;
  radius?: number;
  startFrame?: number;
}> = ({ position, color, radius = 0.18, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);
  const entry = spring({ frame: local, fps, config: { damping: 12, stiffness: 60 } });
  const floatY = Math.sin(local * 0.055) * 0.22;
  return (
    <mesh
      position={[position[0], position[1] + floatY, position[2]]}
      scale={[entry * radius, entry * radius, entry * radius]}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.18}
      />
    </mesh>
  );
};

const BARS = [
  { quarter: "Q1", value: 0.42, color: "#4f46e5" },
  { quarter: "Q2", value: 0.63, color: "#6366f1" },
  { quarter: "Q3", value: 0.81, color: "#818cf8" },
  { quarter: "Q4", value: 1.0, color: "#a5b4fc" },
] as const;

const SalesBar3D: React.FC<{
  position: [number, number, number];
  targetHeight: number;
  color: string;
  startFrame: number;
}> = ({ position, targetHeight, color, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 16, stiffness: 70 },
  });
  const scaleY = Math.max(targetHeight * progress, 0.001);
  return (
    <mesh position={[position[0], position[1] + scaleY / 2, position[2]]} scale={[1, scaleY, 1]}>
      <boxGeometry args={[0.55, 1, 0.55]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} emissive={color} emissiveIntensity={0.08} />
    </mesh>
  );
};

// ─── Persistent 3D scene ─────────────────────────────────────────────────────

const SalesScene3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} />
      <pointLight position={[-6, 4, -2]} intensity={0.8} color="#4f46e5" />
      <pointLight position={[6, -4, -2]} intensity={0.55} color="#06b6d4" />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#f59e0b" />

      {/* Background cubes */}
      <RotatingCube position={[-5.5, 2.8, -6]} color="#4f46e5" size={0.65} speed={0.012} startFrame={0} />
      <RotatingCube position={[5.5, -2.2, -7]} color="#06b6d4" size={0.5} speed={0.016} startFrame={8} />
      <RotatingCube position={[-4, -3.2, -8]} color="#8b5cf6" size={0.42} speed={0.01} startFrame={4} />
      <RotatingCube position={[4, 3.2, -8]} color="#ec4899" size={0.38} speed={0.019} startFrame={12} />
      <RotatingCube position={[0.5, 4, -9]} color="#f59e0b" size={0.32} speed={0.013} startFrame={6} />

      {/* Hero cube — prominent in slide 1 (right side) */}
      <RotatingCube position={[4.8, 0.2, -1]} color="#4f46e5" size={1.4} speed={0.022} startFrame={3} />

      {/* Torus rings */}
      <RotatingTorus position={[-5, -1, -5]} color="#6366f1" startFrame={20} />
      <RotatingTorus position={[5.2, 1.8, -6]} color="#06b6d4" startFrame={30} />

      {/* Floating particles */}
      <FloatingSphere position={[-6.5, 0.5, -3]} color="#4f46e5" radius={0.28} startFrame={15} />
      <FloatingSphere position={[6.5, -0.5, -4]} color="#06b6d4" radius={0.22} startFrame={22} />
      <FloatingSphere position={[0, -4.5, -5]} color="#8b5cf6" radius={0.2} startFrame={28} />
      <FloatingSphere position={[-2, 4.5, -7]} color="#f59e0b" radius={0.16} startFrame={18} />
      <FloatingSphere position={[3.5, 4.8, -8]} color="#ec4899" radius={0.13} startFrame={35} />

      {/* Bar chart — appears in slide 3 (global frame 195+) */}
      {BARS.map((bar, i) => (
        <SalesBar3D
          key={bar.quarter}
          position={[-1.5 + i * 1.0, -3.5, 0]}
          targetHeight={bar.value * 3.2}
          color={bar.color}
          startFrame={195 + i * 14}
        />
      ))}
    </ThreeCanvas>
  );
};

// ─── HTML slides ─────────────────────────────────────────────────────────────

const Slide1Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEntry = spring({ frame, fps, config: { damping: 18, stiffness: 75 } });
  const titleY = interpolate(titleEntry, [0, 1], [55, 0]);
  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [fps * 0.55, fps * 1.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const tagsOpacity = interpolate(frame, [fps * 1.0, fps * 1.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [fps * 2.5, fps * 3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 110,
        paddingRight: 640,
        opacity: fadeOut,
      }}
    >
      <div style={{ transform: `translateY(${titleY}px)`, opacity: titleOpacity }}>
        <div
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 600,
            color: "#06b6d4",
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Presentación Comercial
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 90,
            fontWeight: 800,
            color: "#f8fafc",
            lineHeight: 1.04,
            letterSpacing: -2,
            textShadow: "0 0 80px rgba(99,102,241,0.35)",
          }}
        >
          Video Studio
          <br />
          <span style={{ color: "#6366f1" }}>IA</span>
        </div>
      </div>

      <div
        style={{
          fontFamily,
          fontSize: 26,
          fontWeight: 400,
          color: "#94a3b8",
          marginTop: 30,
          maxWidth: 540,
          lineHeight: 1.6,
          opacity: subOpacity,
        }}
      >
        Producción de video profesional impulsada por inteligencia artificial
      </div>

      <div
        style={{ marginTop: 50, display: "flex", gap: 14, opacity: tagsOpacity }}
      >
        {["Innovación", "Calidad", "Resultados"].map((tag) => (
          <div
            key={tag}
            style={{
              fontFamily,
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.45)",
              color: "#a5b4fc",
              fontSize: 15,
              fontWeight: 600,
              padding: "8px 22px",
              borderRadius: 100,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const FEATURES = [
  {
    icon: "🎬",
    title: "Producción Profesional",
    desc: "Edición automatizada con calidad cinematográfica en minutos.",
    color: "#4f46e5",
  },
  {
    icon: "🤖",
    title: "IA Integrada",
    desc: "Guiones, locuciones y efectos visuales generados con IA.",
    color: "#06b6d4",
  },
  {
    icon: "📡",
    title: "Distribución Multicanal",
    desc: "Publicación directa a YouTube, Instagram, TikTok y más.",
    color: "#8b5cf6",
  },
] as const;

const Slide2Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [fps * 2.5, fps * 3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleEntry = spring({ frame, fps, config: { damping: 18, stiffness: 70 } });
  const titleY = interpolate(titleEntry, [0, 1], [40, 0]);
  const subOpacity = interpolate(frame, [fps * 0.3, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 120px",
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      <div style={{ fontFamily, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#06b6d4", letterSpacing: 5, textTransform: "uppercase", marginBottom: 12 }}>
          Lo que ofrecemos
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: "#f8fafc", letterSpacing: -1, textShadow: "0 0 60px rgba(99,102,241,0.3)" }}>
          Nuestros Servicios
        </div>
      </div>
      <div
        style={{ fontFamily, fontSize: 20, color: "#94a3b8", marginBottom: 56, marginTop: 14, opacity: subOpacity }}
      >
        Soluciones completas para tu estrategia de contenido
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {FEATURES.map((feat, i) => {
          const cardEntry = spring({
            frame: Math.max(0, frame - i * 14),
            fps,
            config: { damping: 16, stiffness: 70 },
          });
          const cardY = interpolate(cardEntry, [0, 1], [60, 0]);

          return (
            <div
              key={feat.title}
              style={{
                flex: 1,
                background: "rgba(10, 15, 35, 0.72)",
                border: `1px solid ${feat.color}44`,
                borderRadius: 22,
                padding: "36px 36px 40px",
                transform: `translateY(${cardY}px)`,
                opacity: cardEntry,
                boxShadow: `0 0 50px ${feat.color}1a, 0 4px 24px rgba(0,0,0,0.4)`,
              }}
            >
              <div style={{ fontSize: 50, marginBottom: 20 }}>{feat.icon}</div>
              <div style={{ fontFamily, fontSize: 24, fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>
                {feat.title}
              </div>
              <div style={{ fontFamily, fontSize: 17, color: "#94a3b8", lineHeight: 1.65 }}>
                {feat.desc}
              </div>
              <div style={{ marginTop: 28, height: 3, width: 44, borderRadius: 2, background: feat.color }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const STATS = [
  { value: "500+", label: "Clientes Activos", color: "#4f46e5" },
  { value: "10K+", label: "Videos Producidos", color: "#06b6d4" },
  { value: "98%", label: "Satisfacción", color: "#f59e0b" },
  { value: "3x", label: "ROI Promedio", color: "#8b5cf6" },
] as const;

const Slide3Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });
  const titleEntry = spring({ frame, fps, config: { damping: 18, stiffness: 70 } });
  const titleY = interpolate(titleEntry, [0, 1], [40, 0]);
  const subOpacity = interpolate(frame, [fps * 0.35, fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barLabelOpacity = interpolate(frame, [fps * 1.8, fps * 2.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "90px 120px 0",
        opacity: fadeIn,
      }}
    >
      <div style={{ fontFamily, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#06b6d4", letterSpacing: 5, textTransform: "uppercase", marginBottom: 12 }}>
          En Números
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: "#f8fafc", letterSpacing: -1, textShadow: "0 0 60px rgba(99,102,241,0.3)" }}>
          Resultados{" "}
          <span style={{ color: "#6366f1" }}>Comprobados</span>
        </div>
      </div>
      <div style={{ fontFamily, fontSize: 20, color: "#94a3b8", marginTop: 14, marginBottom: 52, opacity: subOpacity }}>
        Números que respaldan nuestra propuesta de valor
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
        {STATS.map((stat, i) => {
          const statEntry = spring({
            frame: Math.max(0, frame - i * 10),
            fps,
            config: { damping: 14, stiffness: 80 },
          });
          const scaleVal = interpolate(statEntry, [0, 1], [0.6, 1]);

          return (
            <div
              key={stat.label}
              style={{
                background: "rgba(10, 15, 35, 0.75)",
                border: `1px solid ${stat.color}44`,
                borderRadius: 20,
                padding: "34px 24px",
                textAlign: "center",
                transform: `scale(${scaleVal})`,
                opacity: statEntry,
                boxShadow: `0 0 50px ${stat.color}18, 0 4px 20px rgba(0,0,0,0.35)`,
              }}
            >
              <div
                style={{
                  fontFamily,
                  fontSize: 54,
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: 10,
                  textShadow: `0 0 30px ${stat.color}66`,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontFamily, fontSize: 15, color: "#94a3b8", fontWeight: 600 }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels aligned with the 3D bar chart below */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 80,
          marginTop: "auto",
          paddingBottom: 52,
          opacity: barLabelOpacity,
        }}
      >
        {BARS.map((bar) => (
          <div key={bar.quarter} style={{ fontFamily, fontSize: 14, color: "#64748b", fontWeight: 600, letterSpacing: 2 }}>
            {bar.quarter}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Slide4CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
  const scaleEntry = spring({ frame, fps, config: { damping: 16, stiffness: 55 } });
  const scaleVal = interpolate(scaleEntry, [0, 1], [0.88, 1]);
  const lineEntry = spring({
    frame: Math.max(0, frame - fps * 0.45),
    fps,
    config: { damping: 20, stiffness: 55 },
  });
  const lineWidth = interpolate(lineEntry, [0, 1], [0, 320]);
  const subOpacity = interpolate(frame, [fps * 1.1, fps * 1.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const emailOpacity = interpolate(frame, [fps * 1.6, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
        transform: `scale(${scaleVal})`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 20,
          fontWeight: 600,
          color: "#06b6d4",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 26,
          opacity: interpolate(frame, [fps * 0.25, fps * 0.7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Da el siguiente paso
      </div>

      <div
        style={{
          fontFamily,
          fontSize: 94,
          fontWeight: 800,
          color: "#f8fafc",
          textAlign: "center",
          lineHeight: 1.04,
          letterSpacing: -2,
          textShadow: "0 0 100px rgba(99,102,241,0.45)",
        }}
      >
        ¿Listo para
        <br />
        <span style={{ color: "#6366f1" }}>Crecer?</span>
      </div>

      <div
        style={{
          marginTop: 50,
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
          borderRadius: 2,
        }}
      />

      <div
        style={{
          fontFamily,
          fontSize: 26,
          fontWeight: 600,
          color: "#94a3b8",
          marginTop: 44,
          opacity: subOpacity,
        }}
      >
        Comienza hoy mismo
      </div>

      <div
        style={{
          fontFamily,
          fontSize: 20,
          color: "#6366f1",
          marginTop: 14,
          letterSpacing: 1,
          opacity: emailOpacity,
        }}
      >
        idiomasibc@gmail.com
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────

export const SalesPresentation: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#07091a" }}>
      {/* Persistent 3D background — runs for full duration */}
      <SalesScene3D />

      {/* Slide 1 · Hero  (0–90) */}
      <Sequence from={0} durationInFrames={90}>
        <Slide1Hero />
      </Sequence>

      {/* Slide 2 · Services  (90–180) */}
      <Sequence from={90} durationInFrames={90}>
        <Slide2Features />
      </Sequence>

      {/* Slide 3 · Stats + 3D bar chart  (180–270) */}
      <Sequence from={180} durationInFrames={90}>
        <Slide3Stats />
      </Sequence>

      {/* Slide 4 · CTA  (270–360) */}
      <Sequence from={270} durationInFrames={90}>
        <Slide4CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
