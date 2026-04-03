import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = "AIzaSyBQk0ASh35YWvPoACz82uN-3yYlnd1_zHo"; // The BIOEXPERT key (which worked!)
const ai = new GoogleGenAI({ apiKey });

async function main() {
  console.log("Testing with default apiVersion (v1beta)...");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Return {"hello": "world"} as JSON.',
      config: {
        responseMimeType: "application/json",
      },
    });
    console.log("Success with v1beta:", response.text);
  } catch (err: any) {
    console.error("Error with default (v1beta):", err.message || JSON.stringify(err));
    
    console.log("\nTrying with snake_case response_mime_type...");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: 'Return {"hello": "world"} as JSON.',
            config: {
                // @ts-ignore
                response_mime_type: "application/json",
            },
        });
        console.log("Success with snake_case:", response.text);
    } catch (err2: any) {
        console.error("Error with snake_case:", err2.message || JSON.stringify(err2));
    }
  }
}

main();
