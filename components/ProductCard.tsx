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
    <Link href={`/product/${id}`} className="product-card">
      <div className="badge">Best Seller</div>
      <div className="product-image-container">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="product-image" />
        ) : (
          <div className="product-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-muted">No Cover</span>
          </div>
        )}
        <div className="image-overlay"></div>
      </div>
      <div className="product-content">
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
        <p className="text-muted" style={{ fontSize: '0.95rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.6 }}>
          {description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--foreground)' }}>₹{price.toFixed(2)}</span>
          <span className="text-gradient" style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>View Details &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
