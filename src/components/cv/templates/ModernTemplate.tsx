// src/components/cv/templates/ModernTemplate.tsx
import type { ResumeContent } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface Props { content: ResumeContent }

export default function ModernTemplate({ content }: Props) {
  const { personalInfo: p, education, experience, skills, languages, certifications } = content;

  return (
    <div className="flex h-full font-sans text-[11px] text-gray-800" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px' }}>
      {/* Left sidebar */}
      <div className="w-[240px] bg-slate-800 text-white flex-shrink-0 p-6 flex flex-col gap-6">
        {/* Photo */}
        {p.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt="" className="w-28 h-28 rounded-full object-cover border-4 border-white/20 mx-auto" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-slate-600 flex items-center justify-center mx-auto border-4 border-white/20">
            <span className="text-3xl text-white/60 font-bold">
              {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
            </span>
          </div>
        )}

        {/* Contact */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600 pb-1">Contact</h3>
          {p.email    && <div className="flex items-center gap-2 text-slate-300 text-[10px]"><Mail className="h-3 w-3 flex-shrink-0" /><span className="break-all">{p.email}</span></div>}
          {p.phone    && <div className="flex items-center gap-2 text-slate-300 text-[10px]"><Phone className="h-3 w-3 flex-shrink-0" /><span>{p.phone}</span></div>}
          {(p.city || p.country) && <div className="flex items-center gap-2 text-slate-300 text-[10px]"><MapPin className="h-3 w-3 flex-shrink-0" /><span>{[p.city, p.country].filter(Boolean).join(', ')}</span></div>}
          {p.linkedIn && <div className="flex items-center gap-2 text-slate-300 text-[10px]"><Linkedin className="h-3 w-3 flex-shrink-0" /><span className="break-all">{p.linkedIn}</span></div>}
          {p.website  && <div className="flex items-center gap-2 text-slate-300 text-[10px]"><Globe className="h-3 w-3 flex-shrink-0" /><span className="break-all">{p.website}</span></div>}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600 pb-1">Compétences</h3>
            {skills.map(s => (
              <div key={s.id}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-slate-200 text-[10px]">{s.name}</span>
                  <span className="text-slate-400 text-[9px]">{SKILL_LEVELS[s.level]}</span>
                </div>
                <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${{ BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 }[s.level] ?? 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600 pb-1">Langues</h3>
            {languages.map(l => (
              <div key={l.id} className="flex justify-between">
                <span className="text-slate-200 text-[10px]">{l.name}</span>
                <span className="text-slate-400 text-[9px]">{LANGUAGE_LEVELS[l.level]?.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600 pb-1">Certifications</h3>
            {certifications.map(c => (
              <div key={c.id}>
                <p className="text-slate-200 text-[10px] font-medium">{c.name}</p>
                <p className="text-slate-400 text-[9px]">{c.issuer} · {formatMonthYear(c.date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-7 flex flex-col gap-5">
        {/* Header */}
        <div className="border-b-2 border-indigo-600 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">{p.firstName} {p.lastName}</h1>
          {p.title && <p className="text-base text-indigo-600 font-semibold mt-0.5">{p.title}</p>}
          {p.summary && <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">{p.summary}</p>}
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-0.5 w-4 bg-indigo-600 block" />
              Expériences professionnelles
            </h2>
            <div className="space-y-4">
              {experience.map(e => (
                <div key={e.id} className="pl-4 border-l-2 border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 text-[11px]">{e.position}</p>
                      <p className="text-indigo-600 text-[10px] font-medium">{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 flex-shrink-0 ml-2">
                      {formatMonthYear(e.startDate)} – {e.current ? 'Présent' : (e.endDate ? formatMonthYear(e.endDate) : '')}
                    </span>
                  </div>
                  {e.description && <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">{e.description}</p>}
                  {(e.achievements ?? []).length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {(e.achievements ?? []).map((a, i) => (
                        <li key={i} className="text-[10px] text-gray-600 flex gap-1.5">
                          <span className="text-indigo-400 mt-0.5">▸</span>{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-0.5 w-4 bg-indigo-600 block" />
              Formation
            </h2>
            <div className="space-y-3">
              {education.map(ed => (
                <div key={ed.id} className="pl-4 border-l-2 border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 text-[11px]">{ed.degree} {ed.field ? `- ${ed.field}` : ''}</p>
                      <p className="text-indigo-600 text-[10px]">{ed.school}</p>
                      {ed.grade && <p className="text-[9px] text-gray-500">{ed.grade}</p>}
                    </div>
                    <span className="text-[9px] text-gray-500 flex-shrink-0 ml-2">
                      {formatMonthYear(ed.startDate)} – {ed.current ? 'Présent' : (ed.endDate ? formatMonthYear(ed.endDate) : '')}
                    </span>
                  </div>
                  {ed.description && <p className="text-[10px] text-gray-600 mt-1">{ed.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
