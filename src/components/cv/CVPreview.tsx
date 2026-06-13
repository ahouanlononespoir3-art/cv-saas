// src/components/cv/CVPreview.tsx
'use client';

import type { ResumeContent, TemplateStyle } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';
import ModernTemplate    from './templates/ModernTemplate';
import ClassicTemplate   from './templates/ClassicTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import PremiumTemplate   from './templates/PremiumTemplate';
import CorporateTemplate from './templates/CorporateTemplate';

interface Props {
  content:  ResumeContent;
  template: TemplateStyle;
  scale?:   number;
}

export default function CVPreview({ content, template, scale = 1 }: Props) {
  const TEMPLATES = {
    MODERN:     ModernTemplate,
    CLASSIC:    ClassicTemplate,
    MINIMALIST: MinimalistTemplate,
    PREMIUM:    PremiumTemplate,
    CORPORATE:  CorporateTemplate,
  };
  const Template = TEMPLATES[template] ?? ModernTemplate;

  return (
    <div
      style={{
        transform:     `scale(${scale})`,
        transformOrigin: 'top left',
        width:         scale !== 1 ? `${100 / scale}%` : '100%',
        height:        scale !== 1 ? `${100 / scale}%` : undefined,
      }}
    >
      <div id="cv-to-export" className="bg-white" style={{ width: '794px', minHeight: '1123px' }}>
        <Template content={content} />
      </div>
    </div>
  );
}
