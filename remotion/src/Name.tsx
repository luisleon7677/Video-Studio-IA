import { AbsoluteFill } from "remotion";

export const NombreScene = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: 80,
          fontWeight: "bold",
          margin: 0,
          fontFamily: "Arial",
        }}
      >
        Luis Enrique
      </h1>
    </AbsoluteFill>
  );
};