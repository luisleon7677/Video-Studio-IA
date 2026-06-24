import { Composition, staticFile } from "remotion";
import { Scene, myCompSchema } from "./Scene";
import { TopScorersChart } from "./TopScorersChart";
import { SalesPresentation } from "./SalesPresentation";
import { getMediaMetadata } from "./helpers/get-media-metadata";
import { NombreScene } from "./Name";
import { VideoBackground } from "./VideoScene"

// Welcome to the Remotion Three Starter Kit!
// Two compositions have been created, showing how to use
// the `ThreeCanvas` component and the `useVideoTexture` hook.

// You can play around with the example or delete everything inside the canvas.

// Remotion Docs:
// https://remotion.dev/docs

// @remotion/three Docs:
// https://remotion.dev/docs/three

// React Three Fiber Docs:
// https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

export const RemotionRoot: React.FC = () => {
  return (
    <>


      <Composition
        id="VideoBackground"
        component={VideoBackground}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
      />


      <Composition
        id="NombreScene"
        component={NombreScene}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SalesPresentation"
        component={SalesPresentation}
        fps={30}
        durationInFrames={360}
        width={1920}
        height={1080}
      />
      <Composition
        id="TopScorersChart"
        component={TopScorersChart}
        fps={30}
        durationInFrames={300}
        width={3840}
        height={2160}
      />
      <Composition
        id="Scene"
        component={Scene}
        fps={30}
        durationInFrames={300}
        width={1280}
        height={720}
        schema={myCompSchema}
        defaultProps={{
          deviceType: "phone",
          phoneColor: "rgba(110, 152, 191, 0.00)" as const,
          baseScale: 1,
          mediaMetadata: null,
          videoSrc: null,
        }}
        calculateMetadata={async ({ props }) => {
          const videoSrc =
            props.deviceType === "phone"
              ? staticFile("phone.mp4")
              : staticFile("tablet.mp4");

          const mediaMetadata = await getMediaMetadata(videoSrc);

          return {
            props: {
              ...props,
              mediaMetadata,
              videoSrc,
            },
          };
        }}
      />
    </>
  );
};
