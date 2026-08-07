'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              StudyFlow
            </Link>
            <div className="flex gap-4 items-center">
              <span className="text-gray-600">{session?.user?.name}</span>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8 space-y-4 px-4">
            <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard/questions" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
              Questões
            </Link>
            <Link href="/dashboard/exams" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
              Simulados
            </Link>
            <Link href="/dashboard/study-plans" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
              Planos de Estudo
            </Link>
            <Link href="/dashboard/progress" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
              Progresso
            </Link>
            <Link href="/dashboard/profile" className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700">
              Perfil
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
