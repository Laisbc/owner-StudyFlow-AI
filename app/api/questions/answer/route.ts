import { auth } from '@/auth';
import { questionService } from '@/services/question.service';
import { answerService } from '@/services/answer.service';
import { answerQuestionSchema } from '@/schemas/question';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { questionId, selectedAnswer, timeSpent } = answerQuestionSchema.parse(body);

    const result = await answerService.submitAnswer(
      session.user.id,
      questionId,
      selectedAnswer,
      timeSpent
    );

    return NextResponse.json({
      success: true,
      isCorrect: result.isCorrect,
      progress: result.progress,
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    return NextResponse.json(
      { error: 'Erro ao submeter resposta' },
      { status: 500 }
    );
  }
}
