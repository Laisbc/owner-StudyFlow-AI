'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StudyPlan {
  id: string;
  title: string;
  goal?: string;
  targetDate: string;
  status: 'active' | 'paused' | 'completed';
}

export default function StudyPlansPage() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implementar busca de planos de estudo
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planos de Estudo</h1>
          <p className="text-gray-600 mt-2">Crie e acompanhe seus planos de estudo</p>
        </div>
        <Link href="/dashboard/study-plans/create">
          <Button>Novo Plano</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600 mb-4">Nenhum plano de estudo criado ainda</p>
          <Link href="/dashboard/study-plans/create">
            <Button>Criar Primeiro Plano</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
