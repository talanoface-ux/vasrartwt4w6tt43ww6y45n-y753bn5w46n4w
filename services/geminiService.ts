import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Message, Role, SafetyLevel } from '../types';

// NOTE: The API key is sourced from `process.env.API_KEY`, which is assumed
// to be set in the execution environment. Do not add any UI for it.
const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

const safetyLevelMap: Record<SafetyLevel, HarmBlockThreshold> = {
  [SafetyLevel.DEFAULT]: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  [SafetyLevel.RELAXED]: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  [SafetyLevel.NO_FILTERS]: HarmBlockThreshold.BLOCK_NONE,
};

export const getChatResponse = async (
  messages: Message[],
  systemInstruction: string,
  safetyLevel: SafetyLevel
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const modelMessages = messages
        .filter(m => m.role !== Role.SYSTEM) // Gemini API uses a dedicated systemInstruction field
        .map(m => ({
            role: m.role === Role.ASSISTANT ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));
    
    const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: safetyLevelMap[safetyLevel] || HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: safetyLevelMap[safetyLevel] || HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: safetyLevelMap[safetyLevel] || HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: safetyLevelMap[safetyLevel] || HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: modelMessages,
        config: {
            systemInstruction: systemInstruction,
            temperature: 1.0,
            topP: 0.9,
            safetySettings: safetySettings,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('SAFETY')) {
            return `The response was blocked due to safety settings. You can try adjusting the "Safety Level" in the Advanced Settings.`;
        }
        return `An error occurred: ${error.message}. Please check your API key and network connection.`;
    }
    return "An unknown error occurred.";
  }
};