import { callGemini } from './geminiService.js';
import { jsonFormat } from '../utils/geminiConfigs.js';
import getChatHistory from './chatHistoryService.js';

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

async function generateResume(history, previousResumes){
    const previousContext = previousResumes.length > 0
        ? `Estes são os resumos anteriores:\n${previousResumes.join('\n')}\n\n`
        : '';
    const prompt = `${previousContext}Gera um resumo do historico de mensagens abaixo:\n${history.map(msg => `${msg.user}: ${msg.bot}`).join('\n')}`;
    const response = await callGemini(prompt);
    return response.trim();
}


export { createTaskFromText, refineTask, summarizeTask, suggestTags, classifyPriority, generateNames, generateResume}