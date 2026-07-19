import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckoutButton from './CheckoutButton';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1200px' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '2rem' }}>
        &larr; Back to Store
      </Link>
      
      <div className="grid lg:grid-cols-2" style={{ gap: '4rem', alignItems: 'start' }}>
        {/* Left Column - Image */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          {product.coverUrl ? (
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={product.coverUrl} alt={product.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          ) : (
            <div style={{ borderRadius: 'var(--radius-xl)', aspectRatio: '4/3', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <span className="text-muted">No Cover Image</span>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div className="badge" style={{ position: 'relative', display: 'inline-block', top: 0, right: 0, marginBottom: '1rem' }}>Instant Access</div>
            <h1 className="heading-1" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{product.title}</h1>
            <p className="text-muted" style={{ fontSize: '1.125rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {product.description}
            </p>
          </div>
          
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'linear-gradient(135deg, rgba(30, 33, 40, 0.9), rgba(20, 22, 27, 0.9))' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>₹{product.price.toFixed(2)}</span>
              <span className="text-muted" style={{ paddingBottom: '0.5rem' }}>one-time payment</span>
            </div>
            
            <div className="animate-pulse-glow" style={{ borderRadius: 'var(--radius-full)' }}>
              <CheckoutButton productId={product.id} price={product.price} />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Secure payment processing by Razorpay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
