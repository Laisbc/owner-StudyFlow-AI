'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Exam {
  id: string;
  title: string;
  totalQuestions: number;
  duration?: number;
  passPercentage: number;
  createdAt: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/exams');
        if (res.ok) {
          const data = await res.json();
          setExams(data);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulados</h1>
          <p className="text-gray-600 mt-2">Teste seus conhecimentos com simulados</p>
        </div>
        <Link href="/dashboard/exams/create">
          <Button>Novo Simulado</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 mb-4">Nenhum simulado criado ainda</p>
              <Link href="/dashboard/exams/create">
                <Button>Criar Primeiro Simulado</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Questões: {exam.totalQuestions}</p>
                  {exam.duration && <p>Duração: {exam.duration} minutos</p>}
                  <p>Mínimo para passar: {exam.passPercentage}%</p>
                </div>
                <Link href={`/dashboard/exams/${exam.id}`}>
                  <Button className="w-full mt-4">Iniciar</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
