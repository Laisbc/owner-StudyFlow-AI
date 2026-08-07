import { db } from '@/lib/db';
import type { Question } from '@/types';

export class QuestionService {
  async getQuestions(options?: {
    topicId?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    limit?: number;
  }): Promise<Question[]> {
    const limit = Math.min(Math.max(options?.limit ?? 20, 1), 100);
    const questions = await db.question.findMany({
      where: {
        topicId: options?.topicId,
        difficulty: options?.difficulty,
      },
      include: { alternatives: true, topic: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return questions as Question[];
  }

  async getQuestionsByTopic(topicId: string, limit?: number): Promise<Question[]> {
    return this.getQuestions({ topicId, limit });
  }

  async getQuestionsByDifficulty(
    difficulty: 'easy' | 'medium' | 'hard',
    limit?: number
  ): Promise<Question[]> {
    return this.getQuestions({ difficulty, limit });
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const question = await db.question.findUnique({
      where: { id },
      include: { alternatives: true, topic: true },
    });
    return question as Question | null;
  }

  async getRandomQuestions(
    count: number,
    filters?: {
      topicId?: string;
      difficulty?: 'easy' | 'medium' | 'hard';
    }
  ): Promise<Question[]> {
    const safeCount = Math.min(Math.max(count, 1), 100);
    const candidates = await db.question.findMany({
      where: {
        topicId: filters?.topicId,
        difficulty: filters?.difficulty,
      },
      include: { alternatives: true, topic: true },
    });

    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    return candidates.slice(0, safeCount) as Question[];
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return [];

    const questions = await db.question.findMany({
      where: {
        OR: [
          { enunciation: { contains: normalizedQuery, mode: 'insensitive' } },
          { topic: { name: { contains: normalizedQuery, mode: 'insensitive' } } },
        ],
      },
      include: { alternatives: true, topic: true },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    return questions as Question[];
  }
}

export const questionService = new QuestionService();
