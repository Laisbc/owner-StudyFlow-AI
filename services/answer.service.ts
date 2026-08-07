import { db } from '@/lib/db';

export class AnswerService {
  async submitAnswer(
    userId: string,
    questionId: string,
    selectedAnswer: string,
    timeSpent?: number
  ) {
    // Get the question with alternatives
    const question = await db.question.findUnique({
      where: { id: questionId },
      include: { alternatives: true },
    });

    if (!question) throw new Error('Question not found');

    // Check if answer is correct
    const selectedAlternative = question.alternatives.find(
      (alt) => alt.letter === selectedAnswer
    );
    const isCorrect = selectedAlternative?.isCorrect || false;

    // Save the answer
    const answer = await db.answer.create({
      data: {
        userId,
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent,
      },
    });

    // Update progress
    let progress = await db.progress.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: question.topicId,
        },
      },
    });

    if (!progress) {
      progress = await db.progress.create({
        data: {
          userId,
          topicId: question.topicId,
          totalQuestions: 1,
          correctAnswers: isCorrect ? 1 : 0,
          wrongAnswers: isCorrect ? 0 : 1,
          accuracy: isCorrect ? 1 : 0,
          lastAnsweredAt: new Date(),
        },
      });
    } else {
      progress = await db.progress.update({
        where: {
          userId_topicId: {
            userId,
            topicId: question.topicId,
          },
        },
        data: {
          totalQuestions: { increment: 1 },
          correctAnswers: isCorrect ? { increment: 1 } : undefined,
          wrongAnswers: isCorrect ? undefined : { increment: 1 },
          accuracy:
            (progress.correctAnswers + (isCorrect ? 1 : 0)) /
            (progress.totalQuestions + 1),
          lastAnsweredAt: new Date(),
        },
      });
    }

    // Update or create review if answer is wrong
    if (!isCorrect) {
      const review = await db.review.findUnique({
        where: {
          userId_topicId: {
            userId,
            topicId: question.topicId,
          },
        },
      });

      if (!review) {
        await db.review.create({
          data: {
            userId,
            topicId: question.topicId,
            priority: 1,
            reviewCount: 1,
            nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        });
      } else {
        await db.review.update({
          where: {
            userId_topicId: {
              userId,
              topicId: question.topicId,
            },
          },
          data: {
            reviewCount: { increment: 1 },
            nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    return { answer, isCorrect, progress };
  }

  async getUserAnswers(userId: string, questionId: string) {
    const answers = await db.answer.findMany({
      where: { userId, questionId },
      orderBy: { createdAt: 'desc' },
    });
    return answers;
  }

  async getUserStats(userId: string) {
    const answers = await db.answer.findMany({
      where: { userId },
    });

    const total = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const accuracy = total > 0 ? correct / total : 0;

    return {
      totalAnswered: total,
      correctAnswers: correct,
      wrongAnswers: total - correct,
      accuracy,
    };
  }
}

export const answerService = new AnswerService();
