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

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: "dime cual es la capital de Peru y redacta un texto de 100 palabras sobre esa ciudad",
  });

  console.log(response.text);
}

try {
  await main();
} catch (error) {
  console.error('Error al generar contenido:', error);
}