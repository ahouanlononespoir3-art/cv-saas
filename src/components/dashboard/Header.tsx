// src/components/dashboard/Header.tsx
'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  user: { name?: string; email: string; plan: string };
}

export default function DashboardHeader({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-surface-100 px-8 py-4 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        {user.plan !== 'PREMIUM' && (
          <Link
            href="/dashboard/settings"
            className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-200 rounded-full px-3 py-1.5 hover:bg-brand-100 transition-colors"
          >
            ⬆ Passer Premium — 9,99€/mois
          </Link>
        )}
        <button className="relative p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-colors">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
