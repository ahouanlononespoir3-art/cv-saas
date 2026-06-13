// src/app/dashboard/cv/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, FileText, Sparkles, MoreHorizontal, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TEMPLATE_LABELS: Record<string, string> = {
  MODERN:     'Moderne',
  CLASSIC:    'Classique',
  MINIMALIST: 'Minimaliste',
  PREMIUM:    'Premium',
  CORPORATE:  'Corporate',
};

const TEMPLATE_COLORS: Record<string, string> = {
  MODERN:     'bg-brand-100 text-brand-700',
  CLASSIC:    'bg-surface-100 text-surface-700',
  MINIMALIST: 'bg-gray-100 text-gray-700',
  PREMIUM:    'bg-amber-100 text-amber-700',
  CORPORATE:  'bg-blue-100 text-blue-700',
};

export default async function CVListPage() {
  const session = await auth();
  const resumes = await prisma.resume.findMany({
    where:   { userId: session!.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  const exports = await prisma.export.groupBy({
    by:    ['resumeId'],
    where: { userId: session!.user.id },
    _count: { id: true },
  });
  const exportMap = Object.fromEntries(exports.map(e => [e.resumeId, e._count.id]));

  return (
    <div className="animate-fade-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Mes CV</h1>
          <p className="text-surface-500 text-sm mt-1">{resumes.length} CV créé{resumes.length > 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/cv/create" className="btn-primary">
          <Plus className="h-4 w-4" /> Nouveau CV
        </Link>
      </div>

      {/* Empty state */}
      {resumes.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="h-20 w-20 rounded-3xl bg-brand-50 flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-brand-300" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 mb-2">Aucun CV créé</h2>
          <p className="text-surface-500 text-sm mb-6 max-w-sm mx-auto">
            Créez votre premier CV professionnel en quelques minutes grâce à l'IA.
          </p>
          <Link href="/dashboard/cv/create" className="btn-primary inline-flex">
            <Plus className="h-4 w-4" /> Créer mon premier CV
          </Link>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <Link
              key={resume.id}
              href={`/dashboard/cv/${resume.id}`}
              className="card-hover p-5 flex flex-col gap-4 group"
            >
              {/* Preview thumbnail */}
              <div className="h-36 rounded-xl bg-gradient-to-br from-surface-50 to-brand-50/30 border border-surface-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 p-4 flex flex-col gap-1.5 opacity-40">
                  <div className="h-3 w-24 bg-brand-300 rounded-full" />
                  <div className="h-2 w-16 bg-brand-200 rounded-full" />
                  <div className="mt-1 space-y-1">
                    {[1, 0.8, 0.6, 0.9, 0.7].map((w, i) => (
                      <div key={i} className="h-1.5 bg-surface-300 rounded-full" style={{ width: `${w * 100}%` }} />
                    ))}
                  </div>
                </div>
                <FileText className="h-8 w-8 text-brand-200 relative z-10" />
              </div>

              {/* Info */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-surface-900 text-sm leading-tight group-hover:text-brand-700 transition-colors">
                    {resume.title}
                  </h3>
                  <MoreHorizontal className="h-4 w-4 text-surface-300 flex-shrink-0 mt-0.5" />
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`badge text-[10px] ${TEMPLATE_COLORS[resume.template] ?? 'bg-surface-100 text-surface-600'}`}>
                    {TEMPLATE_LABELS[resume.template] ?? resume.template}
                  </span>
                  {resume.aiEnhanced && (
                    <span className="badge-brand text-[10px]">
                      <Sparkles className="h-2.5 w-2.5" /> IA
                    </span>
                  )}
                  {resume.atsScore != null && (
                    <span className="badge bg-green-50 text-green-700 text-[10px]">
                      ATS {resume.atsScore}%
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-surface-50">
                <span className="text-xs text-surface-400">{formatDate(resume.updatedAt)}</span>
                {exportMap[resume.id] && (
                  <span className="flex items-center gap-1 text-xs text-surface-400">
                    <Download className="h-3 w-3" /> {exportMap[resume.id]}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {/* New CV card */}
          <Link
            href="/dashboard/cv/create"
            className="card border-dashed border-2 border-surface-200 hover:border-brand-400 hover:bg-brand-50/30 transition-all p-5 flex flex-col items-center justify-center gap-3 min-h-[200px] group"
          >
            <div className="h-12 w-12 rounded-2xl bg-surface-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
              <Plus className="h-6 w-6 text-surface-400 group-hover:text-brand-600 transition-colors" />
            </div>
            <span className="text-sm font-medium text-surface-500 group-hover:text-brand-600 transition-colors">
              Nouveau CV
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
