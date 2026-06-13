// src/app/dashboard/cv/[id]/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import CVDetailClient from './CVDetailClient';

interface PageProps { params: { id: string } }

export const dynamic = 'force-dynamic';

export default async function CVDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const resume = await prisma.resume.findUnique({
    where: { id: params.id },
  });

  if (!resume || resume.userId !== session.user.id) notFound();

  return (
    <CVDetailClient
      resume={resume as any}
      plan={session.user.plan}
    />
  );
}
