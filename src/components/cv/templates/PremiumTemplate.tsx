// src/components/cv/templates/PremiumTemplate.tsx
import type { ResumeContent } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';

interface Props { content: ResumeContent }

export default function PremiumTemplate({ content }: Props) {
  const { personalInfo: p, education, experience, skills, languages, certifications } = content;

  return (
    <div className="font-sans text-[11px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Gold header */}
      <div className="bg-gradient-to-r" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '32px 40px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.05em' }}>{p.firstName} {p.lastName}</h1>
            {p.title && <p style={{ color: '#e5c46a', fontSize: '13px', marginTop: '4px', fontStyle: 'italic' }}>{p.title}</p>}
          </div>
          {p.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #e5c46a', objectFit: 'cover' }} />
          )}
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', color: '#adb5bd', fontSize: '10px' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.city  && <span>{p.city}</span>}
          {p.linkedIn && <span>{p.linkedIn}</span>}
        </div>
      </div>

      <div className="p-10">
        {p.summary && (
          <div style={{ borderLeft: '3px solid #e5c46a', paddingLeft: '12px', marginBottom: '24px' }}>
            <p style={{ color: '#374151', lineHeight: '1.6', fontSize: '10px' }}>{p.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', borderBottom: '2px solid #e5c46a', paddingBottom: '6px', marginBottom: '16px', color: '#1a1a2e' }}>Parcours professionnel</h2>
            {experience.map(e => (
              <div key={e.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '11px' }}>{e.position}</span>
                  <span style={{ color: '#6b7280', fontSize: '9px' }}>{formatMonthYear(e.startDate)} – {e.current ? 'Présent' : (e.endDate ? formatMonthYear(e.endDate) : '')}</span>
                </div>
                <p style={{ color: '#0f3460', fontSize: '10px', fontWeight: '600', marginTop: '2px' }}>{e.company}</p>
                {e.description && <p style={{ color: '#4b5563', fontSize: '10px', marginTop: '4px', lineHeight: '1.6' }}>{e.description}</p>}
                {(e.achievements ?? []).map((a, i) => (
                  <p key={i} style={{ fontSize: '10px', color: '#4b5563', marginLeft: '12px', marginTop: '2px' }}>◆ {a}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {education.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', borderBottom: '2px solid #e5c46a', paddingBottom: '6px', marginBottom: '12px', color: '#1a1a2e' }}>Formation</h2>
              {education.map(ed => (
                <div key={ed.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '10px' }}>{ed.degree}{ed.field ? ` · ${ed.field}` : ''}</p>
                  <p style={{ color: '#0f3460', fontSize: '9px' }}>{ed.school}</p>
                  <p style={{ color: '#9ca3af', fontSize: '9px' }}>{formatMonthYear(ed.startDate)} – {ed.current ? 'Présent' : (ed.endDate ? formatMonthYear(ed.endDate) : '')}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            {skills.length > 0 && (
              <>
                <h2 style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', borderBottom: '2px solid #e5c46a', paddingBottom: '6px', marginBottom: '10px', color: '#1a1a2e' }}>Compétences</h2>
                {skills.map(s => <p key={s.id} style={{ fontSize: '10px', marginBottom: '3px' }}>◆ {s.name}</p>)}
              </>
            )}
            {languages.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h2 style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', borderBottom: '2px solid #e5c46a', paddingBottom: '6px', marginBottom: '10px', color: '#1a1a2e' }}>Langues</h2>
                {languages.map(l => <p key={l.id} style={{ fontSize: '10px', marginBottom: '3px' }}>{l.name} — {LANGUAGE_LEVELS[l.level]?.split(' ')[0]}</p>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
