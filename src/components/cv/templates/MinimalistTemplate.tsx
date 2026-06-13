// src/components/cv/templates/MinimalistTemplate.tsx
import type { ResumeContent } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';

interface Props { content: ResumeContent }

export default function MinimalistTemplate({ content }: Props) {
  const { personalInfo: p, education, experience, skills, languages, certifications } = content;

  return (
    <div className="p-12 bg-white text-[11px] text-gray-800" style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{p.firstName} <span className="font-semibold">{p.lastName}</span></h1>
        {p.title && <p className="text-sm text-gray-500 mt-1">{p.title}</p>}
        <div className="flex gap-4 mt-2 text-[10px] text-gray-400">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.city  && <span>{p.city}{p.country ? `, ${p.country}` : ''}</span>}
        </div>
      </div>

      {p.summary && <p className="text-[10px] text-gray-600 leading-relaxed mb-8 border-l-2 border-gray-200 pl-4">{p.summary}</p>}

      {experience.length > 0 && (
        <div className="mb-7">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">Expériences</h2>
          {experience.map(e => (
            <div key={e.id} className="mb-5 grid grid-cols-[120px_1fr] gap-4">
              <span className="text-[9px] text-gray-400 mt-0.5">
                {formatMonthYear(e.startDate)}<br/>{e.current ? 'Présent' : (e.endDate ? formatMonthYear(e.endDate) : '')}
              </span>
              <div>
                <p className="font-semibold text-[11px] text-gray-900">{e.position}</p>
                <p className="text-[10px] text-gray-500">{e.company}</p>
                {e.description && <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">{e.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-7">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">Formation</h2>
          {education.map(ed => (
            <div key={ed.id} className="mb-4 grid grid-cols-[120px_1fr] gap-4">
              <span className="text-[9px] text-gray-400 mt-0.5">{formatMonthYear(ed.startDate)}<br/>{ed.current ? 'Présent' : (ed.endDate ? formatMonthYear(ed.endDate) : '')}</span>
              <div>
                <p className="font-semibold text-[11px]">{ed.degree}{ed.field ? ` · ${ed.field}` : ''}</p>
                <p className="text-[10px] text-gray-500">{ed.school}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {skills.length > 0 && (
          <div>
            <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Compétences</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => <span key={s.id} className="border border-gray-200 rounded px-2 py-0.5 text-[9px] text-gray-600">{s.name}</span>)}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Langues</h2>
            {languages.map(l => <p key={l.id} className="text-[10px] text-gray-600 mb-0.5">{l.name} <span className="text-gray-400">— {LANGUAGE_LEVELS[l.level]?.split(' ')[0]}</span></p>)}
          </div>
        )}
      </div>
    </div>
  );
}
