// src/app/api/export/pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { PDFDocument } from './PDFDocument';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const { resumeId } = await req.json();

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.userId !== session.user.id) {
      return NextResponse.json({ error: 'CV introuvable' }, { status: 404 });
    }

    // Log export
    await prisma.export.create({
      data: { userId: session.user.id, resumeId, format: 'PDF' },
    });

   const buffer = await renderToBuffer(
  React.createElement(PDFDocument, {
    content:  resume.content as any,
    template: resume.template,
  } as any),
);

    return new NextResponse(buffer, {
      status:  200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(resume.title)}.pdf"`,
        'Content-Length':      buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[EXPORT_PDF]', error);
    return NextResponse.json({ error: 'Erreur export PDF' }, { status: 500 });
  }
}
