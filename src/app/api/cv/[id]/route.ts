// src/app/api/cv/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Context { params: { id: string } }

// GET single resume
export async function GET(_: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const resume = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!resume || resume.userId !== session.user.id) {
    return NextResponse.json({ error: 'CV introuvable' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: resume });
}

// PATCH — update resume
export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const existing = await prisma.resume.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'CV introuvable' }, { status: 404 });
    }

    const body    = await req.json();
    const updated = await prisma.resume.update({
      where: { id: params.id },
      data: {
        ...(body.title         !== undefined && { title:         body.title }),
        ...(body.template      !== undefined && { template:      body.template }),
        ...(body.content       !== undefined && { content:       body.content }),
        ...(body.targetJob     !== undefined && { targetJob:     body.targetJob }),
        ...(body.targetCompany !== undefined && { targetCompany: body.targetCompany }),
        ...(body.targetSector  !== undefined && { targetSector:  body.targetSector }),
        ...(body.aiEnhanced    !== undefined && { aiEnhanced:    body.aiEnhanced }),
        ...(body.atsScore      !== undefined && { atsScore:      body.atsScore }),
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[CV_PATCH]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const existing = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'CV introuvable' }, { status: 404 });
  }

  await prisma.resume.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
