import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function deleteProduct(id: string) {
  'use server'
  await prisma.order.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/');
}

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-2">Admin Dashboard</h1>
        <Link href="/admin/new" className="btn btn-primary">Add New Product</Link>
      </div>

      {products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>No products found. Start by adding one!</p>
          <Link href="/admin/new" className="btn btn-primary">Create Product</Link>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Sales</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{product.title}</td>
                  <td style={{ padding: '1rem' }}>₹{product.price.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }} className="text-muted">0</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                    <Link href={`/product/${product.id}`} className="text-muted" style={{ textDecoration: 'underline' }}>View</Link>
                    <Link href={`/admin/edit/${product.id}`} style={{ textDecoration: 'underline', color: '#60a5fa' }}>Edit</Link>
                    <form action={async () => {
                      'use server';
                      await deleteProduct(product.id);
                    }}>
                      <button type="submit" style={{ textDecoration: 'underline', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1rem' }}>Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
