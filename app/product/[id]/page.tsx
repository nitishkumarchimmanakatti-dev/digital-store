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
    <div style={{ paddingTop: '2rem' }}>
      <Link href="/" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>
        &larr; Back to all products
      </Link>
      
      <div className="grid lg:grid-cols-2" style={{ gap: '6rem', alignItems: 'start' }}>
        {/* Left Column - Image */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          {product.coverUrl ? (
            <div style={{ backgroundColor: 'var(--surface)' }}>
              <img src={product.coverUrl} alt={product.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          ) : (
            <div style={{ aspectRatio: '3/4', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-muted">No Image</span>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingTop: '2rem' }}>
          <div>
            <h1 className="heading-serif" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '2rem' }}>{product.title}</h1>
            <span style={{ fontSize: '2rem', color: 'var(--foreground)' }}>₹{product.price.toFixed(2)}</span>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--foreground)' }}>
              {product.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CheckoutButton productId={product.id} price={product.price} />
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Secure payment processing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
