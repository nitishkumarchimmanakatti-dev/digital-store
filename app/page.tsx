import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Storefront() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div style={{ padding: '6rem 0', maxWidth: '900px' }}>
        <h1 className="heading-1">
          Premium digital<br/>assets for creators.
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.6, marginTop: '2rem' }}>
          Elevate your work with our curated collection of templates, guides, and tools designed for modern professionals.
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
