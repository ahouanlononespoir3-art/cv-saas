// src/components/forms/CertificationsForm.tsx
'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { Certification } from '@/types';
import { generateId } from '@/lib/utils';

interface Props { value: Certification[]; onChange: (v: Certification[]) => void; }

export default function CertificationsForm({ value, onChange }: Props) {
  const add = () => onChange([...value, { id: generateId(), name: '', issuer: '', date: '', url: '' }]);
  const remove = (id: string) => onChange(value.filter(c => c.id !== id));
  const patch = (id: string, k: keyof Certification, v: string) =>
    onChange(value.map(c => c.id === id ? { ...c, [k]: v } : c));

  return (
    <div className="space-y-4">
      <p className="text-sm text-surface-500">Certifications, diplômes supplémentaires, MOOC, etc.</p>

      {value.map((cert, idx) => (
        <div key={cert.id} className="rounded-2xl border border-surface-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-surface-700">Certification {idx + 1}</span>
            <button type="button" onClick={() => remove(cert.id)} className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Nom de la certification</label>
              <input className="input" placeholder="AWS Solutions Architect, TOEIC..." value={cert.name} onChange={e => patch(cert.id, 'name', e.target.value)} />
            </div>
            <div>
              <label className="label">Organisme</label>
              <input className="input" placeholder="Amazon, Coursera, OpenClassrooms..." value={cert.issuer} onChange={e => patch(cert.id, 'issuer', e.target.value)} />
            </div>
            <div>
              <label className="label">Date d'obtention</label>
              <input type="month" className="input" value={cert.date} onChange={e => patch(cert.id, 'date', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Lien de vérification (optionnel)</label>
              <input type="url" className="input" placeholder="https://credly.com/..." value={cert.url ?? ''} onChange={e => patch(cert.id, 'url', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      {value.length === 0 && (
        <div className="rounded-xl bg-surface-50 p-4 text-center text-sm text-surface-400">
          Aucune certification ajoutée
        </div>
      )}

      <button type="button" onClick={add} className="btn-secondary w-full justify-center border-dashed">
        <Plus className="h-4 w-4" /> Ajouter une certification
      </button>
    </div>
  );
}
