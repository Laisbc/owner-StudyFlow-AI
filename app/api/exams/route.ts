import { auth } from '@/auth';
import { examService } from '@/services/exam.service';
import { createExamSchema } from '@/schemas/exam';
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
    const { title, description, totalQuestions, subjects, duration, passPercentage, difficulty } =
      createExamSchema.parse(body);

    const exam = await examService.createExam(
      session.user.id,
      title,
      totalQuestions,
      subjects,
      {
        description,
        duration,
        passPercentage,
        difficulty,
      }
    );

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error('Exam creation error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar simulado' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const exams = await examService.getUserExams(session.user.id);
    return NextResponse.json(exams);
  } catch (error) {
    console.error('Exams fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar simulados' },
      { status: 500 }
    );
  }
}
