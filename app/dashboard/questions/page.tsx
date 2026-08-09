'use client';

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
      <div><h1 className="text-3xl font-bold text-gray-900">Questões</h1><p className="text-gray-600 mt-2">Pratique respondendo questões de diferentes tópicos</p></div>
      <div className="flex gap-2">
        {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
          <button key={level} onClick={() => setFilter(level)} className={`px-4 py-2 rounded-lg font-medium ${filter === level ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            {level === 'all' ? 'Todas' : level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {questions.length === 0 ? <Card><CardContent className="pt-6 text-center"><p className="text-gray-600">Nenhuma questão encontrada</p></CardContent></Card> : questions.map((question) => (
          <Card key={question.id}><CardContent className="pt-6"><div className="flex justify-between items-start gap-4"><div className="flex-1"><p className="text-gray-900 font-medium">{question.enunciation}</p><p className="text-sm text-gray-600 mt-2">Tópico: {question.topic?.name || 'N/A'}</p></div><span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getDifficultyColor(question.difficulty)}`}>{question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}</span></div></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
