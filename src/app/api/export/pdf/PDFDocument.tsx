// src/app/api/export/pdf/PDFDocument.tsx
import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer';
import type { ResumeContent, TemplateStyle } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';

interface Props {
  content:  ResumeContent;
  template: TemplateStyle;
}

const styles = StyleSheet.create({
  page: {
    fontFamily:  'Helvetica',
    fontSize:    10,
    color:       '#1e293b',
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#1e293b',
    padding: '28 20',
    color: '#fff',
  },
  main: {
    flex: 1,
    padding: '28 28 28 24',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  jobTitle: {
    fontSize: 12,
    color: '#6366f1',
    marginTop: 2,
    fontFamily: 'Helvetica-Oblique',
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 14,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    color: '#374151',
  },
  sidebarSectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 5,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
    color: '#94a3b8',
  },
  experienceItem: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  expTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  expCompany: {
    fontSize: 9,
    color: '#6366f1',
    marginTop: 1,
  },
  expDate: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 1,
  },
  expDesc: {
    fontSize: 9,
    color: '#4b5563',
    marginTop: 3,
    lineHeight: 1.5,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillName: {
    fontSize: 9,
    color: '#e2e8f0',
  },
  skillBar: {
    height: 3,
    backgroundColor: '#475569',
    borderRadius: 2,
    marginTop: 2,
  },
  skillFill: {
    height: 3,
    backgroundColor: '#818cf8',
    borderRadius: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 3,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  summary: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.6,
    marginTop: 4,
    marginBottom: 4,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#6366f1',
  },
});

export function PDFDocument({ content, template }: Props) {
  const { personalInfo: p, education, experience, skills, languages, certifications } = content;

  const LEVEL_WIDTHS: Record<string, string> = {
    BEGINNER: '25%', INTERMEDIATE: '50%', ADVANCED: '75%', EXPERT: '100%',
  };

  return (
    <Document
      title={`${p.firstName} ${p.lastName} — CV`}
      author={`${p.firstName} ${p.lastName}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Name block */}
          <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#fff' }}>
            {p.firstName}
          </Text>
          <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#fff' }}>
            {p.lastName}
          </Text>
          {p.title && (
            <Text style={{ fontSize: 9, color: '#818cf8', marginTop: 3, fontFamily: 'Helvetica-Oblique' }}>
              {p.title}
            </Text>
          )}

          {/* Contact */}
          <Text style={styles.sidebarSectionTitle}>Contact</Text>
          {p.email    && <View style={styles.contactRow}><Text style={styles.contactText}>{p.email}</Text></View>}
          {p.phone    && <View style={styles.contactRow}><Text style={styles.contactText}>{p.phone}</Text></View>}
          {(p.city || p.country) && <View style={styles.contactRow}><Text style={styles.contactText}>{[p.city, p.country].filter(Boolean).join(', ')}</Text></View>}
          {p.linkedIn && <View style={styles.contactRow}><Text style={styles.contactText}>{p.linkedIn}</Text></View>}

          {/* Skills */}
          {skills.length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Compétences</Text>
              {skills.map(s => (
                <View key={s.id} style={{ marginBottom: 5 }}>
                  <View style={styles.skillRow}>
                    <Text style={styles.skillName}>{s.name}</Text>
                  </View>
                  <View style={styles.skillBar}>
                    <View style={{ ...styles.skillFill, width: LEVEL_WIDTHS[s.level] ?? '50%' }} />
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Langues</Text>
              {languages.map(l => (
                <View key={l.id} style={{ marginBottom: 4 }}>
                  <Text style={{ fontSize: 9, color: '#e2e8f0' }}>{l.name}</Text>
                  <Text style={{ fontSize: 8, color: '#94a3b8' }}>{LANGUAGE_LEVELS[l.level]?.split(' ')[0]}</Text>
                </View>
              ))}
            </>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Certifications</Text>
              {certifications.map(c => (
                <View key={c.id} style={{ marginBottom: 4 }}>
                  <Text style={{ fontSize: 9, color: '#e2e8f0', fontFamily: 'Helvetica-Bold' }}>{c.name}</Text>
                  <Text style={{ fontSize: 8, color: '#94a3b8' }}>{c.issuer}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Main */}
        <View style={styles.main}>
          {/* Header */}
          <View style={{ borderBottomWidth: 2, borderBottomColor: '#6366f1', paddingBottom: 8, marginBottom: 4 }}>
            <Text style={styles.name}>{p.firstName} {p.lastName}</Text>
            {p.title && <Text style={styles.jobTitle}>{p.title}</Text>}
          </View>

          {p.summary && <Text style={styles.summary}>{p.summary}</Text>}

          {/* Experience */}
          {experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Expériences professionnelles</Text>
              {experience.map(e => (
                <View key={e.id} style={styles.experienceItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.expTitle}>{e.position}</Text>
                    <Text style={styles.expDate}>
                      {formatMonthYear(e.startDate)} – {e.current ? 'Présent' : (e.endDate ? formatMonthYear(e.endDate) : '')}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>{e.company}{e.location ? ` · ${e.location}` : ''}</Text>
                  {e.description && <Text style={styles.expDesc}>{e.description}</Text>}
                  {(e.achievements ?? []).map((a, i) => (
                    <Text key={i} style={{ ...styles.expDesc, marginLeft: 8 }}>▸ {a}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Formation</Text>
              {education.map(ed => (
                <View key={ed.id} style={{ ...styles.experienceItem, marginBottom: 7 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.expTitle}>{ed.degree}{ed.field ? ` - ${ed.field}` : ''}</Text>
                    <Text style={styles.expDate}>
                      {formatMonthYear(ed.startDate)} – {ed.current ? 'Présent' : (ed.endDate ? formatMonthYear(ed.endDate) : '')}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>{ed.school}</Text>
                  {ed.grade && <Text style={{ fontSize: 8, color: '#9ca3af' }}>{ed.grade}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
