import { auth } from '@/auth';
import { answerService } from '@/services/answer.service';
import { answerQuestionSchema } from '@/schemas/question';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const body = await req.json();
    const { questionId, selectedAnswer, timeSpent } = answerQuestionSchema.parse(body);
    const result = await answerService.submitAnswer(session.user.id, questionId, selectedAnswer, timeSpent);

    return NextResponse.json({ success: true, isCorrect: result.isCorrect, progress: result.progress });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Dados inválidos', details: error.flatten() }, { status: 400 });
    console.error('Answer submission error:', error);
    const message = error instanceof Error ? error.message : 'Erro ao submeter resposta';
    const status = message.includes('Question not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
