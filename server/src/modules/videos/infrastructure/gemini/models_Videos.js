import dotenv from 'dotenv';
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
    const prompt = "crea un video de 10 seg donde una personas este domindando el balon en el area de juego";

    const operation = await ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt,
    });

    const videos = await waitForVideoOperation(operation);
    const generatedVideo = videos[0];

    if (!generatedVideo?.video) {
        throw new Error('El video generado no incluye datos descargables.');
    }

    const outputPath = resolve(__dirname, "dialogue_example.mp4");

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