import { db } from '@/lib/db';

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
    if (!subjects.length) throw new Error('Selecione ao menos uma matéria');
    if (totalQuestions < 1 || totalQuestions > 100) throw new Error('Quantidade de questões inválida');

    const candidates = await db.question.findMany({
      where: {
        topic: { subject: { id: { in: subjects } } },
        ...(options?.difficulty?.length
          ? { difficulty: { in: options.difficulty } }
          : {}),
      },
      include: { alternatives: true },
    });

    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(totalQuestions, shuffled.length));
    if (!selected.length) throw new Error('Nenhuma questão disponível para os filtros selecionados');

    const exam = await db.exam.create({
      data: {
        userId,
        title,
        description: options?.description,
        totalQuestions: selected.length,
        duration: options?.duration,
        passPercentage: options?.passPercentage ?? 60,
        subjects: {
          create: subjects.map((subjectId) => ({ subjectId })),
        },
        questions: {
          create: selected.map((question, index) => ({
            questionId: question.id,
            order: index + 1,
          })),
        },
      },
      include: {
        subjects: true,
        questions: { include: { question: { include: { alternatives: true } } }, orderBy: { order: 'asc' } },
      },
    });

    return exam;
  }

  async getExamById(id: string, userId?: string) {
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        questions: {
          include: { question: { include: { alternatives: true } } },
          orderBy: { order: 'asc' },
        },
        results: true,
      },
    });
    if (!exam) return null;
    if (userId && exam.userId !== userId) throw new Error('FORBIDDEN');
    return exam;
  }

  async submitExam(
    examId: string,
    userId: string,
    answers: Array<{ questionId: string; selectedAnswer: string }>
  ) {
    const exam = await this.getExamById(examId, userId);
    if (!exam) throw new Error('Exam not found');

    const validQuestionIds = new Set(exam.questions.map((item) => item.questionId));
    const uniqueAnswers = new Map(
      answers.filter((answer) => validQuestionIds.has(answer.questionId)).map((answer) => [answer.questionId, answer])
    );

    let correctCount = 0;
    for (const answer of uniqueAnswers.values()) {
      const item = exam.questions.find((q) => q.questionId === answer.questionId);
      const alternative = item?.question.alternatives.find((alt) => alt.letter === answer.selectedAnswer);
      if (alternative?.isCorrect) correctCount++;
    }

    const answeredCount = uniqueAnswers.size;
    const wrongCount = exam.totalQuestions - correctCount;
    const percentage = exam.totalQuestions > 0 ? (correctCount / exam.totalQuestions) * 100 : 0;

    return db.examResult.create({
      data: {
        examId,
        totalQuestions: exam.totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        percentage,
      },
    });
  }

  async getUserExams(userId: string) {
    return db.exam.findMany({
      where: { userId },
      include: { results: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const examService = new ExamService();
