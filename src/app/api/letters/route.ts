// src/app/api/letters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LIMITS } from '@/types';
import { z } from 'zod';

const createSchema = z.object({
  title:         z.string().min(1),
  targetJob:     z.string().min(1),
  targetCompany: z.string().min(1),
  targetSector:  z.string().default(''),
  content:       z.string().min(10),
  resumeId:      z.string().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const letters = await prisma.coverLetter.findMany({
    where:   { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: letters });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const user = await prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { plan: true, letterCount: true },
    });
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    const limit = LIMITS[user.plan as 'FREE' | 'PREMIUM'].letter;
    if (user.letterCount >= limit) {
      return NextResponse.json(
        { error: `Limite atteinte (${limit} lettres/mois). Passez au Premium.` },
        { status: 403 },
      );
    }

    const [letter] = await prisma.$transaction([
      prisma.coverLetter.create({
        data: {
          userId:        session.user.id,
          title:         data.title,
          targetJob:     data.targetJob,
          targetCompany: data.targetCompany,
          targetSector:  data.targetSector,
          content:       data.content,
          resumeId:      data.resumeId ?? null,
          aiGenerated:   true,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data:  { letterCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true, data: letter }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    console.error('[LETTERS_CREATE]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
