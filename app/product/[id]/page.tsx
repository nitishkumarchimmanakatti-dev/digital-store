import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckoutButton from './CheckoutButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {product.coverUrl ? (
          <img src={product.coverUrl} alt={product.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-muted">No Cover Available</span>
          </div>
        )}
        <div style={{ padding: '2rem' }}>
          <h1 className="heading-1" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.title}</h1>
          <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
            {product.description}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.price.toFixed(2)}</span>
            <CheckoutButton productId={product.id} price={product.price} />
          </div>
        </div>
      </div>
    </div>
  );
}
