import { auth } from '@/auth';
import { db } from '@/lib/db';
import { submitExamSchema } from '@/schemas/exam';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const input = submitExamSchema.parse(await req.json());
    const exam = await db.exam.findFirst({
      where: { id: input.examId, userId: session.user.id },
      include: { questions: { include: { question: { include: { alternatives: true } } } } },
    });
    if (!exam) return NextResponse.json({ error: 'Simulado não encontrado' }, { status: 404 });

    const allowed = new Set(exam.questions.map((item) => item.questionId));
    const answers = new Map(input.answers.map((answer) => [answer.questionId, answer.selectedAnswer]));
    let correct = 0;
    for (const [questionId, selectedAnswer] of answers) {
      if (!allowed.has(questionId)) continue;
      const item = exam.questions.find((q) => q.questionId === questionId);
      if (item?.question.alternatives.some((alternative) => alternative.letter === selectedAnswer && alternative.isCorrect)) correct++;
    }

    const finishedAt = new Date();
    const percentage = exam.totalQuestions ? (correct / exam.totalQuestions) * 100 : 0;
    const timeTaken = exam.startedAt ? Math.max(0, Math.floor((finishedAt.getTime() - exam.startedAt.getTime()) / 1000)) : undefined;
    const result = await db.$transaction(async (tx) => {
      const created = await tx.examResult.create({
        data: {
          examId: exam.id,
          totalQuestions: exam.totalQuestions,
          correctAnswers: correct,
          wrongAnswers: Math.max(0, exam.totalQuestions - correct),
          percentage,
          timeTaken,
        },
      });
      await tx.exam.update({ where: { id: exam.id }, data: { finishedAt } });
      return created;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Dados inválidos', details: error.flatten() }, { status: 400 });
    console.error('Exam submission error:', error);
    return NextResponse.json({ error: 'Erro ao finalizar simulado' }, { status: 500 });
  }
}
