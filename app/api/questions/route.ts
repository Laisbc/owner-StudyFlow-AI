import { questionService } from '@/services/question.service';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId');
    const difficulty = searchParams.get('difficulty');
    const random = searchParams.get('random');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let questions;

    if (random === 'true' && limit) {
      questions = await questionService.getRandomQuestions(limit, {
        topicId: topicId || undefined,
        difficulty: (difficulty as 'easy' | 'medium' | 'hard') || undefined,
      });
    } else if (topicId) {
      questions = await questionService.getQuestionsByTopic(topicId);
    } else if (difficulty) {
      questions = await questionService.getQuestionsByDifficulty(
        difficulty as 'easy' | 'medium' | 'hard',
        limit
      );
    } else {
      questions = [];
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Questions fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar questões' },
      { status: 500 }
    );
  }
}
