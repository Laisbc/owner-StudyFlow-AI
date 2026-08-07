import { db } from '@/lib/db';

function nextReviewDate(reviewCount: number, correct: boolean) {
  const days = correct
    ? Math.min(30, Math.max(1, 2 ** Math.min(reviewCount, 5)))
    : 1;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export class AnswerService {
  async submitAnswer(userId: string, questionId: string, selectedAnswer: string, timeSpent?: number) {
    const question = await db.question.findUnique({ where: { id: questionId }, include: { alternatives: true } });
    if (!question) throw new Error('Question not found');

    const selected = question.alternatives.find((alt) => alt.letter === selectedAnswer);
    if (!selected) throw new Error('Alternativa inválida');
    const isCorrect = selected.isCorrect;
    const now = new Date();

    const result = await db.$transaction(async (tx) => {
      const answer = await tx.answer.create({ data: { userId, questionId, selectedAnswer, isCorrect, timeSpent } });
      const existing = await tx.progress.findUnique({ where: { userId_topicId: { userId, topicId: question.topicId } } });
      const progress = existing
        ? await tx.progress.update({
            where: { userId_topicId: { userId, topicId: question.topicId } },
            data: {
              totalQuestions: { increment: 1 },
              correctAnswers: isCorrect ? { increment: 1 } : undefined,
              wrongAnswers: isCorrect ? undefined : { increment: 1 },
              accuracy: (existing.correctAnswers + (isCorrect ? 1 : 0)) / (existing.totalQuestions + 1),
              lastAnsweredAt: now,
            },
          })
        : await tx.progress.create({
            data: {
              userId,
              topicId: question.topicId,
              totalQuestions: 1,
              correctAnswers: isCorrect ? 1 : 0,
              wrongAnswers: isCorrect ? 0 : 1,
              accuracy: isCorrect ? 1 : 0,
              lastAnsweredAt: now,
            },
          });

      const review = await tx.review.findUnique({ where: { userId_topicId: { userId, topicId: question.topicId } } });
      const reviewCount = (review?.reviewCount ?? 0) + 1;
      if (review) {
        await tx.review.update({
          where: { userId_topicId: { userId, topicId: question.topicId } },
          data: {
            reviewCount,
            priority: isCorrect ? Math.max(1, review.priority - 1) : Math.min(5, review.priority + 1),
            nextReviewAt: nextReviewDate(reviewCount, isCorrect),
          },
        });
      } else {
        await tx.review.create({
          data: {
            userId,
            topicId: question.topicId,
            priority: isCorrect ? 1 : 2,
            reviewCount: 1,
            nextReviewAt: nextReviewDate(1, isCorrect),
          },
        });
      }
      return { answer, progress };
    });

    return { ...result, isCorrect };
  }

  async getUserAnswers(userId: string, questionId: string) {
    return db.answer.findMany({ where: { userId, questionId }, orderBy: { createdAt: 'desc' } });
  }

  async getUserStats(userId: string) {
    const [total, correct, topics] = await Promise.all([
      db.answer.count({ where: { userId } }),
      db.answer.count({ where: { userId, isCorrect: true } }),
      db.progress.findMany({ where: { userId }, include: { topic: true }, orderBy: { accuracy: 'asc' } }),
    ]);
    return {
      totalAnswered: total,
      correctAnswers: correct,
      wrongAnswers: total - correct,
      accuracy: total > 0 ? correct / total : 0,
      weakTopics: topics.slice(0, 5),
    };
  }
}

export const answerService = new AnswerService();
