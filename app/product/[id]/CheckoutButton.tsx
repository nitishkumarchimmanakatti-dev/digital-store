'use client';
import { useState } from 'react';

export default function CheckoutButton({ productId, price }: { productId: string, price: number }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      
      const data = await res.json();
      if (res.ok && data.url) {
        // Redirect the user to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (error) {
      console.error(error);
      alert('Checkout error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
      {loading ? 'Redirecting to secure checkout...' : 'Purchase Now'}
    </button>
  );
}
