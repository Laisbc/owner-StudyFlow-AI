'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">StudyFlow AI</h1>
        <p className="text-xl mb-8 text-blue-100">
          Plataforma inteligente de estudos para ENEM, vestibulares e provas escolares
        </p>
        <div className="space-y-4">
          <Link href="/auth/login">
            <Button size="lg" variant="secondary" className="w-full">
              Entrar
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline" className="w-full text-white border-white hover:bg-white hover:text-blue-600">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
