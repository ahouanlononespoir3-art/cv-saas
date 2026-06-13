// src/app/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FileText, Mail, Download, Plus, Sparkles, TrendingUp, Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string) {
  const [resumes, letters, exports_, user] = await Promise.all([
    prisma.resume.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.coverLetter.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.export.count({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { plan: true, cvCount: true, letterCount: true } }),
  ]);
  return { resumes, letters, exports: exports_, user };
}

export default async function DashboardPage() {
  const session = await auth();
  const data    = await getDashboardData(session!.user.id);
  const isPremium = data.user?.plan === 'PREMIUM';
  const limit  = isPremium ? '∞' : 2;
  const cvUsed = Math.min(data.user?.cvCount ?? 0, 2);
  const ltUsed = Math.min(data.user?.letterCount ?? 0, 2);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Bonjour, {session!.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            Gérez vos CV et lettres de motivation
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/letters/create" className="btn-secondary text-sm">
            <Mail className="h-4 w-4" />
            Nouvelle lettre
          </Link>
          <Link href="/dashboard/cv/create" className="btn-primary text-sm">
            <Plus className="h-4 w-4" />
            Nouveau CV
          </Link>
        </div>
      </div>

      {/* Premium banner */}
      {!isPremium && (
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Passez au plan Premium</p>
              <p className="text-white/80 text-sm">CV illimités, tous les templates, export DOCX — 9,99€/mois</p>
            </div>
          </div>
          <Link href="/dashboard/settings" className="btn-secondary bg-white text-brand-700 hover:bg-white/90 flex-shrink-0">
            Passer Premium
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: FileText, label: 'CV créés',
            value: data.resumes.length,
            sub:   isPremium ? 'Illimité' : `${cvUsed}/${limit} ce mois`,
            color: 'text-brand-600', bg: 'bg-brand-50',
          },
          {
            icon: Mail, label: 'Lettres créées',
            value: data.letters.length,
            sub:   isPremium ? 'Illimité' : `${ltUsed}/${limit} ce mois`,
            color: 'text-purple-600', bg: 'bg-purple-50',
          },
          {
            icon: Download, label: 'Exports',
            value: data.exports,
            sub:   'Total',
            color: 'text-green-600', bg: 'bg-green-50',
          },
          {
            icon: TrendingUp, label: 'Score ATS moyen',
            value: data.resumes.length > 0
              ? `${Math.round(data.resumes.reduce((a, r) => a + (r.atsScore ?? 70), 0) / data.resumes.length)}%`
              : '–',
            sub:   'Optimisation ATS',
            color: 'text-amber-600', bg: 'bg-amber-50',
          },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wide">{s.label}</p>
                <p className="text-3xl font-bold text-surface-900 mt-1">{s.value}</p>
                <p className="text-xs text-surface-400 mt-0.5">{s.sub}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent CV */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-surface-100">
            <h2 className="font-semibold text-surface-900">CV récents</h2>
            <Link href="/dashboard/cv" className="text-xs text-brand-600 hover:underline">Voir tout</Link>
          </div>

          {data.resumes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="h-12 w-12 rounded-xl bg-surface-50 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-surface-300" />
              </div>
              <p className="text-surface-500 text-sm mb-4">Aucun CV créé</p>
              <Link href="/dashboard/cv/create" className="btn-primary text-sm">
                <Plus className="h-4 w-4" /> Créer mon premier CV
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-surface-50">
              {data.resumes.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/dashboard/cv/${r.id}`}
                    className="flex items-center justify-between p-4 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-brand-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 text-sm">{r.title}</p>
                        <p className="text-xs text-surface-400">{formatDate(r.updatedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.atsScore && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                          ATS {r.atsScore}%
                        </span>
                      )}
                      {r.aiEnhanced && (
                        <span className="badge-brand">
                          <Sparkles className="h-3 w-3" /> IA
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Letters */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-surface-100">
            <h2 className="font-semibold text-surface-900">Lettres récentes</h2>
            <Link href="/dashboard/letters" className="text-xs text-brand-600 hover:underline">Voir tout</Link>
          </div>

          {data.letters.length === 0 ? (
            <div className="p-8 text-center">
              <div className="h-12 w-12 rounded-xl bg-surface-50 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-surface-300" />
              </div>
              <p className="text-surface-500 text-sm mb-4">Aucune lettre créée</p>
              <Link href="/dashboard/letters/create" className="btn-primary text-sm">
                <Plus className="h-4 w-4" /> Créer une lettre
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-surface-50">
              {data.letters.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/dashboard/letters/${l.id}`}
                    className="flex items-center justify-between p-4 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 text-sm">{l.title}</p>
                        <p className="text-xs text-surface-400">{l.targetCompany} — {l.targetJob}</p>
                      </div>
                    </div>
                    {l.aiGenerated && (
                      <span className="badge-brand">
                        <Sparkles className="h-3 w-3" /> IA
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
