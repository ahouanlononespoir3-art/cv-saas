// src/app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const { returnUrl } = await req.json().catch(() => ({}));

    const url = await createCheckoutSession(
      session.user.id,
      session.user.email,
      session.user.name ?? undefined,
      returnUrl,
    );

    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    console.error('[STRIPE_CHECKOUT]', error);
    return NextResponse.json({ error: 'Erreur Stripe' }, { status: 500 });
  }
}
