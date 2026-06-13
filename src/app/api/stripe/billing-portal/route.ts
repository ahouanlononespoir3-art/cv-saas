// src/app/api/stripe/billing-portal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBillingPortalSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: 'Aucun abonnement actif' }, { status: 404 });
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`;
    const url = await createBillingPortalSession(subscription.stripeCustomerId, returnUrl);

    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    console.error('[BILLING_PORTAL]', error);
    return NextResponse.json({ error: 'Erreur Stripe' }, { status: 500 });
  }
}
