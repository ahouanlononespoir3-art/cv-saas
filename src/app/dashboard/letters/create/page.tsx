// src/app/dashboard/letters/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Sparkles, Save, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CreateLetterPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const resumeId     = searchParams.get('resumeId');

  const [form, setForm] = useState({
    title:         '',
    targetJob:     '',
    targetCompany: '',
    targetSector:  '',
    tone:          'PROFESSIONAL' as 'PROFESSIONAL' | 'CREATIVE' | 'FORMAL',
  });
  const [content,   setContent]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [generated, setGenerated] = useState(false);

  const patch = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    if (!form.targetJob || !form.targetCompany) {
      toast.error('Poste et entreprise requis');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch('/api/ai/generate-letter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, resumeId }),
      });
      const json = await res.json();
      if (json.success) {
        setContent(json.data.content);
        setGenerated(true);
        if (!form.title) patch('title', `Lettre — ${form.targetJob} chez ${form.targetCompany}`);
        toast.success('Lettre générée !');
      } else {
        toast.error(json.error ?? 'Erreur IA');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) { toast.error('Générez d\'abord la lettre'); return; }
    setSaving(true);
    try {
      const res  = await fetch('/api/letters', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, content, resumeId }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Lettre sauvegardée !');
        router.push(`/dashboard/letters/${json.data.id}`);
      } else {
        toast.error(json.error ?? 'Erreur');
      }
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-2xl font-bold text-surface-900">Nouvelle lettre de motivation</h1>
            <p className="text-sm text-surface-400 mt-0.5">Générée par Claude AI en quelques secondes</p>
          </div>
        </div>
        {generated && (
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? '⟳ Sauvegarde...' : <><Save className="h-4 w-4" /> Sauvegarder</>}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        {/* Letter preview */}
        <div className="card">
          <div className="flex items-center gap-2 p-5 border-b border-surface-100">
            <Mail className="h-4 w-4 text-surface-400" />
            <span className="font-medium text-surface-900 text-sm">Lettre de motivation</span>
          </div>
          <div className="p-6">
            {content ? (
              <textarea
                className="w-full h-[500px] text-sm text-surface-700 leading-relaxed resize-none border-0 focus:outline-none focus:ring-0"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center text-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-brand-50 flex items-center justify-center animate-float">
                  <Sparkles className="h-8 w-8 text-brand-500" />
                </div>
                <div>
                  <p className="font-medium text-surface-700">Remplissez le formulaire</p>
                  <p className="text-sm text-surface-400 mt-1">et cliquez sur "Générer avec l'IA"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="card p-6 h-fit space-y-5">
          <h2 className="font-semibold text-surface-900">Informations</h2>

          <div>
            <label className="label">Titre de la lettre</label>
            <input className="input" placeholder="Lettre — Développeur chez Startup" value={form.title} onChange={e => patch('title', e.target.value)} />
          </div>

          <div>
            <label className="label">Poste visé <span className="text-red-400">*</span></label>
            <input className="input" placeholder="Développeur Full Stack Senior" value={form.targetJob} onChange={e => patch('targetJob', e.target.value)} />
          </div>

          <div>
            <label className="label">Entreprise <span className="text-red-400">*</span></label>
            <input className="input" placeholder="Google, Startup SaaS..." value={form.targetCompany} onChange={e => patch('targetCompany', e.target.value)} />
          </div>

          <div>
            <label className="label">Secteur d'activité</label>
            <input className="input" placeholder="Tech, Finance, Santé..." value={form.targetSector} onChange={e => patch('targetSector', e.target.value)} />
          </div>

          <div>
            <label className="label">Ton de la lettre</label>
            <select className="input" value={form.tone} onChange={e => patch('tone', e.target.value)}>
              <option value="PROFESSIONAL">Professionnel (recommandé)</option>
              <option value="CREATIVE">Créatif et original</option>
              <option value="FORMAL">Formel et conventionnel</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? (
              <><span className="animate-spin inline-block mr-1">⟳</span> Génération IA en cours...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Générer avec l'IA</>
            )}
          </button>

          {generated && (
            <button onClick={handleSave} disabled={saving} className="btn-secondary w-full justify-center">
              {saving ? '⟳ Sauvegarde...' : <><Save className="h-4 w-4" /> Sauvegarder la lettre</>}
            </button>
          )}

          <p className="text-xs text-surface-400 text-center">
            Vous pouvez modifier la lettre générée avant de la sauvegarder.
          </p>
        </div>
      </div>
    </div>
  );
}
