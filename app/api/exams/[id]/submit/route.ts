import { auth } from '@/auth';
import { examService } from '@/services/exam.service';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    if (!Array.isArray(body?.answers)) {
      return NextResponse.json({ error: 'Respostas inválidas' }, { status: 400 });
    }

    const answers = body.answers.filter(
      (answer: unknown): answer is { questionId: string; selectedAnswer: string } =>
        typeof answer === 'object' &&
        answer !== null &&
        typeof (answer as { questionId?: unknown }).questionId === 'string' &&
        typeof (answer as { selectedAnswer?: unknown }).selectedAnswer === 'string'
    );

    const result = await examService.submitExam(params.id, session.user.id, answers);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }
    console.error('Exam submit error:', error);
    return NextResponse.json({ error: 'Erro ao enviar simulado' }, { status: 500 });
  }
}
