import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Storefront() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="hero-cinematic">
        <div>
          <h1 className="heading-serif hero-title">
            Welcome to the world<br/>of DigitalStore
          </h1>
          <a href="#products" className="hero-btn">Discover our products</a>
        </div>
      </div>

      <div id="products">

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
    </div>
  );
}
