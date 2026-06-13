// src/app/api/ai/generate-letter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateCoverLetter } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const { targetJob, targetCompany, targetSector, tone, resumeId } = await req.json();

    if (!targetJob || !targetCompany) {
      return NextResponse.json({ error: 'Poste et entreprise requis' }, { status: 400 });
    }

    // Optionally fetch resume content for personalization
    let resumeContent = {};
    if (resumeId) {
      const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (resume && resume.userId === session.user.id) {
        resumeContent = resume.content as any;
      }
    }

    const content = await generateCoverLetter(
      resumeContent,
      targetJob,
      targetCompany,
      targetSector ?? '',
      tone ?? 'PROFESSIONAL',
    );

    return NextResponse.json({ success: true, data: { content } });
  } catch (error) {
    console.error('[AI_GENERATE_LETTER]', error);
    return NextResponse.json({ error: 'Erreur lors de la génération IA' }, { status: 500 });
  }
}
