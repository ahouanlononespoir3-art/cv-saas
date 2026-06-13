// src/components/forms/PersonalInfoForm.tsx
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import type { PersonalInfo } from '@/types';

interface Props {
  value:    PersonalInfo;
  onChange: (value: PersonalInfo) => void;
  onImport?: (file: File) => void;
}

const FIELDS: Array<{
  key:         keyof PersonalInfo;
  label:       string;
  placeholder: string;
  type?:       string;
  required?:   boolean;
  col?:        number;
}> = [
  { key: 'firstName',  label: 'Prénom',       placeholder: 'Jean',                 required: true  },
  { key: 'lastName',   label: 'Nom',          placeholder: 'Dupont',               required: true  },
  { key: 'title',      label: 'Titre professionnel', placeholder: 'Développeur Full Stack', col: 2 },
  { key: 'email',      label: 'Email',        placeholder: 'jean@exemple.com',     type: 'email', required: true },
  { key: 'phone',      label: 'Téléphone',    placeholder: '+33 6 12 34 56 78',    required: true  },
  { key: 'address',    label: 'Adresse',      placeholder: '123 Rue de la Paix'  },
  { key: 'city',       label: 'Ville',        placeholder: 'Paris'               },
  { key: 'country',    label: 'Pays',         placeholder: 'France'              },
  { key: 'linkedIn',   label: 'LinkedIn',     placeholder: 'linkedin.com/in/jean' },
  { key: 'website',    label: 'Site web',     placeholder: 'jean-dupont.fr'      },
];

export default function PersonalInfoForm({ value, onChange, onImport }: Props) {
  const patch = (key: keyof PersonalInfo, val: string) =>
    onChange({ ...value, [key]: val });

  const onDrop = useCallback((files: File[]) => {
    if (files[0] && onImport) onImport(files[0]);
  }, [onImport]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: !onImport,
  });

  return (
    <div className="space-y-6">
      {/* Import CV */}
      {onImport && (
        <div
          {...getRootProps()}
          className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-brand-500 bg-brand-50'
              : 'border-surface-200 hover:border-brand-400 hover:bg-surface-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-surface-100 flex items-center justify-center">
              <Upload className="h-6 w-6 text-surface-400" />
            </div>
            <div>
              <p className="font-medium text-surface-700 text-sm">
                {isDragActive ? 'Déposez votre CV ici' : 'Importez un CV existant (PDF)'}
              </p>
              <p className="text-xs text-surface-400 mt-1">
                L'IA extraira automatiquement vos informations
              </p>
            </div>
            <span className="btn-secondary text-xs py-1.5 px-3">
              <FileText className="h-3.5 w-3.5" /> Parcourir
            </span>
          </div>
        </div>
      )}

      {/* Photo */}
      <div>
        <label className="label">Photo (optionnel)</label>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-surface-100 flex items-center justify-center border-2 border-dashed border-surface-200 overflow-hidden">
            {value.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <Upload className="h-6 w-6 text-surface-300" />
            )}
          </div>
          <div>
            <input
              type="url"
              className="input text-sm"
              placeholder="URL de votre photo"
              value={value.photo ?? ''}
              onChange={e => patch('photo', e.target.value)}
            />
            <p className="text-xs text-surface-400 mt-1">Recommandé : photo professionnelle</p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(f => (
          <div key={f.key} className={f.col === 2 ? 'md:col-span-2' : ''}>
            <label className="label">
              {f.label}
              {f.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
              type={f.type ?? 'text'}
              className="input"
              placeholder={f.placeholder}
              value={(value[f.key] as string) ?? ''}
              onChange={e => patch(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div>
        <label className="label">Résumé professionnel</label>
        <textarea
          className="input h-28 resize-none"
          placeholder="Bref résumé de votre profil et objectifs professionnels..."
          value={value.summary ?? ''}
          onChange={e => patch('summary', e.target.value)}
        />
        <p className="text-xs text-surface-400 mt-1">L'IA l'optimisera automatiquement. 2-4 phrases recommandées.</p>
      </div>
    </div>
  );
}
