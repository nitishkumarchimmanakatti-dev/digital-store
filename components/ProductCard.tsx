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
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="product-image" />
      ) : (
        <div className="product-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-muted">No Cover</span>
        </div>
      )}
      <div className="product-content">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{title}</h3>
        <p className="text-muted" style={{ fontSize: '0.875rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>${price.toFixed(2)}</span>
          <span className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Details</span>
        </div>
      </div>
    </Link>
  );
}
