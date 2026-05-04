import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { jsonFormat, createSystemPrompt } from './src/utils/geminiConfigs.js';

dotenv.config();

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;


const task = `{
  "title": "Bug no login",
  "description": "login não funciona",
  "priority": "high",
  "tags": ["bug"]
}`

const taskJson = JSON.parse(task);


// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

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


// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AI Task System API M7',
        endpoints: [
            'POST /api/tasks/create - Create task from text',
            'POST /api/tasks/refine - Refine existing task',
            'POST /api/tasks/suggest-tags - Suggest tags for task',
            'POST /api/tasks/summarize - Summarize task description'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`GenAI running on http://localhost:${PORT}/`);
});
