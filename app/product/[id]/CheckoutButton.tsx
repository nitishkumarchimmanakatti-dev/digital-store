'use client';
import { useState } from 'react';
import Script from 'next/script';

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
      if (res.ok && data.orderId) {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'Digital Store',
          description: 'Digital Product Purchase',
          order_id: data.orderId,
          handler: function (response: any) {
             window.location.href = `/success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`;
          },
          prefill: {
            name: "Customer",
            email: "test@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#38bdf8"
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
           alert(response.error.description);
        });
        rzp.open();
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
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button onClick={handleCheckout} disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
        {loading ? 'Processing...' : 'Purchase Now'}
      </button>
    </>
  );
}
