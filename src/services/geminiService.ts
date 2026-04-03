import { GoogleGenAI, Type } from "@google/genai";

// Ensure VITE_GEMINI_API_KEY is defined in .env
// Helper to get API key from localStorage or env
const getApiKey = () => {
  return localStorage.getItem("phishguard_gemini_api_key") || import.meta.env?.VITE_GEMINI_API_KEY || "";
};

// Default v1beta is used as it supports JSON mode better on all models
const ai = new GoogleGenAI({ 
  apiKey: getApiKey()
});

export interface AnalysisResult {
  reliabilityScore: number;
  threatLevel: "Low" | "Medium" | "High" | "Critical";
  summary: string;
  redFlags: string[];
  senderAnalysis: string;
  linkAnalysis: string;
  recommendations: string[];
}

export interface EmailData {
  sender: string;
  subject: string;
  body: string;
  links: string[];
}

export async function parseEmailContent(rawContent: string): Promise<EmailData> {
  // Local parsing of EML/Text content
  const lines = rawContent.split(/\r?\n/);
  const headers: Record<string, string> = {};
  let bodyIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      bodyIndex = i + 1;
      break;
    }
    const match = line.match(/^([a-zA-Z0-9-]+):\s*(.*)$/i);
    if (match) {
      headers[match[1].toLowerCase()] = match[2];
    }
  }

  const sender = headers["from"] || "Sconosciuto";
  const subject = headers["subject"] || "Nessun Oggetto";
  
  // Extract body and clean it up
  let body = bodyIndex !== -1 ? lines.slice(bodyIndex).join("\n") : rawContent;
  
  // Basic HTML cleanup if present
  body = body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  body = body.replace(/<[^>]*>?/gm, " ");
  body = body.trim();

  // Extract links using regex
  const linkRegex = /https?:\/\/[^\s<>"]+/g;
  const links = body.match(linkRegex) || [];
  const uniqueLinks = Array.from(new Set(links));

  return {
    sender,
    subject,
    body,
    links: uniqueLinks,
  };
}

export async function analyzeMessage(
  text: string,
  sender: string,
  links: string[],
  imageB64?: string
): Promise<AnalysisResult> {
  const currentKey = getApiKey();
  if (!currentKey) {
    throw new Error("Chiave API Gemini mancante. Impostala cliccando sull'icona ingranaggio.");
  }

  const ai = new GoogleGenAI({ 
    apiKey: currentKey,
    apiVersion: 'v1' 
  });

  // Put all instructions in the prompt for maximum compatibility
  const prompt = `
    Sei un esperto di cybersicurezza. Analizza questo messaggio per phishing.
    Rispondi ESCLUSIVAMENTE in formato JSON puro.
    
    Dettagli:
    - Testo: ${text || "Non fornito"}
    - Mittente: ${sender || "Non fornito"}
    - Link: ${links.join(", ") || "Nessuno"}
    
    Formatta il JSON così: 
    { "reliabilityScore": 0-100, "threatLevel": "Low"|"Medium"|"High"|"Critical", "summary": "italiano", "redFlags": [], "senderAnalysis": "", "linkAnalysis": "", "recommendations": [] }
  `;

  const parts: any[] = [{ text: prompt }];
  if (imageB64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageB64.split(",")[1] || imageB64,
      },
    });
  }

  const modelsToTry = ["gemini-1.5-flash", "models/gemini-1.5-flash"];

  let lastError = null;
  for (let modelName of modelsToTry) {
    try {
      console.log(`📡 Analizzando con ${modelName}...`);
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: parts }]
      });

      const resultText = response.text;
      if (!resultText) throw new Error("Risposta AI vuota");

      console.log(`✅ Successo!`);
      const cleanJson = resultText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson) as AnalysisResult;

    } catch (e: any) {
      console.error(`❌ Errore con ${modelName}:`, e.message || e);
      lastError = e;
      if (e.status === 401 || e.status === 403) break;
      continue;
    }
  }

  throw new Error(`Errore API: ${lastError?.message || "Verifica la chiave API."}`);
}
