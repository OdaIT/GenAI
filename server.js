import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

//formato JSON
const jsonFormat =`
  Retorna o JSON neste formato:
{
  "title": "título conciso e profissional",
  "description": "descrição clara e objetiva",
  "priority": "high/medium/low",
  "tags": ["tag1", "tag2"]
}`

const task = `{
  "title": "Bug no login",
  "description": "login não funciona",
  "priority": "high",
  "tags": ["bug"]
}`

const taskJson = JSON.parse(task);

function createSystemPrompt() {
  return `És um assistente de gestão de tarefas.
Ajudas os utilizadores a criar, refinar e organizar tarefas de forma clara e profissional.
Responde sempre em português e de forma concisa.`;
}

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Gemini API helper function
async function callGemini(userPrompt, temperature = 1, systemIntructions = createSystemPrompt()) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

// AI Helper Functions with Gemini Integration
async function createTaskFromText(text) {
  const prompt = `Transforma o seguinte texto em uma tarefa estruturada no formato JSON. Responde apenas com o JSON, sem texto adicional.

Texto: "${text}, ${jsonFormat}" `;

  try {
    const response = await callGemini(prompt);
    const cleanedResponse = response.replace(/```json\n?|```/g, '').trim();
    console.log('Gemini Response:', cleanedResponse);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Error in createTaskFromText:', error);
    // Fallback to simple processing
    return {
      title: "Tarefa criada via IA",
      description: text,
      priority: "medium",
      tags: ["ia"]
    };
  }
}

async function refineTask(task) {
  const prompt = `Melhora a tarefa existente tornando-a mais clara, completa e profissional. ${jsonFormat} `

  try {
    const response = await callGemini(prompt);
    const cleanedResponse = response.replace(/```json\n?|```/g, '').trim();
    console.log('Gemini Response:', cleanedResponse);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Error in refineTask:', error);
    // Fallback to simple processing
    return {
      title: "Tarefa refinada via IA",
      description: "text",
      priority: "medium",
      tags: ["ia"]
    };
  }
}

async function summarizeTask(task) {
  const prompt = `Resume a description se for longa em uma frase simples e objetiva para facilitar leitura rápida. ${jsonFormat}`

  try {
    const response = await callGemini(prompt);
    const cleanedResponse = response.replace(/```json\n?|```/g, '').trim();
    console.log('Gemini Response:', cleanedResponse);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Error in summarizeTask:', error);
    // Fallback to simple processing
    return {
      title: "Description sumarizada via IA",
      description: "text",
      priority: "medium",
      tags: ["ia"]
    };
  }
}

async function suggestTags(task) {
  const prompt = `Analisa a tarefa e sugere tags relevantes. ${jsonFormat}`

  try {
    const response = await callGemini(prompt);
    const cleanedResponse = response.replace(/```json\n?|```/g, '').trim();
    console.log('Gemini Response:', cleanedResponse);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Error in suggestTags:', error);
    // Fallback to simple processing
    return {
      title: "Suggests tags via IA",
      description: "text",
      priority: "medium",
      tags: ["ia"]
    };
  }
}

async function classifyPriority(task) {
  const prompt = `Classifica a prioridade da tarefa com base nos exemplos abaixo. Responde apenas com: Alta, Média ou Baixa.
    Exemplos:
    "site caiu" -> Alta
    "mudar botão" -> Média
    "trocar favicon" -> Baixa

Tarefa: "${task}. NOTA:${jsonFormat}`;

  const result = await callGemini(prompt);
  return result.trim();
}

async function generateNames(temperature){
    const prompt = `Gera 5 nomes de pessoas aleatoriamente.`
    if (temperature < 2 && temperature >= 0){
        const response = await callGemini(prompt);
        const cleanedResponse = response.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleanedResponse);
    }else{
        return 'Valor tem que ser entre 0.1 e 2'
    }
}

// API Routes

// POST /api/tasks/create
app.post('/api/tasks/create', async (req, res) => {
    try {
        const { text } = req.body;

        // Input validation
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const task = await createTaskFromText(text.trim());

        res.status(201).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error('Error in /api/tasks/create:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/refine', async (req, res) => {
    try {
        const { taskId, text } = req.body;

        if (!taskId || typeof taskId !== 'string' || taskId.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'taskId is required and must be a non-empty string'
            });
        }
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const task = await refineTask(taskId.trim(), text.trim());
        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error in /api/tasks/refine:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/suggest-tags', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const tags = await suggestTags(text.trim());
        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error in /api/tasks/suggest-tags:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/tasks/summarize', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }

        const summary = await summarizeTask(text.trim());
        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Error in /api/tasks/summarize:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});


// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AI Task System API',
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
