// src/components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, FileText, Mail, Settings,
  LogOut, Sparkles, Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard',               icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/dashboard/cv',            icon: FileText,        label: 'Mes CV' },
  { href: '/dashboard/letters',       icon: Mail,            label: 'Mes lettres' },
  { href: '/dashboard/settings',      icon: Settings,        label: 'Paramètres' },
];

interface SidebarProps {
  user: { name?: string; email: string; image?: string; plan: string };
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isPremium = user.plan === 'PREMIUM';

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-surface-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-surface-900">CVPro<span className="text-brand-600"> AI</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900',
              )}
            >
              <item.icon className={cn('h-4 w-4 flex-shrink-0', active ? 'text-brand-600' : '')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Premium CTA */}
      {!isPremium && (
        <div className="mx-3 mb-3 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-semibold">Passer Premium</span>
          </div>
          <p className="text-xs text-white/80 mb-3">CV illimités, tous les templates</p>
          <Link
            href="/dashboard/settings"
            className="block w-full text-center text-xs font-semibold bg-white text-brand-700 rounded-lg py-2 hover:bg-white/90 transition-colors"
          >
            9,99€/mois
          </Link>
        </div>
      )}

      {/* User */}
      <div className="px-3 pb-4 border-t border-surface-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">{user.name ?? 'Utilisateur'}</p>
              <div className="flex items-center gap-1">
                {isPremium ? (
                  <span className="text-xs text-amber-500 font-medium flex items-center gap-0.5">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                ) : (
                  <span className="text-xs text-surface-400">Plan gratuit</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
