'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Alternative { id: string; letter: string; text: string }
interface Question { id: string; enunciation: string; difficulty: string; explanation?: string | null; topic?: { name: string }; alternatives: Alternative[] }

export default function QuestionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/questions/${params.id}`);
        if (!response.ok) throw new Error('Questão não encontrada');
        setQuestion(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar questão');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [params.id]);

  const submit = async () => {
    if (!question || !selected || result !== null) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/questions/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, selectedAnswer: selected }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível registrar a resposta');
      setResult(data.isCorrect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar resposta');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-10 text-center">Carregando questão...</div>;
  if (error && !question) return <div className="py-10 text-center text-red-600">{error}</div>;
  if (!question) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/questions" className="text-sm text-blue-600 hover:underline">← Voltar para questões</Link>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">{question.topic?.name ?? 'Geral'}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questão</CardTitle>
          <p className="text-sm text-gray-500">Dificuldade: {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-lg leading-8 text-gray-900">{question.enunciation}</p>
          <div className="space-y-3">
            {question.alternatives.map((alternative) => (
              <button
                key={alternative.id}
                type="button"
                disabled={result !== null}
                onClick={() => setSelected(alternative.letter)}
                className={`w-full rounded-lg border p-4 text-left transition ${selected === alternative.letter ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'} ${result !== null ? 'cursor-default' : ''}`}
              >
                <strong className="mr-2">{alternative.letter})</strong>{alternative.text}
              </button>
            ))}
          </div>

          {error && question && <p className="text-sm text-red-600">{error}</p>}
          {result === null ? (
            <Button onClick={() => void submit()} disabled={!selected || submitting} className="w-full">
              {submitting ? 'Registrando...' : 'Responder'}
            </Button>
          ) : (
            <div className={`rounded-lg p-4 ${result ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-semibold">{result ? 'Resposta correta!' : 'Resposta incorreta.'}</p>
              {question.explanation && <p className="mt-2 text-sm">{question.explanation}</p>}
              <Button className="mt-4" variant="outline" onClick={() => router.push('/dashboard/questions')}>Voltar às questões</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
