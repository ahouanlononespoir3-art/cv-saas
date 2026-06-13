// src/app/dashboard/letters/[id]/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import LetterDetailClient from './LetterDetailClient';

interface PageProps { params: { id: string } }
export const dynamic = 'force-dynamic';

export default async function LetterDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const letter = await prisma.coverLetter.findUnique({ where: { id: params.id } });
  if (!letter || letter.userId !== session.user.id) notFound();

  return <LetterDetailClient letter={letter as any} />;
}
