import { AbsoluteFill, OffthreadVideo } from "remotion";

type OutroProps = {
  videoUrl: string;
};

export const Outro = ({ videoUrl }: OutroProps) => {
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={videoUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "black",
        }}
      />
    </AbsoluteFill>
  );
};
