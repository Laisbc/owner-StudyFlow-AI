import { auth } from '@/auth';
import { questionService } from '@/services/question.service';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const question = await questionService.getQuestionById(params.id);
    if (!question) {
      return NextResponse.json(
        { error: 'Questão não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Question fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar questão' },
      { status: 500 }
    );
  }
}
