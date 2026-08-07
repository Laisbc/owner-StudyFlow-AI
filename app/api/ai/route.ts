import { auth } from '@/auth';
import {
  generateExplanation,
  generateExercises,
  generateStudyPlan,
  generateSummary,
} from '@/services/ai.service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const action = body?.action;

    let result: string;
    switch (action) {
      case 'explanation':
        if (!body.question || !body.answer) {
          return NextResponse.json({ error: 'question e answer são obrigatórios' }, { status: 400 });
        }
        result = await generateExplanation(body.question, body.answer);
        break;
      case 'summary':
        if (!body.content) {
          return NextResponse.json({ error: 'content é obrigatório' }, { status: 400 });
        }
        result = await generateSummary(body.content);
        break;
      case 'study-plan':
        if (!body.goal || !Number.isFinite(body.availableTime)) {
          return NextResponse.json({ error: 'goal e availableTime são obrigatórios' }, { status: 400 });
        }
        result = await generateStudyPlan(body.goal, body.availableTime);
        break;
      case 'exercises':
        if (!body.topic || !body.difficulty) {
          return NextResponse.json({ error: 'topic e difficulty são obrigatórios' }, { status: 400 });
        }
        result = await generateExercises(body.topic, body.difficulty);
        break;
      default:
        return NextResponse.json({ error: 'Ação de IA inválida' }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar IA' },
      { status: 500 }
    );
  }
}
