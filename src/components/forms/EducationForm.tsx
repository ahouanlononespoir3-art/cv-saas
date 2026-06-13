// src/components/forms/EducationForm.tsx
'use client';

import { useState } from 'react';
import { Plus, Trash2, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import type { Education } from '@/types';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  value:    Education[];
  onChange: (value: Education[]) => void;
}

const EMPTY: Omit<Education, 'id'> = {
  school: '', degree: '', field: '',
  startDate: '', endDate: '', current: false,
  grade: '', description: '',
};

export default function EducationForm({ value, onChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(value[0]?.id ?? null);

  const add = () => {
    const newItem = { ...EMPTY, id: generateId() };
    onChange([...value, newItem]);
    setOpenId(newItem.id);
  };

  const remove = (id: string) => onChange(value.filter(e => e.id !== id));

  const patch = (id: string, partial: Partial<Education>) =>
    onChange(value.map(e => e.id === id ? { ...e, ...partial } : e));

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-surface-200 p-8 text-center">
          <GraduationCap className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm mb-4">Aucune formation ajoutée</p>
        </div>
      ) : (
        value.map((edu, idx) => (
          <div key={edu.id} className="rounded-2xl border border-surface-200 overflow-hidden">
            {/* Header */}
            <button
              type="button"
              onClick={() => setOpenId(openId === edu.id ? null : edu.id)}
              className="w-full flex items-center justify-between px-5 py-4 bg-surface-50 hover:bg-surface-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-100 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-brand-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-surface-900 text-sm">
                    {edu.school || `Formation ${idx + 1}`}
                  </p>
                  {edu.degree && (
                    <p className="text-xs text-surface-400">{edu.degree} {edu.field && `— ${edu.field}`}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); remove(edu.id); }}
                  className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {openId === edu.id ? <ChevronUp className="h-4 w-4 text-surface-400" /> : <ChevronDown className="h-4 w-4 text-surface-400" />}
              </div>
            </button>

            {/* Body */}
            {openId === edu.id && (
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label">Établissement <span className="text-red-400">*</span></label>
                    <input className="input" placeholder="Université Paris-Saclay" value={edu.school} onChange={e => patch(edu.id, { school: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Diplôme</label>
                    <input className="input" placeholder="Master, Licence, BTS..." value={edu.degree} onChange={e => patch(edu.id, { degree: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Domaine</label>
                    <input className="input" placeholder="Informatique, Marketing..." value={edu.field} onChange={e => patch(edu.id, { field: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Date de début</label>
                    <input type="month" className="input" value={edu.startDate} onChange={e => patch(edu.id, { startDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Date de fin</label>
                    <input
                      type="month" className={cn('input', edu.current && 'opacity-50')}
                      value={edu.endDate} disabled={edu.current}
                      onChange={e => patch(edu.id, { endDate: e.target.value })}
                    />
                    <label className="flex items-center gap-2 mt-2 text-sm text-surface-600 cursor-pointer">
                      <input type="checkbox" checked={edu.current} onChange={e => patch(edu.id, { current: e.target.checked, endDate: '' })} className="rounded" />
                      En cours
                    </label>
                  </div>
                  <div>
                    <label className="label">Mention / Note</label>
                    <input className="input" placeholder="Mention Bien, 16/20..." value={edu.grade ?? ''} onChange={e => patch(edu.id, { grade: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label">Description (optionnel)</label>
                  <textarea className="input h-20 resize-none" placeholder="Projets, activités, réalisations..." value={edu.description ?? ''} onChange={e => patch(edu.id, { description: e.target.value })} />
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <button type="button" onClick={add} className="btn-secondary w-full justify-center border-dashed">
        <Plus className="h-4 w-4" /> Ajouter une formation
      </button>
    </div>
  );
}
