'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

interface Profile {
  id: string;
  userId: string;
  goal?: string;
  mainExam?: string;
  examDate?: string;
  timePerDay?: number;
  daysPerWeek?: number;
  knowledgeLevel?: 'beginner' | 'intermediate' | 'advanced';
  totalStudyTime: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-600 mt-2">Informações sobre sua conta e metas de estudo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="text-lg font-medium">{session?.user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium">{session?.user?.email || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metas de Estudo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Objetivo</p>
              <p className="text-lg font-medium">{profile?.goal || 'Não definido'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Exame Principal</p>
              <p className="text-lg font-medium">{profile?.mainExam || 'Não definido'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tempo por Dia</p>
              <p className="text-lg font-medium">{profile?.timePerDay ? `${profile.timePerDay} minutos` : 'Não definido'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dias por Semana</p>
              <p className="text-lg font-medium">{profile?.daysPerWeek || 'Não definido'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nível de Conhecimento</p>
              <p className="text-lg font-medium">
                {profile?.knowledgeLevel === 'beginner'
                  ? 'Iniciante'
                  : profile?.knowledgeLevel === 'intermediate'
                  ? 'Intermediário'
                  : profile?.knowledgeLevel === 'advanced'
                  ? 'Avançado'
                  : 'Não definido'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm text-gray-600">Tempo Total de Estudo</p>
            <p className="text-lg font-medium">{profile?.totalStudyTime ? `${profile.totalStudyTime} minutos` : '0 minutos'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
