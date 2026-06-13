// src/app/api/cv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LIMITS } from '@/types';
import { z } from 'zod';

const createSchema = z.object({
  title:         z.string().min(1),
  template:      z.enum(['MODERN', 'CLASSIC', 'PREMIUM', 'MINIMALIST', 'CORPORATE']).default('MODERN'),
  content:       z.any(),
  targetJob:     z.string().optional(),
  targetCompany: z.string().optional(),
  targetSector:  z.string().optional(),
});

// GET /api/cv — list user CVs
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const resumes = await prisma.resume.findMany({
    where:   { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: resumes });
}

// POST /api/cv — create new CV
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const user = await prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { plan: true, cvCount: true },
    });
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    // Check plan limits
    const limit = LIMITS[user.plan as 'FREE' | 'PREMIUM'].cv;
    if (user.cvCount >= limit) {
      return NextResponse.json(
        { error: `Limite atteinte (${limit} CV/mois). Passez au plan Premium.` },
        { status: 403 },
      );
    }

    const [resume] = await prisma.$transaction([
      prisma.resume.create({
        data: {
          userId:        session.user.id,
          title:         data.title,
          template:      data.template,
          content:       data.content,
          targetJob:     data.targetJob,
          targetCompany: data.targetCompany,
          targetSector:  data.targetSector,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data:  { cvCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true, data: resume }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
    }
    console.error('[CV_CREATE]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
