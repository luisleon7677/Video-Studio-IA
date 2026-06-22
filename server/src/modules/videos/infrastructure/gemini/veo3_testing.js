import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from "@google/genai";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../../../../.env') });

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
    throw new Error('Falta la variable de entorno GOOGLE_AI_API_KEY en el archivo .env');
}

const ai = new GoogleGenAI({ apiKey });

const POLL_INTERVAL_MS = 10_000;
const MAX_POLLS = 36; // ~6 minutos

function loadImage(filename) {
    const imagePath = resolve(__dirname, filename);

    return {
        imageBytes: readFileSync(imagePath).toString("base64"),
        mimeType: "image/png",
    };
}

/**
 * Añade aquí las imágenes de referencia (rutas relativas a esta carpeta).
 * referenceType: "asset" para objetos/prendas, "style" para estilo visual.
 */
const REFERENCE_IMAGES_CONFIG = [
    { file: "chica.png", referenceType: "asset" },
    { file: "ecenario2.jpeg", referenceType: "asset" },
    { file: "hulk.png", referenceType: "asset" },
];

function buildReferenceImages(config) {
    return config.map(({ file, referenceType }) => {
        console.log(`Cargando imagen de referencia: ${file}`);
        return {
            image: loadImage(file),
            referenceType,
        };
    });
}

async function waitForVideoOperation(initialOperation) {
    let operation = initialOperation;
    let polls = 0;

    while (!operation.done) {
        if (polls >= MAX_POLLS) {
            throw new Error('Tiempo de espera agotado: la generación del video no terminó a tiempo.');
        }

        console.log(`Esperando generación del video... (${polls + 1}/${MAX_POLLS})`);
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        operation = await ai.operations.getVideosOperation({ operation });
        polls += 1;
    }

    if (operation.error) {
        throw new Error(`La generación falló: ${JSON.stringify(operation.error)}`);
    }

    const videos = operation.response?.generatedVideos;

    if (!videos?.length) {
        const filteredReasons = operation.response?.raiMediaFilteredReasons;
        const filteredCount = operation.response?.raiMediaFilteredCount;

        if (filteredCount || filteredReasons?.length) {
            throw new Error(
                `El video fue bloqueado por políticas de contenido (RAI). ` +
                `Filtrados: ${filteredCount ?? 0}. Motivos: ${filteredReasons?.join(', ') ?? 'no especificados'}`,
            );
        }

        throw new Error(
            'La operación terminó sin videos. Revisa el prompt (figuras públicas, marcas o contenido restringido suelen bloquearse).',
        );
    }

    return videos;
}

async function main() {
    const prompt =
        "Usas esas tres imagenes para generar un video de celebración, pero la persona debe ingresar su codigo y presionarl e boton para comenzar a celebrar";

    if (!REFERENCE_IMAGES_CONFIG.length) {
        throw new Error("Debes definir al menos una imagen en REFERENCE_IMAGES_CONFIG");
    }

    const referenceImages = buildReferenceImages(REFERENCE_IMAGES_CONFIG);
    console.log(`${referenceImages.length} imagen(es) de referencia cargada(s)`);

    const operation = await ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt,
        config: {
            referenceImages,
            resolution: "4k"
        },
    });

    const videos = await waitForVideoOperation(operation);
    const generatedVideo = videos[0];

    if (!generatedVideo?.video) {
        throw new Error('El video generado no incluye datos descargables.');
    }

    const outputPath = resolve(__dirname, "video3_final.mp4");

    await ai.files.download({
        file: generatedVideo.video,
        downloadPath: outputPath,
    });

    console.log(`Video guardado en ${outputPath}`);
}

try {
    await main();
} catch (error) {
    console.error('Error al generar contenido:', error);
}