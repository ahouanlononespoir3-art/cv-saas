// src/app/api/ai/generate-cv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { enhanceResume } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const { content, targetJob, targetCompany, targetSector, resumeId } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Contenu du CV manquant' }, { status: 400 });
    }

    const result = await enhanceResume(content, targetJob, targetCompany, targetSector);

    // If resumeId provided, update the DB record
    if (resumeId) {
      const existing = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (existing && existing.userId === session.user.id) {
        await prisma.resume.update({
          where: { id: resumeId },
          data: {
            content:    result.enhanced as any,
            aiEnhanced: true,
            atsScore:   result.atsScore,
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('[AI_GENERATE_CV]', error);
    return NextResponse.json({ error: 'Erreur lors de la génération IA' }, { status: 500 });
  }
}
