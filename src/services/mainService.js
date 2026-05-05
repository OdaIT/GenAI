import { GoogleGenAI } from '@google/genai';
import { jsonFormat, createSystemPrompt } from './src/utils/geminiConfigs.js';

// Gemini API helper function
async function callGemini(userPrompt, temperature = 1, systemIntructions = createSystemPrompt()) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {temperature},
      systemInstruction: {systemIntructions}
    });
    
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to call Gemini API');
  }
}