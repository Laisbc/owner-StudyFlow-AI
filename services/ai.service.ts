export interface AIServiceProvider {
  generateExplanation(question: string, answer: string): Promise<string>;
  generateSummary(content: string): Promise<string>;
  generateStudyPlan(userGoal: string, availableTime: number): Promise<string>;
  generateExercises(topic: string, difficulty: string): Promise<string>;
  getRecommendations(userProgress: unknown): Promise<string[]>;
}

class OpenAIProvider implements AIServiceProvider {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  private readonly baseUrl = (
    process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  ).replace(/\/$/, '');

  private async generate(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY não configurada. Configure a variável de ambiente para habilitar a IA.');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'Você é o StudyFlow AI, um tutor educacional. Responda em português do Brasil, explique de forma clara e adequada para estudantes e não invente informações.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('AI provider error:', response.status, details);
      throw new Error('O provedor de IA não respondeu corretamente.');
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) throw new Error('O provedor de IA retornou uma resposta vazia.');
    return content;
  }

  generateExplanation(question: string, answer: string) {
    return this.generate(
      `Explique esta questão para um estudante.\n\nQuestão:\n${question}\n\nResposta escolhida/correta:\n${answer}\n\nMostre o raciocínio passo a passo, sem fornecer conteúdo desnecessário.`
    );
  }

  generateSummary(content: string) {
    return this.generate(
      `Faça um resumo de estudo claro e organizado do conteúdo abaixo. Destaque conceitos, fórmulas ou fatos importantes quando existirem.\n\n${content}`
    );
  }

  generateStudyPlan(userGoal: string, availableTime: number) {
    return this.generate(
      `Crie um plano de estudos realista para o objetivo: ${userGoal}. O estudante possui ${availableTime} minutos por dia. Inclua sessões de estudo, exercícios e revisões.`
    );
  }

  generateExercises(topic: string, difficulty: string) {
    return this.generate(
      `Crie 5 exercícios originais sobre ${topic}, com dificuldade ${difficulty}. Não copie questões existentes. Inclua o gabarito e uma explicação curta.`
    );
  }

  async getRecommendations(userProgress: unknown): Promise<string[]> {
    const result = await this.generate(
      `Analise o progresso abaixo e recomende os próximos assuntos para estudar. Retorne somente uma lista numerada com até 5 recomendações.\n\n${JSON.stringify(userProgress)}`
    );
    return result
      .split('\n')
      .map((item) => item.replace(/^\s*[-*\d.)]+\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 5);
  }
}

const aiProvider: AIServiceProvider = new OpenAIProvider();

export const setAIProvider = (_provider: AIServiceProvider) => {
  throw new Error('O provedor de IA é configurado por variáveis de ambiente.');
};

export const generateExplanation = (question: string, answer: string) =>
  aiProvider.generateExplanation(question, answer);

export const generateSummary = (content: string) =>
  aiProvider.generateSummary(content);

export const generateStudyPlan = (userGoal: string, availableTime: number) =>
  aiProvider.generateStudyPlan(userGoal, availableTime);

export const generateExercises = (topic: string, difficulty: string) =>
  aiProvider.generateExercises(topic, difficulty);

export const getRecommendations = (userProgress: unknown) =>
  aiProvider.getRecommendations(userProgress);
