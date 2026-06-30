import React from "react";
import { Composition } from "remotion";
import { modernSaleMetadata } from "./templates/ModernSale/metadata";
import { ModernSale } from "./templates/ModernSale";
import { ventaExitosaMetadata } from "./templates/VentaExitosa/metadata";
import { VentaExitosa } from "./templates/VentaExitosa";



export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id={modernSaleMetadata.id}
                component={ModernSale}
                durationInFrames={modernSaleMetadata.durationInFrames}
                fps={modernSaleMetadata.fps}
                width={modernSaleMetadata.width}
                height={modernSaleMetadata.height}
            />
            <Composition
                id={ventaExitosaMetadata.id}
                component={VentaExitosa}
                durationInFrames={ventaExitosaMetadata.durationInFrames}
                fps={ventaExitosaMetadata.fps}
                width={ventaExitosaMetadata.width}
                height={ventaExitosaMetadata.height}
            />
        </>
    );
};
