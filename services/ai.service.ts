/**
 * AI Service
 * 
 * This service provides an abstraction layer for AI features.
 * The actual implementation can be swapped between providers (Google Gemini, OpenAI, etc.)
 * by changing the environment variables.
 */

export interface AIServiceProvider {
  generateExplanation(question: string, answer: string): Promise<string>;
  generateSummary(content: string): Promise<string>;
  generateStudyPlan(userGoal: string, availableTime: number): Promise<string>;
  generateExercises(topic: string, difficulty: string): Promise<string>;
  getRecommendations(userProgress: any): Promise<string[]>;
}

// Mock implementation for now - will be replaced with actual provider
class MockAIProvider implements AIServiceProvider {
  async generateExplanation(question: string, answer: string): Promise<string> {
    return `Explicação para: ${question}\nResposta: ${answer}\n\nEsta é uma explicação placeholder.`;
  }

  async generateSummary(content: string): Promise<string> {
    return `Resumo de: ${content}\n\nEste é um resumo placeholder.`;
  }

  async generateStudyPlan(
    userGoal: string,
    availableTime: number
  ): Promise<string> {
    return `Plano de estudos para: ${userGoal}\nTempo disponível: ${availableTime} minutos\n\nEste é um plano placeholder.`;
  }

  async generateExercises(
    topic: string,
    difficulty: string
  ): Promise<string> {
    return `Exercícios para: ${topic}\nDificuldade: ${difficulty}\n\nEstes são exercícios placeholder.`;
  }

  async getRecommendations(userProgress: any): Promise<string[]> {
    return ['Revisar Matemática', 'Praticar Português', 'Estudar História'];
  }
}

let aiProvider: AIServiceProvider = new MockAIProvider();

export function setAIProvider(provider: AIServiceProvider) {
  aiProvider = provider;
}

export async function generateExplanation(
  question: string,
  answer: string
): Promise<string> {
  return aiProvider.generateExplanation(question, answer);
}

export async function generateSummary(content: string): Promise<string> {
  return aiProvider.generateSummary(content);
}

export async function generateStudyPlan(
  userGoal: string,
  availableTime: number
): Promise<string> {
  return aiProvider.generateStudyPlan(userGoal, availableTime);
}

export async function generateExercises(
  topic: string,
  difficulty: string
): Promise<string> {
  return aiProvider.generateExercises(topic, difficulty);
}

export async function getRecommendations(
  userProgress: any
): Promise<string[]> {
  return aiProvider.getRecommendations(userProgress);
}
