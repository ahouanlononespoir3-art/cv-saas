// src/app/dashboard/settings/page.tsx
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SettingsClient from './SettingsClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const [user, subscription] = await Promise.all([
    prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, plan: true, cvCount: true, letterCount: true, createdAt: true },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  return <SettingsClient user={user as any} subscription={subscription as any} />;
}
