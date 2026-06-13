// src/app/dashboard/cv/[id]/CVDetailClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Download, Sparkles, Trash2, Edit2, FileText,
  ArrowLeft, FileDown, Crown, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import CVPreview from '@/components/cv/CVPreview';
import TemplateSelector from '@/components/cv/TemplateSelector';
import type { Resume, TemplateStyle } from '@/types';

interface Props {
  resume: Resume;
  plan:   string;
}

export default function CVDetailClient({ resume, plan }: Props) {
  const router = useRouter();
  const [template, setTemplate]   = useState<TemplateStyle>(resume.template);
  const [aiLoading, setAiLoading] = useState(false);
  const [exporting, setExporting] = useState<'PDF' | 'DOCX' | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const isPremium = plan === 'PREMIUM';

  const handleAIEnhance = async () => {
    setAiLoading(true);
    try {
      const res  = await fetch('/api/ai/generate-cv', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          content:       resume.content,
          targetJob:     resume.targetJob,
          targetCompany: resume.targetCompany,
          targetSector:  resume.targetSector,
          resumeId:      resume.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`CV optimisé ! Score ATS : ${json.data.atsScore}%`);
        router.refresh();
      } else {
        toast.error(json.error ?? 'Erreur IA');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleExport = async (format: 'PDF' | 'DOCX') => {
    if (format === 'DOCX' && !isPremium) {
      toast.error('Export DOCX disponible uniquement en Premium');
      return;
    }
    setExporting(format);
    try {
      const res = await fetch(`/api/export/${format.toLowerCase()}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ resumeId: resume.id }),
      });
      if (!res.ok) {
        toast.error('Erreur lors de l\'export');
        return;
      }
      const blob     = await res.blob();
      const url      = URL.createObjectURL(blob);
      const link     = document.createElement('a');
      link.href      = url;
      link.download  = `${resume.title}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`${format} téléchargé !`);
    } finally {
      setExporting(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce CV définitivement ?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cv/${resume.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('CV supprimé');
        router.push('/dashboard/cv');
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleTemplateChange = async (t: TemplateStyle) => {
    setTemplate(t);
    await fetch(`/api/cv/${resume.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ template: t }),
    });
  };

  return (
    <div className="animate-fade-up">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cv" className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-surface-900">{resume.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {resume.aiEnhanced && (
                <span className="badge-brand text-[10px]">
                  <Sparkles className="h-2.5 w-2.5" /> IA optimisé
                </span>
              )}
              {resume.atsScore && (
                <span className="text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                  ATS {resume.atsScore}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/cv/${resume.id}/edit`} className="btn-secondary text-sm">
            <Edit2 className="h-4 w-4" /> Modifier
          </Link>

          <button onClick={handleAIEnhance} disabled={aiLoading} className="btn-primary text-sm">
            {aiLoading ? (
              <><span className="animate-spin inline-block">⟳</span> Optimisation...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Optimiser IA</>
            )}
          </button>

          <button
            onClick={() => handleExport('PDF')}
            disabled={exporting === 'PDF'}
            className="btn-secondary text-sm"
          >
            {exporting === 'PDF' ? '⟳' : <Download className="h-4 w-4" />}
            PDF
          </button>

          <button
            onClick={() => handleExport('DOCX')}
            disabled={exporting === 'DOCX' || !isPremium}
            className={`btn-secondary text-sm ${!isPremium ? 'opacity-50' : ''}`}
            title={!isPremium ? 'Premium requis' : ''}
          >
            {!isPremium && <Crown className="h-3.5 w-3.5 text-amber-500" />}
            {exporting === 'DOCX' ? '⟳' : <FileDown className="h-4 w-4" />}
            DOCX
          </button>

          <button onClick={handleDelete} disabled={deleting} className="p-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* CV Preview */}
        <div className="card overflow-hidden">
          <div className="bg-surface-50 border-b border-surface-100 px-5 py-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-surface-400" />
            <span className="text-sm text-surface-600 font-medium">Aperçu du CV</span>
          </div>
          <div className="p-6 overflow-auto bg-surface-50">
            <div className="shadow-xl mx-auto" style={{ width: 'fit-content' }}>
              <CVPreview content={resume.content as any} template={template} scale={0.75} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Templates */}
          <div className="card p-5">
            <h3 className="font-semibold text-surface-900 mb-4 text-sm">Changer de template</h3>
            <TemplateSelector selected={template} onSelect={handleTemplateChange} plan={plan} />
          </div>

          {/* Details */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-surface-900 text-sm">Détails</h3>
            {resume.targetJob && (
              <div>
                <p className="text-xs text-surface-400">Poste visé</p>
                <p className="text-sm text-surface-700 font-medium">{resume.targetJob}</p>
              </div>
            )}
            {resume.targetCompany && (
              <div>
                <p className="text-xs text-surface-400">Entreprise cible</p>
                <p className="text-sm text-surface-700 font-medium">{resume.targetCompany}</p>
              </div>
            )}
            {resume.targetSector && (
              <div>
                <p className="text-xs text-surface-400">Secteur</p>
                <p className="text-sm text-surface-700 font-medium">{resume.targetSector}</p>
              </div>
            )}
          </div>

          {/* Generate cover letter */}
          <Link
            href={`/dashboard/letters/create?resumeId=${resume.id}`}
            className="card p-5 flex items-center gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-surface-900 text-sm">Générer une lettre</p>
              <p className="text-xs text-surface-400">Basée sur ce CV</p>
            </div>
            <ExternalLink className="h-4 w-4 text-surface-400 flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
