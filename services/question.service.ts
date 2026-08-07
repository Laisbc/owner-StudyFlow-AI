import { db } from '@/lib/db';
import type { Question } from '@/types';

export class QuestionService {
  async getQuestionsByTopic(topicId: string): Promise<Question[]> {
    const questions = await db.question.findMany({
      where: { topicId },
      include: {
        alternatives: true,
        topic: true,
      },
    });
    return questions as Question[];
  }

  async getQuestionsByDifficulty(
    difficulty: 'easy' | 'medium' | 'hard',
    limit?: number
  ): Promise<Question[]> {
    const questions = await db.question.findMany({
      where: { difficulty },
      include: {
        alternatives: true,
        topic: true,
      },
      take: limit,
    });
    return questions as Question[];
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const question = await db.question.findUnique({
      where: { id },
      include: {
        alternatives: true,
        topic: true,
      },
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
    const questions = await db.question.findMany({
      where: filters,
      include: {
        alternatives: true,
        topic: true,
      },
      take: count,
    });
    return questions as Question[];
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const questions = await db.question.findMany({
      where: {
        OR: [
          { enunciation: { contains: query, mode: 'insensitive' } },
          { topic: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        alternatives: true,
        topic: true,
      },
      take: 20,
    });
    return questions as Question[];
  }
}

export const questionService = new QuestionService();
