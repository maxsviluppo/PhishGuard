import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = "AIzaSyBQk0ASh35YWvPoACz82uN-3yYlnd1_zHo"; // CondoAI key
const ai = new GoogleGenAI({ apiKey });

async function main() {
  try {
    console.log("Listing models...");
    const response = await ai.models.list();
    console.log("Models found:", JSON.stringify(response.models, null, 2));
  } catch (err: any) {
    console.error("Error listing models:", err.message || JSON.stringify(err));
  }
}

main();
