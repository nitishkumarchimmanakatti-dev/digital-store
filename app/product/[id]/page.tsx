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
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link href="/" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>
        &larr; Back to all products
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '4rem', alignItems: 'start' }}>
        {/* Left Column - Image */}
        <div className="sticky-desktop">
          {product.coverUrl ? (
            <div className="glass-panel" style={{ padding: '0.5rem' }}>
              <img src={product.coverUrl} alt={product.title} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'calc(var(--radius-lg) - 0.5rem)' }} />
            </div>
          ) : (
            <div className="glass-panel" style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-muted">No Image</span>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div>
            <h1 className="heading-serif text-gradient" style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>{product.title}</h1>
            <span style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 600 }}>₹{product.price.toFixed(2)}</span>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--foreground)' }}>
              {product.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <CheckoutButton productId={product.id} price={product.price} />
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1rem' }}>
              Secure payment processing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
