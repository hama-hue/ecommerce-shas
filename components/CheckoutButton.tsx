'use client';

import { useState } from 'react';

type CartItem = {
  name: string;
  price: number; // in rupees
  quantity?: number;
  currency?: string;
  description?: string;
};

/**
 * CheckoutButton Component
 * - Accepts cart items
 * - Calls your backend API to create a Stripe checkout session
 * - Redirects to the Stripe-hosted Checkout Page
 */
export default function CheckoutButton({
  items,
  email,
  label = 'Pay Now',
}: {
  items: CartItem[];
  email?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (!items || items.length === 0) {
        alert('Your cart is empty.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({
            name: it.name,
            price: it.price,
            quantity: it.quantity ?? 1,
            currency: it.currency ?? 'inr',
            description: it.description,
          })),
          customerEmail: email ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('create-session error:', data);
        alert(`Failed to create checkout session: ${data?.error || res.statusText}`);
        setLoading(false);
        return;
      }

      // ✅ Simple redirect without using Stripe SDK
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      alert('Something went wrong: No checkout URL found.');
    } catch (err: any) {
      console.error('handleCheckout error:', err);
      alert('An error occurred while starting checkout. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      aria-busy={loading}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
      type="button"
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.25"
            />
            <path
              d="M22 12a10 10 0 00-10-10"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
          Redirecting...
        </>
      ) : (
        label
      )}
    </button>
  );
}
