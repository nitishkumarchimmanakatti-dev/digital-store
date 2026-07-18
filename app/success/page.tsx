import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id: string }> }) {
  const resolvedParams = await searchParams;
  const sessionId = resolvedParams.session_id;

  if (!sessionId) {
    notFound();
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session || session.payment_status !== 'paid') {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1 className="heading-2">Payment Not Completed</h1>
        <p className="text-muted">It looks like this payment was not completed successfully.</p>
      </div>
    );
  }

  const productId = session.metadata?.productId;
  const buyerEmail = session.customer_details?.email || 'Unknown';

  if (!productId) {
    notFound();
  }

  // Find or create the order (to avoid race conditions with webhook)
  let order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId }
  });

  if (!order) {
    order = await prisma.order.create({
      data: {
        productId,
        buyerEmail,
        status: 'COMPLETED',
        stripeSessionId: sessionId,
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
}
