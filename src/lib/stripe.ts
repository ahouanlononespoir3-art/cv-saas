// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string,
): Promise<string> {
  const { prisma } = await import('./prisma');

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    name:     name ?? undefined,
    metadata: { userId },
  });

  await prisma.subscription.upsert({
    where:  { userId },
    create: { userId, stripeCustomerId: customer.id },
    update: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(
  userId:     string,
  email:      string,
  name?:      string,
  returnUrl?: string,
): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(userId, email, name);
  const base = process.env.NEXT_PUBLIC_APP_URL!;

  const session = await stripe.checkout.sessions.create({
    customer:             customerId,
    mode:                 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price:    process.env.STRIPE_PREMIUM_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${base}/dashboard?upgrade=success`,
    cancel_url:  returnUrl ?? `${base}/pricing`,
    metadata:    { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  return session.url!;
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl:  string,
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer:   customerId,
    return_url: returnUrl,
  });
  return session.url;
}
