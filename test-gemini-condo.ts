import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = "AIzaSyBBhozzIG7EuyQFhdQmvYwRK8D366enzvE"; // The CONDOAI key
const ai = new GoogleGenAI({ apiKey });

async function main() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'];
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
