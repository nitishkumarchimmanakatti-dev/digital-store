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
        <h3 className="heading-serif" style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>₹{price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
