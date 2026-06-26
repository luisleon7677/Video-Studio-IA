import { Composition } from "remotion";
import { SaleCelebration } from "./scenes/SalesCelebration"
import { CinematicZoomCelebration } from './scenes/CinematicZoomCelebration'

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
        id="CinematicZoomCelebration"
        component={CinematicZoomCelebration}
        durationInFrames={390} // 13 segundos
        fps={30}
        width={1920}
        height={1080}
      />




      <Composition
        id="SaleCelebration"
        component={SaleCelebration}
        durationInFrames={390} // 13 segundos
        fps={30}
        width={1920}
        height={1080}
      />


    </>
  );
};
