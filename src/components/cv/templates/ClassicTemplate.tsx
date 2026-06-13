// src/components/cv/templates/ClassicTemplate.tsx
import type { ResumeContent } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';

interface Props { content: ResumeContent }

export default function ClassicTemplate({ content }: Props) {
  const { personalInfo: p, education, experience, skills, languages, certifications } = content;

  return (
    <div className="p-10 font-serif text-gray-900 text-[11px]" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 pb-5 mb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase">{p.firstName} {p.lastName}</h1>
        {p.title && <p className="text-base text-gray-600 italic mt-1">{p.title}</p>}
        <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-600">
          {p.email && <span>{p.email}</span>}
          {p.phone && <><span>|</span><span>{p.phone}</span></>}
          {p.city && <><span>|</span><span>{p.city}{p.country ? `, ${p.country}` : ''}</span></>}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">Profil</h2>
          <p className="text-[10px] leading-relaxed text-gray-700">{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Expériences</h2>
          {experience.map(e => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <span className="font-bold text-[11px]">{e.position}</span>
                <span className="text-[10px] text-gray-500">{formatMonthYear(e.startDate)} – {e.current ? 'Présent' : (e.endDate ? formatMonthYear(e.endDate) : '')}</span>
              </div>
              <p className="text-[10px] italic text-gray-600">{e.company}{e.location ? `, ${e.location}` : ''}</p>
              {e.description && <p className="text-[10px] text-gray-700 mt-1 leading-relaxed">{e.description}</p>}
              {(e.achievements ?? []).map((a, i) => (
                <p key={i} className="text-[10px] text-gray-700 ml-3 mt-0.5">• {a}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Formation</h2>
          {education.map(ed => (
            <div key={ed.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold text-[11px]">{ed.degree}{ed.field ? ` - ${ed.field}` : ''}</span>
                <span className="text-[10px] text-gray-500">{formatMonthYear(ed.startDate)} – {ed.current ? 'Présent' : (ed.endDate ? formatMonthYear(ed.endDate) : '')}</span>
              </div>
              <p className="text-[10px] italic text-gray-600">{ed.school}{ed.grade ? ` · ${ed.grade}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-2 gap-6">
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">Compétences</h2>
            {skills.map(s => (
              <p key={s.id} className="text-[10px] mb-0.5">• {s.name} <span className="text-gray-500">({SKILL_LEVELS[s.level]})</span></p>
            ))}
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">Langues</h2>
            {languages.map(l => (
              <p key={l.id} className="text-[10px] mb-0.5">• {l.name} — {LANGUAGE_LEVELS[l.level]?.split(' ')[0]}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
