import Link from 'next/link';

interface ProductProps {
  id: string;
  title: string;
  price: number;
  description: string;
  coverUrl?: string | null;
}

export default function ProductCard({ id, title, price, description, coverUrl }: ProductProps) {
  return (
    <Link href={`/product/${id}`} className="glass-panel product-card">
      <div className="product-image-container">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="product-image" />
        ) : (
          <div className="product-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-muted">No Cover</span>
          </div>
        )}
      </div>
      <div className="product-content">
        <h3 className="heading-serif text-gradient" style={{ fontSize: '1.5rem', margin: 0, lineHeight: 1.2 }}>{title}</h3>
        <p className="text-muted" style={{ fontSize: '0.95rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.6 }}>
          {description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '1.25rem', color: 'var(--foreground)', fontWeight: 600 }}>₹{price.toFixed(2)}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
