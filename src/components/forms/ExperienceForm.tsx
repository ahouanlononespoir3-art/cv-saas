// src/components/forms/ExperienceForm.tsx
'use client';

import { useState } from 'react';
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp, PlusCircle, X } from 'lucide-react';
import type { Experience } from '@/types';
import { generateId, cn } from '@/lib/utils';

interface Props {
  value:    Experience[];
  onChange: (value: Experience[]) => void;
}

const EMPTY: Omit<Experience, 'id'> = {
  company: '', position: '', location: '',
  startDate: '', endDate: '', current: false,
  description: '', achievements: [],
};

export default function ExperienceForm({ value, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(value[0]?.id ?? null);

  const add = () => {
    const item = { ...EMPTY, id: generateId() };
    onChange([...value, item]);
    setOpenId(item.id);
  };

  const remove = (id: string) => onChange(value.filter(e => e.id !== id));

  const patch = (id: string, partial: Partial<Experience>) =>
    onChange(value.map(e => e.id === id ? { ...e, ...partial } : e));

  const addAchievement = (id: string) =>
    patch(id, { achievements: [...(value.find(e => e.id === id)?.achievements ?? []), ''] });

  const updateAchievement = (id: string, i: number, text: string) => {
    const exp = value.find(e => e.id === id);
    if (!exp) return;
    const ach = [...(exp.achievements ?? [])];
    ach[i] = text;
    patch(id, { achievements: ach });
  };

  const removeAchievement = (id: string, i: number) => {
    const exp = value.find(e => e.id === id);
    if (!exp) return;
    patch(id, { achievements: (exp.achievements ?? []).filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-surface-200 p-8 text-center">
          <Briefcase className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm mb-4">Aucune expérience ajoutée</p>
        </div>
      ) : (
        value.map((exp, idx) => (
          <div key={exp.id} className="rounded-2xl border border-surface-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(openId === exp.id ? null : exp.id)}
              className="w-full flex items-center justify-between px-5 py-4 bg-surface-50 hover:bg-surface-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-surface-900 text-sm">
                    {exp.position || `Expérience ${idx + 1}`}
                  </p>
                  {exp.company && <p className="text-xs text-surface-400">{exp.company}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={e => { e.stopPropagation(); remove(exp.id); }} className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {openId === exp.id ? <ChevronUp className="h-4 w-4 text-surface-400" /> : <ChevronDown className="h-4 w-4 text-surface-400" />}
              </div>
            </button>

            {openId === exp.id && (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Poste <span className="text-red-400">*</span></label>
                    <input className="input" placeholder="Développeur Full Stack" value={exp.position} onChange={e => patch(exp.id, { position: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Entreprise <span className="text-red-400">*</span></label>
                    <input className="input" placeholder="Google, Startup SaaS..." value={exp.company} onChange={e => patch(exp.id, { company: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Lieu</label>
                    <input className="input" placeholder="Paris, Remote..." value={exp.location ?? ''} onChange={e => patch(exp.id, { location: e.target.value })} />
                  </div>
                  <div />
                  <div>
                    <label className="label">Date de début</label>
                    <input type="month" className="input" value={exp.startDate} onChange={e => patch(exp.id, { startDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Date de fin</label>
                    <input type="month" className={cn('input', exp.current && 'opacity-50')} value={exp.endDate ?? ''} disabled={exp.current} onChange={e => patch(exp.id, { endDate: e.target.value })} />
                    <label className="flex items-center gap-2 mt-2 text-sm text-surface-600 cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={e => patch(exp.id, { current: e.target.checked, endDate: '' })} className="rounded" />
                      Poste actuel
                    </label>
                  </div>
                </div>

                <div>
                  <label className="label">Description des missions</label>
                  <textarea
                    className="input h-24 resize-none"
                    placeholder="Décrivez vos responsabilités principales..."
                    value={exp.description}
                    onChange={e => patch(exp.id, { description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Réalisations clés (optionnel)</label>
                  <p className="text-xs text-surface-400 mb-2">Quantifiez si possible : "Augmenté les ventes de 30%"</p>
                  <div className="space-y-2">
                    {(exp.achievements ?? []).map((ach, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-brand-400 mt-2.5 flex-shrink-0">•</span>
                        <input
                          className="input"
                          placeholder="Réalisation ou résultat mesurable..."
                          value={ach}
                          onChange={e => updateAchievement(exp.id, i, e.target.value)}
                        />
                        <button type="button" onClick={() => removeAchievement(exp.id, i)} className="p-2 text-surface-400 hover:text-red-500 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addAchievement(exp.id)} className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium">
                      <PlusCircle className="h-4 w-4" /> Ajouter une réalisation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <button type="button" onClick={add} className="btn-secondary w-full justify-center border-dashed">
        <Plus className="h-4 w-4" /> Ajouter une expérience
      </button>
    </div>
  );
}
