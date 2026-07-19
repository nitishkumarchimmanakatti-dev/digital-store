import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Storefront() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '5rem', marginTop: '3rem', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 10px var(--secondary)' }}></span>
          Trusted by 10,000+ Developers Worldwide
        </div>
        <h1 className="heading-1">Premium Tools For<br/>Elite Developers</h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Level up your career with our highly engineered cheat sheets, system design templates, and ChatGPT prompts.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            price={product.price}
            coverUrl={product.coverUrl}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="text-muted">No products available yet. Check back later!</p>
        </div>
      )}
    </div>
  );
}
