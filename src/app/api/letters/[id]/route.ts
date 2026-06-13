// src/app/api/letters/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Context { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const letter = await prisma.coverLetter.findUnique({ where: { id: params.id } });
  if (!letter || letter.userId !== session.user.id) {
    return NextResponse.json({ error: 'Lettre introuvable' }, { status: 404 });
  }

  const body    = await req.json();
  const updated = await prisma.coverLetter.update({
    where: { id: params.id },
    data: {
      ...(body.content       !== undefined && { content:       body.content }),
      ...(body.title         !== undefined && { title:         body.title }),
      ...(body.targetJob     !== undefined && { targetJob:     body.targetJob }),
      ...(body.targetCompany !== undefined && { targetCompany: body.targetCompany }),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_: NextRequest, { params }: Context) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const letter = await prisma.coverLetter.findUnique({ where: { id: params.id } });
  if (!letter || letter.userId !== session.user.id) {
    return NextResponse.json({ error: 'Lettre introuvable' }, { status: 404 });
  }

  await prisma.coverLetter.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
