// src/app/api/export/docx/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType,
} from 'docx';
import type { ResumeContent } from '@/types';
import { SKILL_LEVELS, LANGUAGE_LEVELS, formatMonthYear } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  // Premium only
  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { plan: true },
  });
  if (user?.plan !== 'PREMIUM') {
    return NextResponse.json({ error: 'Export DOCX disponible uniquement en Premium' }, { status: 403 });
  }

  try {
    const { resumeId } = await req.json();
    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.userId !== session.user.id) {
      return NextResponse.json({ error: 'CV introuvable' }, { status: 404 });
    }

    const content = resume.content as unknown as ResumeContent;
    const { personalInfo: p, experience, education, skills, languages, certifications } = content;

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: 'Calibri', size: 22 },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 720, bottom: 720, left: 900, right: 900 },
            },
          },
          children: [
            // ── Header ────────────────────────────────────────────────
            new Paragraph({
              children: [
                new TextRun({ text: `${p.firstName} ${p.lastName}`, bold: true, size: 44, color: '1e293b' }),
              ],
            }),
            p.title ? new Paragraph({
              children: [new TextRun({ text: p.title, size: 26, color: '6366f1', italics: true })],
              spacing: { after: 80 },
            }) : new Paragraph({ text: '' }),

            // Contact
            new Paragraph({
              children: [
                p.email    && new TextRun({ text: p.email,   size: 20, color: '64748b' }),
                p.phone    && new TextRun({ text: `  |  ${p.phone}`, size: 20, color: '64748b' }),
                p.city     && new TextRun({ text: `  |  ${p.city}`, size: 20, color: '64748b' }),
                p.linkedIn && new TextRun({ text: `  |  ${p.linkedIn}`, size: 20, color: '64748b' }),
              ].filter(Boolean) as TextRun[],
              border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '6366f1' } },
              spacing: { after: 200 },
            }),

            // Summary
            ...(p.summary ? [
              sectionTitle('PROFIL'),
              new Paragraph({
                children: [new TextRun({ text: p.summary, size: 20, color: '374151' })],
                spacing: { after: 180 },
              }),
            ] : []),

            // Experience
            ...(experience.length > 0 ? [
              sectionTitle('EXPÉRIENCES PROFESSIONNELLES'),
              ...experience.flatMap(e => [
                new Paragraph({
                  children: [
                    new TextRun({ text: e.position, bold: true, size: 22 }),
                    new TextRun({ text: `  ·  ${formatMonthYear(e.startDate)} – ${e.current ? 'Présent' : (e.endDate ? formatMonthYear(e.endDate) : '')}`, size: 18, color: '9ca3af' }),
                  ],
                }),
                new Paragraph({
                  children: [new TextRun({ text: `${e.company}${e.location ? ` · ${e.location}` : ''}`, size: 20, color: '6366f1' })],
                }),
                ...(e.description ? [new Paragraph({
                  children: [new TextRun({ text: e.description, size: 20, color: '4b5563' })],
                  spacing: { before: 80 },
                })] : []),
                ...(e.achievements ?? []).map(a => new Paragraph({
                  bullet: { level: 0 },
                  children: [new TextRun({ text: a, size: 20, color: '374151' })],
                })),
                new Paragraph({ text: '', spacing: { after: 120 } }),
              ]),
            ] : []),

            // Education
            ...(education.length > 0 ? [
              sectionTitle('FORMATION'),
              ...education.flatMap(ed => [
                new Paragraph({
                  children: [
                    new TextRun({ text: `${ed.degree}${ed.field ? ` — ${ed.field}` : ''}`, bold: true, size: 22 }),
                    new TextRun({ text: `  ·  ${formatMonthYear(ed.startDate)} – ${ed.current ? 'Présent' : (ed.endDate ? formatMonthYear(ed.endDate) : '')}`, size: 18, color: '9ca3af' }),
                  ],
                }),
                new Paragraph({
                  children: [new TextRun({ text: ed.school, size: 20, color: '6366f1' })],
                  spacing: { after: 120 },
                }),
              ]),
            ] : []),

            // Skills
            ...(skills.length > 0 ? [
              sectionTitle('COMPÉTENCES'),
              new Paragraph({
                children: skills.map((s, i) => new TextRun({
                  text: `${s.name} (${SKILL_LEVELS[s.level]})${i < skills.length - 1 ? '  ·  ' : ''}`,
                  size: 20, color: '374151',
                })),
                spacing: { after: 180 },
              }),
            ] : []),

            // Languages
            ...(languages.length > 0 ? [
              sectionTitle('LANGUES'),
              new Paragraph({
                children: languages.map((l, i) => new TextRun({
                  text: `${l.name} (${LANGUAGE_LEVELS[l.level]?.split(' ')[0]})${i < languages.length - 1 ? '  ·  ' : ''}`,
                  size: 20, color: '374151',
                })),
                spacing: { after: 180 },
              }),
            ] : []),

            // Certifications
            ...(certifications.length > 0 ? [
              sectionTitle('CERTIFICATIONS'),
              ...certifications.map(c => new Paragraph({
                children: [
                  new TextRun({ text: c.name, bold: true, size: 20 }),
                  new TextRun({ text: ` — ${c.issuer}, ${formatMonthYear(c.date)}`, size: 20, color: '64748b' }),
                ],
              })),
            ] : []),
          ],
        },
      ],
    });

    await prisma.export.create({
      data: { userId: session.user.id, resumeId, format: 'DOCX' },
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(Buffer.from(buffer), {
      status:  200,
      headers: {
        'Content-Type':        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(resume.title)}.docx"`,
      },
    });
  } catch (error) {
    console.error('[EXPORT_DOCX]', error);
    return NextResponse.json({ error: 'Erreur export DOCX' }, { status: 500 });
  }
}

function sectionTitle(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 20, color: '374151', allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'e2e8f0' } },
    spacing: { before: 280, after: 140 },
  });
}
