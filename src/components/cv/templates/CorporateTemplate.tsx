// src/components/cv/templates/CorporateTemplate.tsx
import type { ResumeContent } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';

interface Props { content: ResumeContent }

export default function CorporateTemplate({ content }: Props) {
  const { personalInfo: p, education, experience, skills, languages, certifications } = content;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#1e293b' }}>
      {/* Blue corporate header */}
      <div style={{ background: '#1e40af', color: 'white', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{p.firstName} {p.lastName}</h1>
          {p.title && <p style={{ fontSize: '12px', color: '#93c5fd', marginTop: '4px' }}>{p.title}</p>}
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#bfdbfe' }}>
          {p.email && <p>{p.email}</p>}
          {p.phone && <p style={{ marginTop: '2px' }}>{p.phone}</p>}
          {p.city  && <p style={{ marginTop: '2px' }}>{p.city}{p.country ? `, ${p.country}` : ''}</p>}
        </div>
      </div>

      {/* Colored strip */}
      <div style={{ background: '#3b82f6', height: '4px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0' }}>
        {/* Left main */}
        <div style={{ padding: '28px 32px 28px 40px', borderRight: '1px solid #e2e8f0' }}>
          {p.summary && (
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '8px' }}>Synthèse</h2>
              <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '10px' }}>{p.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '12px' }}>Expériences</h2>
              {experience.map(e => (
                <div key={e.id} style={{ marginBottom: '14px', paddingLeft: '10px', borderLeft: '2px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '11px' }}>{e.position}</p>
                      <p style={{ color: '#1e40af', fontSize: '10px', fontWeight: '600' }}>{e.company}</p>
                    </div>
                    <span style={{ fontSize: '9px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>
                      {formatMonthYear(e.startDate)} – {e.current ? 'Présent' : (e.endDate ? formatMonthYear(e.endDate) : '')}
                    </span>
                  </div>
                  {e.description && <p style={{ color: '#374151', fontSize: '10px', marginTop: '4px', lineHeight: '1.5' }}>{e.description}</p>}
                  {(e.achievements ?? []).map((a, i) => (
                    <p key={i} style={{ fontSize: '10px', color: '#374151', marginLeft: '10px', marginTop: '2px' }}>→ {a}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '12px' }}>Formation</h2>
              {education.map(ed => (
                <div key={ed.id} style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: '2px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '11px' }}>{ed.degree}{ed.field ? ` · ${ed.field}` : ''}</p>
                      <p style={{ color: '#1e40af', fontSize: '10px' }}>{ed.school}</p>
                    </div>
                    <span style={{ fontSize: '9px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>
                      {formatMonthYear(ed.startDate)} – {ed.current ? 'Présent' : (ed.endDate ? formatMonthYear(ed.endDate) : '')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ padding: '28px 24px 28px 24px', background: '#f8fafc' }}>
          {skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '10px' }}>Compétences</h2>
              {skills.map(s => (
                <div key={s.id} style={{ marginBottom: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '10px' }}>{s.name}</span>
                  </div>
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#1e40af', width: `${{ BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 }[s.level] ?? 50}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '10px' }}>Langues</h2>
              {languages.map(l => (
                <div key={l.id} style={{ marginBottom: '4px' }}>
                  <p style={{ fontSize: '10px' }}>{l.name}</p>
                  <p style={{ fontSize: '9px', color: '#6b7280' }}>{LANGUAGE_LEVELS[l.level]?.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '10px' }}>Certifications</h2>
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '6px' }}>
                  <p style={{ fontSize: '10px', fontWeight: '600' }}>{c.name}</p>
                  <p style={{ fontSize: '9px', color: '#6b7280' }}>{c.issuer} · {formatMonthYear(c.date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
