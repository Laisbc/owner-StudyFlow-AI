import { NextResponse } from 'next/server';
import { questionService } from '@/services/question.service';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const question = await questionService.getQuestionById(params.id);
    if (!question) {
      return NextResponse.json({ error: 'Questão não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      ...question,
      alternatives: question.alternatives.map(({ isCorrect: _isCorrect, ...alternative }) => alternative),
    });
  } catch (error) {
    console.error('Question fetch error:', error);
    return NextResponse.json({ error: 'Erro ao buscar questão' }, { status: 500 });
  }
}
