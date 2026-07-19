'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@/utils/uploadthing';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fileUrl) {
      alert("Please upload the digital file first!");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('fileUrl', fileUrl);
      if (coverUrl) formData.set('coverUrl', coverUrl);
      
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert('Failed to create product.');
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
      <h1 className="heading-2" style={{ marginBottom: '2rem' }}>Create New Product</h1>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label">Product Title</label>
          <input name="title" required type="text" className="input" placeholder="e.g. Next.js Masterclass" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea name="description" required className="input" rows={4} placeholder="Describe your product..."></textarea>
        </div>
        <div>
          <label className="label">Price (₹)</label>
          <input name="price" required type="number" step="0.01" min="0" className="input" placeholder="0.00" />
        </div>
        
        <div>
          <label className="label">Digital File (Required)</label>
          {fileUrl ? (
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted">✅ File uploaded successfully!</span>
              <button type="button" onClick={() => setFileUrl(null)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', minHeight: 'auto' }}>Remove</button>
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
            <div style={{ position: 'relative', marginTop: '0.5rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt="Cover" style={{ width: '100%', borderRadius: '8px' }} />
              <button 
                type="button" 
                onClick={() => setCoverUrl(null)} 
                className="btn btn-secondary" 
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', minHeight: 'auto' }}
              >
                Remove
              </button>
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
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
