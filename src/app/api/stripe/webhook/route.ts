// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    console.error('[WEBHOOK] No userId in subscription metadata');
    return;
  }

  const isActive = ['active', 'trialing'].includes(subscription.status);
  const plan     = isActive ? 'PREMIUM' : 'FREE';

  await prisma.$transaction([
    prisma.subscription.upsert({
      where:  { userId },
      create: {
        userId,
        stripeSubscriptionId:  subscription.id,
        stripePriceId:         subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status:                subscription.status.toUpperCase() as any,
        plan,
        cancelAtPeriodEnd:     subscription.cancel_at_period_end,
      },
      update: {
        stripeSubscriptionId:  subscription.id,
        stripePriceId:         subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status:                subscription.status.toUpperCase() as any,
        plan,
        cancelAtPeriodEnd:     subscription.cancel_at_period_end,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data:  { plan },
    }),
  ]);

  console.log(`[WEBHOOK] Updated plan to ${plan} for user ${userId}`);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  // Update stripeCustomerId if needed
  if (session.customer) {
    await prisma.subscription.upsert({
      where:  { userId },
      create: { userId, stripeCustomerId: session.customer as string },
      update: { stripeCustomerId: session.customer as string },
    });
  }
}

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('[WEBHOOK] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata.userId;
        if (uid) {
          await prisma.$transaction([
            prisma.subscription.update({
              where: { userId: uid },
              data:  { status: 'CANCELED', plan: 'FREE', cancelAtPeriodEnd: false },
            }),
            prisma.user.update({
              where: { id: uid },
              data:  { plan: 'FREE' },
            }),
          ]);
        }
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const failedSub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const failedUid = failedSub.metadata.userId;
          if (failedUid) {
            await prisma.subscription.updateMany({
              where: { userId: failedUid },
              data:  { status: 'PAST_DUE' },
            });
          }
        }
        break;

      default:
        console.log(`[WEBHOOK] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WEBHOOK] Handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
