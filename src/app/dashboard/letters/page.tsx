// src/app/dashboard/letters/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Mail, Sparkles, Building2, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function LettersPage() {
  const session = await auth();
  const letters = await prisma.coverLetter.findMany({
    where:   { userId: session!.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Mes lettres de motivation</h1>
          <p className="text-surface-500 text-sm mt-1">{letters.length} lettre{letters.length > 1 ? 's' : ''} créée{letters.length > 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/letters/create" className="btn-primary">
          <Plus className="h-4 w-4" /> Nouvelle lettre
        </Link>
      </div>

      {letters.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="h-20 w-20 rounded-3xl bg-purple-50 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-purple-300" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 mb-2">Aucune lettre créée</h2>
          <p className="text-surface-500 text-sm mb-6 max-w-sm mx-auto">
            Générez une lettre de motivation professionnelle en 10 secondes avec l'IA.
          </p>
          <Link href="/dashboard/letters/create" className="btn-primary inline-flex">
            <Sparkles className="h-4 w-4" /> Générer avec l'IA
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {letters.map((letter) => (
            <Link
              key={letter.id}
              href={`/dashboard/letters/${letter.id}`}
              className="card-hover p-5 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-surface-900 text-sm truncate">{letter.title}</h3>
                  {letter.aiGenerated && (
                    <span className="badge-brand text-[10px] flex-shrink-0">
                      <Sparkles className="h-2.5 w-2.5" /> IA
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-surface-500">
                    <Briefcase className="h-3 w-3" /> {letter.targetJob}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-surface-500">
                    <Building2 className="h-3 w-3" /> {letter.targetCompany}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-xs text-surface-400">{formatDate(letter.updatedAt)}</p>
                <p className="text-xs text-surface-300 mt-0.5">{letter.content.length} caractères</p>
              </div>
            </Link>
          ))}

          {/* New letter card */}
          <Link
            href="/dashboard/letters/create"
            className="card border-dashed border-2 border-surface-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all p-5 flex items-center justify-center gap-3 group"
          >
            <Plus className="h-5 w-5 text-surface-400 group-hover:text-purple-600 transition-colors" />
            <span className="text-sm font-medium text-surface-500 group-hover:text-purple-600 transition-colors">
              Nouvelle lettre
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
