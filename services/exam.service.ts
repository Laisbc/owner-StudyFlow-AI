import { db } from '@/lib/db';
import { questionService } from './question.service';

export class ExamService {
  async createExam(
    userId: string,
    title: string,
    totalQuestions: number,
    subjects: string[],
    options?: {
      description?: string;
      duration?: number;
      passPercentage?: number;
      difficulty?: ('easy' | 'medium' | 'hard')[];
    }
  ) {
    // Create exam
    const exam = await db.exam.create({
      data: {
        userId,
        title,
        description: options?.description,
        totalQuestions,
        duration: options?.duration,
        passPercentage: options?.passPercentage || 60,
      },
    });

    // Add subjects to exam
    for (const subjectId of subjects) {
      await db.examSubject.create({
        data: {
          examId: exam.id,
          subjectId,
        },
      });
    }

    // Get random questions
    const questions = await db.question.findMany({
      where: {
        topic: {
          subject: {
            id: { in: subjects },
          },
        },
        ...(options?.difficulty && {
          difficulty: { in: options.difficulty },
        }),
      },
      take: totalQuestions,
    });

    // Add questions to exam
    for (let i = 0; i < questions.length; i++) {
      await db.examQuestion.create({
        data: {
          examId: exam.id,
          questionId: questions[i].id,
          order: i + 1,
        },
      });
    }

    return exam;
  }

  async getExamById(id: string) {
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            question: {
              include: { alternatives: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    return exam;
  }

  async submitExam(
    examId: string,
    answers: Array<{ questionId: string; selectedAnswer: string }>
  ) {
    const exam = await this.getExamById(examId);
    if (!exam) throw new Error('Exam not found');

    let correctCount = 0;

    for (const answer of answers) {
      const question = exam.questions.find(
        (q) => q.questionId === answer.questionId
      );
      if (!question) continue;

      const alternative = question.question.alternatives.find(
        (alt) => alt.letter === answer.selectedAnswer
      );
      if (alternative?.isCorrect) correctCount++;
    }

    const percentage = (correctCount / exam.totalQuestions) * 100;

    // Save result
    const result = await db.examResult.create({
      data: {
        examId,
        totalQuestions: exam.totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: exam.totalQuestions - correctCount,
        percentage,
        timeTaken: exam.finishedAt && exam.startedAt
          ? Math.floor(
              (exam.finishedAt.getTime() - exam.startedAt.getTime()) / 60000
            )
          : undefined,
      },
    });

    return result;
  }

  async getUserExams(userId: string) {
    const exams = await db.exam.findMany({
      where: { userId },
      include: { results: true },
      orderBy: { createdAt: 'desc' },
    });
    return exams;
  }
}

export const examService = new ExamService();
