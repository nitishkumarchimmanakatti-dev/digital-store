import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { razorpay } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order_id: string, payment_id: string }> }) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.order_id;
  const paymentId = resolvedParams.payment_id;

  if (!orderId || !paymentId) {
    notFound();
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment || payment.status !== 'captured') {
        throw new Error("Payment not captured");
    }

    const productId = payment.notes?.productId as string;
    const buyerEmail = payment.email as string || 'Unknown';

    if (!productId) {
      notFound();
    }

    // Find or create the order
    let order = await prisma.order.findUnique({
      where: { razorpayOrderId: orderId }
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          productId,
          buyerEmail,
          status: 'COMPLETED',
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
        }
      });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h1 className="heading-1" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Thank You!</h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem' }}>
            Your payment was successful. You can download <strong>{product?.title}</strong> below.
          </p>

          <a href={`/api/download/${order.id}`} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', width: '100%', display: 'inline-block', marginBottom: '1rem' }}>
            Download Now
          </a>
          
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            A copy of the receipt has been sent to {buyerEmail}
          </p>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn btn-secondary">
            Return to Store
          </Link>
        </div>
      </div>
    );
  } catch (error) {
     console.error(error);
     return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h1 className="heading-2">Payment Verification Failed</h1>
          <p className="text-muted">It looks like this payment was not completed successfully.</p>
        </div>
     );
  }
}
