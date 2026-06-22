import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../../../../.env') });

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
    throw new Error('Falta la variable de entorno GOOGLE_AI_API_KEY en el archivo .env');
}

const ai = new GoogleGenAI({ apiKey });

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: "crea un mono peruano astronauta",
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            console.log(part.text);
        } else if (part.inlineData) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync("gemini-native-image.png", buffer);
            console.log("Image saved as gemini-native-image.png");
        }
    }
}

try {
    await main();
} catch (error) {
    console.error('Error al generar contenido:', error);
}