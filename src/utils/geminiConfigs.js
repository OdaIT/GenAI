export function createSystemPrompt() {
  return `És um assistente de gestão de tarefas.
Ajudas os utilizadores a criar, refinar e organizar tarefas de forma clara e profissional.
Responde sempre em português e de forma concisa.`;
}

export const jsonFormat =`
  Retorna o JSON neste formato:
{
  "title": "título conciso e profissional",
  "description": "descrição clara e objetiva",
  "priority": "high/medium/low",
  "tags": ["tag1", "tag2"]
}`

