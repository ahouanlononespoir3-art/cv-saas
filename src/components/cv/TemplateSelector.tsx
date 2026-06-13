// src/components/cv/TemplateSelector.tsx
'use client';

import { Crown, CheckCircle2 } from 'lucide-react';
import type { TemplateStyle } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  selected: TemplateStyle;
  onSelect: (t: TemplateStyle) => void;
  plan:     string;
}

const TEMPLATES: Array<{
  id:       TemplateStyle;
  name:     string;
  desc:     string;
  color:    string;
  premium?: boolean;
  preview:  string; // gradient
}> = [
  {
    id: 'MODERN', name: 'Moderne', desc: 'Design contemporain avec accents colorés',
    color: 'from-brand-500 to-purple-600', preview: 'bg-gradient-to-br from-brand-500 to-purple-600',
  },
  {
    id: 'CLASSIC', name: 'Classique', desc: 'Format traditionnel et sobre',
    color: 'from-surface-700 to-surface-900', preview: 'bg-gradient-to-br from-surface-700 to-surface-900',
  },
  {
    id: 'MINIMALIST', name: 'Minimaliste', desc: 'Épuré, blanc et typographie pure',
    color: 'from-surface-200 to-surface-400', preview: 'bg-gradient-to-br from-surface-200 to-surface-400',
  },
  {
    id: 'PREMIUM', name: 'Premium', desc: 'Design luxueux, idéal cadres',
    color: 'from-amber-500 to-orange-600', preview: 'bg-gradient-to-br from-amber-500 to-orange-600',
    premium: true,
  },
  {
    id: 'CORPORATE', name: 'Corporate', desc: 'Professionnel pour grandes entreprises',
    color: 'from-blue-600 to-cyan-600', preview: 'bg-gradient-to-br from-blue-600 to-cyan-600',
    premium: true,
  },
];

export default function TemplateSelector({ selected, onSelect, plan }: Props) {
  const isPremium = plan === 'PREMIUM';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {TEMPLATES.map(t => {
        const locked = t.premium && !isPremium;
        const active = selected === t.id;

        return (
          <button
            key={t.id}
            type="button"
            disabled={locked}
            onClick={() => !locked && onSelect(t.id)}
            className={cn(
              'relative rounded-2xl border-2 p-1 transition-all group',
              active   ? 'border-brand-500 shadow-glow'       : 'border-surface-200 hover:border-brand-300',
              locked   ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {/* Preview thumbnail */}
            <div className={cn('h-28 rounded-xl overflow-hidden relative', t.preview)}>
              {/* Mock CV lines */}
              <div className="absolute inset-0 p-3 flex flex-col gap-1.5">
                <div className="h-2.5 w-16 bg-white/50 rounded-full" />
                <div className="h-1.5 w-10 bg-white/30 rounded-full" />
                <div className="mt-2 space-y-1">
                  <div className="h-1 bg-white/20 rounded-full" />
                  <div className="h-1 w-3/4 bg-white/20 rounded-full" />
                  <div className="h-1 w-1/2 bg-white/20 rounded-full" />
                </div>
                <div className="mt-1 space-y-1">
                  <div className="h-1 bg-white/20 rounded-full" />
                  <div className="h-1 w-2/3 bg-white/20 rounded-full" />
                </div>
              </div>

              {/* Active check */}
              {active && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="h-5 w-5 text-white drop-shadow" />
                </div>
              )}

              {/* Premium badge */}
              {t.premium && (
                <div className="absolute bottom-2 right-2">
                  <span className="flex items-center gap-0.5 bg-black/50 text-white text-xs rounded-full px-1.5 py-0.5">
                    <Crown className="h-2.5 w-2.5" /> Pro
                  </span>
                </div>
              )}

              {/* Locked overlay */}
              {locked && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                  <Crown className="h-6 w-6 text-amber-300" />
                </div>
              )}
            </div>

            <div className="mt-2 px-1 pb-1 text-left">
              <p className={cn('text-xs font-semibold', active ? 'text-brand-700' : 'text-surface-800')}>{t.name}</p>
              <p className="text-xs text-surface-400 mt-0.5 leading-tight">{t.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
