import { questionService } from '@/services/question.service';
import { NextResponse } from 'next/server';

const difficulties = new Set(['easy', 'medium', 'hard']);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId') || undefined;
    const difficultyParam = searchParams.get('difficulty') || undefined;
    const random = searchParams.get('random') === 'true';
    const requestedLimit = Number.parseInt(searchParams.get('limit') || '20', 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 20;

    if (difficultyParam && !difficulties.has(difficultyParam)) {
      return NextResponse.json(
        { error: 'Dificuldade inválida' },
        { status: 400 }
      );
    }

    const difficulty = difficultyParam as 'easy' | 'medium' | 'hard' | undefined;

    const questions = random
      ? await questionService.getRandomQuestions(limit, { topicId, difficulty })
      : await questionService.getQuestions({ topicId, difficulty, limit });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Questions fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar questões' },
      { status: 500 }
    );
  }
}
