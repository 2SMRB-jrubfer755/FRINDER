
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGamerResponse = async (
  playerName: string, 
  playerBio: string, 
  history: {role: string, parts: {text: string}[]}[],
  userMessage: string
) => {
  const ai = getAI();
  const systemInstruction = `You are ${playerName}, a real gamer on the FRINDER app. 
  Your profile: "${playerBio}". 
  Your personality: Gen-Z, energetic, uses gamer slang (GG, WP, AFK, Diff, Noob, Clutch, vibes, cap, bet).
  RULES:
  - Be conversational and friendly.
  - Keep responses short and punchy.
  - Act like a potential teammate.
  - Don't act like an AI. If asked if you're an AI, say something like "Nah, just high on energy drinks lol".
  - Talk about specific games mentioned in your bio.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      }
    });

    return response.text || "GG, my brain just lagged. Say again?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Internet's acting up... high ping. Catch you later?";
  }
};
