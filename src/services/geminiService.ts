import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    Analizza il seguente contenuto grezzo di un'e-mail (formato EML o testo semplice) ed estrai le seguenti informazioni:
    - Mittente (indirizzo email o nome)
    - Oggetto dell'e-mail
    - Corpo principale del messaggio (testo pulito)
    - Tutti i link (URL) trovati nel messaggio
    
    Restituisci i dati in formato JSON con i campi: sender, subject, body, links (array di stringhe).
    
    Contenuto e-mail:
    ---
    ${rawContent}
    ---
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sender: { type: Type.STRING },
          subject: { type: Type.STRING },
          body: { type: Type.STRING },
          links: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["sender", "subject", "body", "links"],
      },
    },
  });

  try {
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as EmailData;
  } catch (e) {
    console.error("Failed to parse email content", e);
    throw new Error("Errore durante l'estrazione dei dati dall'e-mail.");
  }
}

export async function analyzeMessage(
  text: string,
  sender: string,
  links: string[],
  imageB64?: string
): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    Analizza questo messaggio per potenziale phishing, smishing o altre minacce informatiche.
    
    Dettagli forniti:
    - Testo del messaggio: ${text || "Non fornito"}
    - Mittente dichiarato: ${sender || "Non fornito"}
    - Link inclusi: ${links.join(", ") || "Nessuno"}
    
    Se è presente un'immagine, analizzala per cercare elementi visivi sospetti (loghi contraffatti, errori di formattazione, urgenza artificiale).
    
    Restituisci un'analisi dettagliata in formato JSON con i seguenti campi:
    - reliabilityScore: un numero da 0 a 100 (dove 100 è totalmente affidabile, 0 è una truffa certa).
    - threatLevel: "Low", "Medium", "High", "Critical".
    - summary: un breve riassunto dell'analisi in italiano.
    - redFlags: una lista di segnali di allarme riscontrati.
    - senderAnalysis: analisi specifica del mittente.
    - linkAnalysis: analisi specifica dei link forniti.
    - recommendations: cosa dovrebbe fare l'utente.
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

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reliabilityScore: { type: Type.NUMBER },
          threatLevel: { type: Type.STRING },
          summary: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          senderAnalysis: { type: Type.STRING },
          linkAnalysis: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["reliabilityScore", "threatLevel", "summary", "redFlags", "senderAnalysis", "linkAnalysis", "recommendations"],
      },
    },
  });

  try {
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Errore durante l'analisi del messaggio.");
  }
}
