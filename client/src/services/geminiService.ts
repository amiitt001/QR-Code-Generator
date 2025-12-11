import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateSmartQRData = async (prompt: string): Promise<{ type: string; data: string; summary: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an intelligent assistant that helps formatting data for QR codes. 
      Analyze the user's input and determine if they want a vCard (contact info), a Wi-Fi configuration, or just plain text/URL.
      
      User Input: "${prompt}"
      
      1. If it looks like contact information (names, phones, emails, job titles), format it as a valid, standard vCard 3.0 string.
      2. If it looks like Wi-Fi credentials (SSID, password), format it as a WIFI string (format: WIFI:T:WPA;S:mynetwork;P:mypass;;). Assume WPA unless specified otherwise.
      3. If it is a request to summarize or clean up a URL or text, do that.
      
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "One of: 'vcard', 'wifi', 'text'" },
            data: { type: Type.STRING, description: "The formatted string ready for the QR code value" },
            summary: { type: Type.STRING, description: "A short description of what was generated (e.g. 'Contact card for John Doe')" }
          },
          required: ["type", "data", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate smart data");
  }
};