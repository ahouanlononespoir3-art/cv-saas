// src/app/dashboard/cv/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  User, GraduationCap, Briefcase, Code2, Languages,
  Award, Users, Sparkles, Save, ChevronLeft, ChevronRight, Upload,
} from 'lucide-react';
import PersonalInfoForm  from '@/components/forms/PersonalInfoForm';
import EducationForm     from '@/components/forms/EducationForm';
import ExperienceForm    from '@/components/forms/ExperienceForm';
import SkillsForm        from '@/components/forms/SkillsForm';
import LanguagesForm     from '@/components/forms/LanguagesForm';
import CertificationsForm from '@/components/forms/CertificationsForm';
import TemplateSelector  from '@/components/cv/TemplateSelector';
import CVPreview         from '@/components/cv/CVPreview';
import type { ResumeContent, TemplateStyle } from '@/types';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'personal',       label: 'Infos personnelles', icon: User },
  { id: 'education',      label: 'Formation',          icon: GraduationCap },
  { id: 'experience',     label: 'Expériences',        icon: Briefcase },
  { id: 'skills',         label: 'Compétences',        icon: Code2 },
  { id: 'languages',      label: 'Langues',            icon: Languages },
  { id: 'certifications', label: 'Certifications',     icon: Award },
  { id: 'template',       label: 'Template & IA',      icon: Sparkles },
];

const EMPTY_CONTENT: ResumeContent = {
  personalInfo: {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', country: '', linkedIn: '',
    website: '', summary: '', title: '',
  },
  education:      [],
  experience:     [],
  skills:         [],
  languages:      [],
  certifications: [],
  references:     [],
};

export default function CreateCVPage() {
  const router = useRouter();
  const [step,      setStep]     = useState(0);
  const [content,   setContent]  = useState<ResumeContent>(EMPTY_CONTENT);
  const [template,  setTemplate] = useState<TemplateStyle>('MODERN');
  const [title,     setTitle]    = useState('Mon CV');
  const [targetJob, setTargetJob] = useState('');
  const [targetCo,  setTargetCo] = useState('');
  const [sector,    setSector]   = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [saving,    setSaving]   = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const patchContent = (partial: Partial<ResumeContent>) =>
    setContent(prev => ({ ...prev, ...partial }));

  const handleAIEnhance = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-cv', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content, targetJob, targetCompany: targetCo, targetSector: sector }),
      });
      const json = await res.json();
      if (json.success) {
        setContent(json.data.enhanced);
        toast.success(`CV amélioré ! Score ATS : ${json.data.atsScore}%`);
      } else {
        toast.error(json.error ?? 'Erreur IA');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/cv', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ title, template, content, targetJob, targetCompany: targetCo, targetSector: sector }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('CV sauvegardé !');
        router.push(`/dashboard/cv/${json.data.id}`);
      } else {
        toast.error(json.error ?? 'Erreur de sauvegarde');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImportCV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res  = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (json.success && json.data) {
      setContent(prev => ({ ...prev, ...json.data }));
      toast.success('CV importé et analysé !');
    }
  };

  const renderStep = () => {
    switch (STEPS[step].id) {
      case 'personal':
        return (
          <PersonalInfoForm
            value={content.personalInfo}
            onChange={pi => patchContent({ personalInfo: pi })}
            onImport={handleImportCV}
          />
        );
      case 'education':
        return (
          <EducationForm
            value={content.education}
            onChange={ed => patchContent({ education: ed })}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            value={content.experience}
            onChange={ex => patchContent({ experience: ex })}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            value={content.skills}
            onChange={sk => patchContent({ skills: sk })}
          />
        );
      case 'languages':
        return (
          <LanguagesForm
            value={content.languages}
            onChange={ln => patchContent({ languages: ln })}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            value={content.certifications}
            onChange={ce => patchContent({ certifications: ce })}
          />
        );
      case 'template':
        return (
          <div className="space-y-8">
            {/* Title & target job */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Titre du CV</label>
                <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Mon CV 2024" />
              </div>
              <div>
                <label className="label">Poste visé</label>
                <input className="input" value={targetJob} onChange={e => setTargetJob(e.target.value)} placeholder="Développeur React Senior" />
              </div>
              <div>
                <label className="label">Entreprise cible (optionnel)</label>
                <input className="input" value={targetCo} onChange={e => setTargetCo(e.target.value)} placeholder="Google, Amazon..." />
              </div>
              <div>
                <label className="label">Secteur d'activité</label>
                <input className="input" value={sector} onChange={e => setSector(e.target.value)} placeholder="Tech, Finance, Santé..." />
              </div>
            </div>

            {/* AI enhancement */}
            <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-brand-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-surface-900">Optimisation IA</h3>
                  <p className="text-sm text-surface-500 mt-1 mb-4">
                    Claude AI va corriger, reformuler professionnellement et optimiser votre CV pour les systèmes ATS.
                  </p>
                  <button
                    onClick={handleAIEnhance}
                    disabled={aiLoading}
                    className="btn-primary text-sm"
                  >
                    {aiLoading ? (
                      <><span className="animate-spin">⟳</span> Optimisation en cours...</>
                    ) : (
                      <><Sparkles className="h-4 w-4" /> Optimiser avec l'IA</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Template selector */}
            <div>
              <h3 className="font-semibold text-surface-900 mb-4">Choisissez votre template</h3>
              <TemplateSelector selected={template} onSelect={setTemplate} plan={/* will be fetched */ 'FREE'} />
            </div>

            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary w-full justify-center"
            >
              {showPreview ? 'Masquer' : 'Aperçu du CV'}
            </button>

            {showPreview && (
              <div className="rounded-2xl border border-surface-200 overflow-hidden">
                <CVPreview content={content} template={template} scale={0.7} />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Créer un nouveau CV</h1>
          <p className="text-surface-500 text-sm mt-1">Étape {step + 1} sur {STEPS.length}</p>
        </div>
        {step === STEPS.length - 1 && (
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? '⟳ Sauvegarde...' : <><Save className="h-4 w-4" /> Sauvegarder</>}
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-8 overflow-x-auto no-scrollbar">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium flex-shrink-0 transition-all',
              i === step
                ? 'bg-brand-600 text-white shadow-sm'
                : i < step
                ? 'bg-brand-50 text-brand-700'
                : 'bg-surface-100 text-surface-500',
            )}
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="card p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-secondary"
        >
          <ChevronLeft className="h-4 w-4" /> Précédent
        </button>

        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} className="btn-primary">
            Suivant <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? '⟳ Sauvegarde...' : <><Save className="h-4 w-4" /> Terminer & Sauvegarder</>}
          </button>
        )}
      </div>
    </div>
  );
}
