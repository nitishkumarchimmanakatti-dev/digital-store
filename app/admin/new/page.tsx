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
          <label className="label">Price ($)</label>
          <input name="price" required type="number" step="0.01" min="0" className="input" placeholder="0.00" />
        </div>
        
        <div>
          <label className="label">Digital File (Required)</label>
          {fileUrl ? (
            <p className="text-muted" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>✅ File uploaded successfully!</p>
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
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="Cover" style={{ width: '100%', borderRadius: '8px', marginTop: '0.5rem' }} />
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
