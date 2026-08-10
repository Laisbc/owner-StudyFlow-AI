'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Question {
  id: string;
  enunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: { name: string };
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const query = filter === 'all' ? '' : `?difficulty=${filter}`;
        const res = await fetch(`/api/questions${query}`);
        if (res.ok) setQuestions(await res.json());
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchQuestions();
  }, [filter]);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'easy') return 'bg-green-100 text-green-800';
    if (difficulty === 'medium') return 'bg-yellow-100 text-yellow-800';
    if (difficulty === 'hard') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Questões</h1>
        <p className="mt-2 text-gray-600">Pratique respondendo questões de diferentes tópicos</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
          <button key={level} onClick={() => setFilter(level)} className={`rounded-lg px-4 py-2 font-medium ${filter === level ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
            {level === 'all' ? 'Todas' : level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card><CardContent className="pt-6 text-center"><p className="text-gray-600">Nenhuma questão encontrada</p></CardContent></Card>
        ) : (
          questions.map((question) => (
            <Link key={question.id} href={`/dashboard/questions/${question.id}`} className="block">
              <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{question.enunciation}</p>
                      <p className="mt-2 text-sm text-gray-600">Tópico: {question.topic?.name || 'N/A'}</p>
                    </div>
                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-blue-600">Abrir questão →</p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
