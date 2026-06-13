// src/components/forms/LanguagesForm.tsx
'use client';

import { Plus, X } from 'lucide-react';
import type { Language } from '@/types';
import { generateId, LANGUAGE_LEVELS } from '@/lib/utils';

interface Props { value: Language[]; onChange: (v: Language[]) => void; }

export default function LanguagesForm({ value, onChange }: Props) {
  const add = () => onChange([...value, { id: generateId(), name: '', level: 'B2' }]);
  const remove = (id: string) => onChange(value.filter(l => l.id !== id));
  const patch = (id: string, k: keyof Language, v: string) =>
    onChange(value.map(l => l.id === id ? { ...l, [k]: v } : l));

  return (
    <div className="space-y-4">
      <p className="text-sm text-surface-500">Ajoutez les langues que vous maîtrisez.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {value.map(lang => (
          <div key={lang.id} className="flex gap-2 items-center">
            <input
              className="input flex-1"
              placeholder="Français, Anglais, Espagnol..."
              value={lang.name}
              onChange={e => patch(lang.id, 'name', e.target.value)}
            />
            <select
              className="input w-44 flex-shrink-0"
              value={lang.level}
              onChange={e => patch(lang.id, 'level', e.target.value as Language['level'])}
            >
              {Object.entries(LANGUAGE_LEVELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button type="button" onClick={() => remove(lang.id)} className="p-2 text-surface-400 hover:text-red-500 transition-colors flex-shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="rounded-xl bg-surface-50 p-4 text-center text-sm text-surface-400">
          Aucune langue ajoutée
        </div>
      )}

      <button type="button" onClick={add} className="btn-secondary text-sm">
        <Plus className="h-4 w-4" /> Ajouter une langue
      </button>

      <div>
        <p className="text-xs font-medium text-surface-500 mb-2">Suggestions</p>
        <div className="flex flex-wrap gap-2">
          {['Français', 'Anglais', 'Espagnol', 'Allemand', 'Arabe', 'Portugais', 'Mandarin'].map(l => (
            <button
              key={l}
              type="button"
              onClick={() => {
                if (!value.find(v => v.name === l))
                  onChange([...value, { id: generateId(), name: l, level: l === 'Français' ? 'NATIVE' : 'B2' }]);
              }}
              className="rounded-full border border-surface-200 px-3 py-1 text-xs text-surface-600 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
            >
              + {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
