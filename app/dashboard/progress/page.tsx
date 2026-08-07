'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TopicProgress {
  topicId: string;
  topicName: string;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  lastAnsweredAt?: string;
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'accuracy' | 'recent'>('accuracy');

  useEffect(() => {
    // TODO: Implementar busca de progresso
    setLoading(false);
  }, [sortBy]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.8) return 'bg-green-100 text-green-800';
    if (accuracy >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progresso</h1>
        <p className="text-gray-600 mt-2">Acompanhe seu desempenho em cada tópico</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSortBy('accuracy')}
          className={`px-4 py-2 rounded-lg font-medium ${
            sortBy === 'accuracy'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Ordenar por Taxa de Acerto
        </button>
        <button
          onClick={() => setSortBy('recent')}
          className={`px-4 py-2 rounded-lg font-medium ${
            sortBy === 'recent'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Ordenar por Recente
        </button>
      </div>

      <div className="space-y-4">
        {progress.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600">Nenhum progresso registrado ainda. Comece a responder questões!</p>
            </CardContent>
          </Card>
        ) : (
          progress.map((item) => (
            <Card key={item.topicId}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.topicName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.correctAnswers} de {item.totalQuestions} acertos
                    </p>
                    {item.lastAnsweredAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Última resposta: {new Date(item.lastAnsweredAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-semibold text-lg ${getAccuracyColor(item.accuracy)}`}>
                    {Math.round(item.accuracy * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
