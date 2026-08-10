'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Alternative {
  id: string;
  letter: string;
  text: string;
}

interface ExamQuestion {
  questionId: string;
  order: number;
  question: {
    enunciation: string;
    alternatives: Alternative[];
  };
}

interface Exam {
  id: string;
  title: string;
  description?: string | null;
  duration?: number | null;
  totalQuestions: number;
  passPercentage: number;
  questions: ExamQuestion[];
}

interface Result {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
}

export default function ExamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExam = async () => {
      try {
        const response = await fetch(`/api/exams/${params.id}`);
        if (!response.ok) throw new Error('Não foi possível carregar o simulado');
        setExam(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar simulado');
      } finally {
        setLoading(false);
      }
    };
    void loadExam();
  }, [params.id]);

  const question = exam?.questions[current];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const submit = async () => {
    if (!exam) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`/api/exams/${exam.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar simulado');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar simulado');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Carregando simulado...</div>;
  if (error && !exam) return <div className="text-red-600">{error}</div>;
  if (!exam) return <div>Simulado não encontrado.</div>;

  if (result) {
    const passed = result.percentage >= exam.passPercentage;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle>Resultado: {exam.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-5xl font-bold">{Math.round(result.percentage)}%</p>
              <p className={passed ? 'text-green-600 mt-2' : 'text-red-600 mt-2'}>
                {passed ? 'Aprovada!' : 'Não atingiu a nota mínima'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-2xl font-bold">{result.correctAnswers}</p><p className="text-sm text-gray-600">Acertos</p></div>
              <div><p className="text-2xl font-bold">{result.wrongAnswers}</p><p className="text-sm text-gray-600">Erros</p></div>
              <div><p className="text-2xl font-bold">{result.totalQuestions}</p><p className="text-sm text-gray-600">Questões</p></div>
            </div>
            <Button className="w-full" onClick={() => router.push('/dashboard/exams')}>Voltar aos simulados</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) return <div>Este simulado não possui questões.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
        <p className="text-gray-600 mt-1">Questão {current + 1} de {exam.totalQuestions} • {answeredCount} respondida(s)</p>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${((current + 1) / exam.totalQuestions) * 100}%` }} />
      </div>
      <Card>
        <CardHeader><CardTitle>Questão {question.order}</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <p className="text-lg text-gray-900 whitespace-pre-wrap">{question.question.enunciation}</p>
          <div className="space-y-3">
            {question.question.alternatives.map((alternative) => {
              const selected = answers[question.questionId] === alternative.letter;
              return (
                <button
                  key={alternative.id}
                  type="button"
                  onClick={() => setAnswers((previous) => ({ ...previous, [question.questionId]: alternative.letter }))}
                  className={`w-full text-left rounded-lg border p-4 transition ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <span className="font-semibold mr-3">{alternative.letter})</span>{alternative.text}
                </button>
              );
            })}
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex justify-between gap-3">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Anterior</Button>
            {current < exam.questions.length - 1 ? (
              <Button onClick={() => setCurrent((value) => value + 1)}>Próxima</Button>
            ) : (
              <Button disabled={submitting || answeredCount === 0} onClick={submit}>{submitting ? 'Enviando...' : 'Finalizar simulado'}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
