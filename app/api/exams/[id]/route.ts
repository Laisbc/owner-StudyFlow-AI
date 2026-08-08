import { auth } from '@/auth';
import { examService } from '@/services/exam.service';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const exam = await examService.getExamById(params.id, session.user.id);
    if (!exam) {
      return NextResponse.json({ error: 'Simulado não encontrado' }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }
    console.error('Exam fetch error:', error);
    return NextResponse.json({ error: 'Erro ao buscar simulado' }, { status: 500 });
  }
}
