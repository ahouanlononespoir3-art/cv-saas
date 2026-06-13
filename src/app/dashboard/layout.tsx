// src/app/dashboard/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/Header';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <DashboardSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <DashboardHeader user={session.user} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
