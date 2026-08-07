import { auth } from '@/auth';
import { examService } from '@/services/exam.service';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await examService.getExamById(params.id);
    if (!exam) {
      return NextResponse.json(
        { error: 'Simulado não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Exam fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar simulado' },
      { status: 500 }
    );
  }
}
