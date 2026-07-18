'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UploadButton } from '@/utils/uploadthing';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        // We can just fetch the existing product data using a quick fetch or API if we had one.
        // Since we don't have a GET /api/products/[id], we'll fetch from a Server Action or just GET it from a new API.
        // Actually, we can fetch it via the public site if we don't have a strict API. Let's just fetch it by creating a small helper, or using window.__NEXT_DATA__
      } catch (err) {
        console.error(err);
      }
    }
    loadProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileUrl) {
      alert("Please upload the digital file first!");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('description', description);
      formData.set('price', price);
      formData.set('fileUrl', fileUrl);
      if (coverUrl) formData.set('coverUrl', coverUrl);
      
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert('Failed to update product.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="heading-2" style={{ marginBottom: '2rem' }}>Edit Product</h1>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label">Product Title</label>
          <input name="title" value={title} onChange={e=>setTitle(e.target.value)} required type="text" className="input" placeholder="e.g. Next.js Masterclass" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea name="description" value={description} onChange={e=>setDescription(e.target.value)} required className="input" rows={4} placeholder="Describe your product..."></textarea>
        </div>
        <div>
          <label className="label">Price (₹)</label>
          <input name="price" value={price} onChange={e=>setPrice(e.target.value)} required type="number" step="0.01" min="0" className="input" placeholder="0.00" />
        </div>
        
        <div>
          <label className="label">Digital File (Required)</label>
          {fileUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <p className="text-muted" style={{ margin: 0 }}>✅ File uploaded successfully!</p>
              <button type="button" onClick={() => setFileUrl(null)} className="text-red-500" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Remove</button>
            </div>
          ) : (
            <div style={{ padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px' }}>
              <UploadButton
                endpoint="productFile"
                onClientUploadComplete={(res) => {
                  setFileUrl(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="label">Cover Image (Optional)</label>
          {coverUrl ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="Cover" style={{ width: '100%', borderRadius: '8px', marginTop: '0.5rem' }} />
              <button type="button" onClick={() => setCoverUrl(null)} className="text-red-500" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.5rem' }}>Remove Image</button>
            </div>
          ) : (
            <div style={{ padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px' }}>
              <UploadButton
                endpoint="coverImage"
                onClientUploadComplete={(res) => {
                  setCoverUrl(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          )}
        </div>
        
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
