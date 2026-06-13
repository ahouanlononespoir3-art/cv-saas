// src/components/forms/SkillsForm.tsx
'use client';

import { Plus, X } from 'lucide-react';
import type { Skill } from '@/types';
import { generateId, SKILL_LEVELS } from '@/lib/utils';

interface Props { value: Skill[]; onChange: (v: Skill[]) => void; }

const LEVEL_COLORS = {
  BEGINNER:     'bg-surface-200 text-surface-600',
  INTERMEDIATE: 'bg-blue-100 text-blue-700',
  ADVANCED:     'bg-brand-100 text-brand-700',
  EXPERT:       'bg-purple-100 text-purple-700',
};

export default function SkillsForm({ value, onChange }: Props) {
  const add = () => onChange([...value, { id: generateId(), name: '', level: 'INTERMEDIATE' }]);
  const remove = (id: string) => onChange(value.filter(s => s.id !== id));
  const patch = (id: string, k: keyof Skill, v: string) =>
    onChange(value.map(s => s.id === id ? { ...s, [k]: v } : s));

  return (
    <div className="space-y-4">
      <p className="text-sm text-surface-500">Listez vos compétences techniques et transversales.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {value.map(skill => (
          <div key={skill.id} className="flex gap-2 items-center">
            <input
              className="input flex-1"
              placeholder="React, Python, Leadership..."
              value={skill.name}
              onChange={e => patch(skill.id, 'name', e.target.value)}
            />
            <select
              className="input w-36 flex-shrink-0"
              value={skill.level}
              onChange={e => patch(skill.id, 'level', e.target.value as Skill['level'])}
            >
              {Object.entries(SKILL_LEVELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button type="button" onClick={() => remove(skill.id)} className="p-2 text-surface-400 hover:text-red-500 transition-colors flex-shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="rounded-xl bg-surface-50 p-4 text-center text-sm text-surface-400">
          Aucune compétence ajoutée
        </div>
      )}

      <button type="button" onClick={add} className="btn-secondary text-sm">
        <Plus className="h-4 w-4" /> Ajouter une compétence
      </button>

      {/* Suggestions */}
      <div>
        <p className="text-xs font-medium text-surface-500 mb-2">Suggestions rapides</p>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'Docker', 'Figma', 'Excel', 'Communication', 'Management'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (!value.find(v => v.name === s))
                  onChange([...value, { id: generateId(), name: s, level: 'INTERMEDIATE' }]);
              }}
              className="rounded-full border border-surface-200 px-3 py-1 text-xs text-surface-600 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
