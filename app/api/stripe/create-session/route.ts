// app/api/stripe/create-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items, customerEmail } = await req.json();

    const line_items = (items || []).map((it: any) => ({
      price_data: {
        currency: it.currency || 'inr',
        product_data: {
          name: it.name,
          description: it.description || undefined,
        },
        unit_amount: Math.round((it.price || 0) * 100), // rupees -> paise
      },
      quantity: it.quantity || 1,
    }));

    if (line_items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: customerEmail || undefined,
      metadata: { integration: 'college-project' }, // optional
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('create-session error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
