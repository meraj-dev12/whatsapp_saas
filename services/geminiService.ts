
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateMessageContent = async (heading: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.reject(new Error("API key is not configured."));
  }
  
  try {
    const prompt = `You are a marketing expert. Write a short, engaging, and friendly message for a WhatsApp broadcast. The main topic or heading is: "${heading}". The message should be concise, clear, and have a compelling call to action if appropriate. Do not include placeholders like "[Your Company Name]".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to generate AI content. Please check the API key and try again.");
  }
};
