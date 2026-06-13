// src/app/dashboard/letters/[id]/LetterDetailClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Trash2, Download, Copy, Building2, Briefcase, Globe } from 'lucide-react';
import Link from 'next/link';
import type { CoverLetter } from '@/types';

interface Props { letter: CoverLetter }

export default function LetterDetailClient({ letter }: Props) {
  const router = useRouter();
  const [content, setContent] = useState(letter.content);
  const [saving,  setSaving]  = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/letters/${letter.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content }),
      });
      if (res.ok) toast.success('Lettre sauvegardée !');
      else toast.error('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer cette lettre définitivement ?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/letters/${letter.id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Lettre supprimée'); router.push('/dashboard/letters'); }
    } finally {
      setDeleting(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    toast.success('Copié dans le presse-papiers !');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${letter.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Téléchargé !');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/letters" className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-surface-900">{letter.title}</h1>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-surface-400">
              <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {letter.targetJob}</span>
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {letter.targetCompany}</span>
              {letter.targetSector && <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {letter.targetSector}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="btn-secondary text-sm">
            <Copy className="h-4 w-4" /> Copier
          </button>
          <button onClick={handleDownload} className="btn-secondary text-sm">
            <Download className="h-4 w-4" /> Télécharger
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
            {saving ? '⟳' : <Save className="h-4 w-4" />} Sauvegarder
          </button>
          <button onClick={handleDelete} disabled={deleting} className="p-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Letter editor */}
      <div className="card overflow-hidden">
        <div className="bg-surface-50 border-b border-surface-100 px-5 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-surface-700">Lettre de motivation</span>
          <span className="text-xs text-surface-400">{content.split(' ').length} mots</span>
        </div>

        <div className="p-8">
          {/* Letter header decoration */}
          <div className="mb-6 pb-6 border-b border-surface-100">
            <p className="text-sm font-semibold text-surface-900">{letter.targetCompany}</p>
            <p className="text-sm text-surface-500">Objet : Candidature au poste de {letter.targetJob}</p>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full text-sm text-surface-700 leading-relaxed resize-none border-0 focus:outline-none focus:ring-0 min-h-[500px]"
            style={{ fontFamily: 'Georgia, serif' }}
          />

          <div className="mt-6 pt-6 border-t border-surface-100">
            <p className="text-sm text-surface-500">Cordialement,</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 card p-4">
        <p className="text-xs font-medium text-surface-700 mb-2">💡 Conseils</p>
        <ul className="space-y-1">
          {[
            'Personnalisez la lettre avec le nom du recruteur si possible',
            'Mentionnez un projet ou une réalisation spécifique de l\'entreprise',
            'Relisez et adaptez le ton selon la culture d\'entreprise',
            'Limitez-vous à une page (350-450 mots recommandés)',
          ].map((tip, i) => (
            <li key={i} className="text-xs text-surface-500 flex gap-2">
              <span className="text-brand-400 flex-shrink-0">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
