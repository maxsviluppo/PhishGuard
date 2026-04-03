import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = "AIzaSyBBhozzIG7EuyQFhdQmvYwRK8D366enzvE";
const ai = new GoogleGenAI({ apiKey });

async function main() {
  const models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-pro'];
  for (const modelName of models) {
    console.log(`Testing model: ${modelName}`);
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: 'Hello',
      });
      console.log(`Success with ${modelName}:`, response.text);
      return;
    } catch (err: any) {
      console.error(`Error with ${modelName}:`, err.message || JSON.stringify(err));
    }
  }
}

main();
