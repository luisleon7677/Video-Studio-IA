import React from "react";
import { Composition } from "remotion";
import { CinematicZoomCelebration } from './templates/Cinema'
import { VentaAnimada } from "./templates/VentaAnimada";
import { VentaSimple } from "./templates/VentaSimple";
import { SaleScene } from "./templates/TemplateProps";


export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="sale-scene"
                component={SaleScene}
                durationInFrames={300}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    videoUrl: "https://universityibc.s3.us-east-1.amazonaws.com/dashboard/video_studio/plantillas_remotion/testventa.mp4",
                    nombre: "Venta Props",
                }}
            />

            <Composition
                id="CinematicZoomCelebration"
                component={CinematicZoomCelebration}
                durationInFrames={390} // 13 segundos
                fps={30}
                width={1920}
                height={1080}
            />

            <Composition
                id="VentaAnimada"
                component={VentaAnimada}
                durationInFrames={390} // 13 segundos
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="VentaSimple"
                component={VentaSimple}
                durationInFrames={390}
                fps={30}
                width={1080}
                height={1920}
            />

        </>
    );
};
