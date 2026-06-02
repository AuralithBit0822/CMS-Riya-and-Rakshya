import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Upload, Trash2, Image, Film } from 'lucide-react';
import { adminFetch, adminDelete, adminUpload } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminMedia() {
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await adminFetch('/admin/media/');
      setFiles(data.files || []);
    } catch { showToast('Failed to load media'); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await adminUpload(file, folder);
      showToast('File uploaded');
      load();
    } catch { showToast('Failed to upload'); }
    e.target.value = '';
  };

  const handleDelete = async (path) => {
    if (!window.confirm(`Delete ${path}?`)) return;
    try {
      await adminDelete('/admin/media/', { path });
      showToast('File deleted');
      load();
    } catch { showToast('Failed to delete'); }
  };

  return (
    <AdminLayout title="Media Library">
      <div className="admin-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <button className="admin-btn admin-btn-primary" onClick={() => imgRef.current?.click()}>
            <Upload size={16} /> Upload Image
          </button>
          <input type="file" accept="image/*" ref={imgRef} onChange={e => handleUpload(e, 'uploads')} style={{ display: 'none' }} />
          <button className="admin-btn admin-btn-primary" onClick={() => videoRef.current?.click()}>
            <Upload size={16} /> Upload Video
          </button>
          <input type="file" accept="video/*" ref={videoRef} onChange={e => handleUpload(e, 'videos')} style={{ display: 'none' }} />
        </div>

        {files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <p>No media files yet. Upload images or videos above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {files.map((f, i) => (
              <div key={i} style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                {f.type === 'video' ? (
                  <video src={f.path} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                ) : (
                  <img src={f.path} alt={f.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                )}
                <div style={{ padding: '8px 10px', fontSize: 12 }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                  <div style={{ color: '#999', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {f.type === 'video' ? <Film size={12} /> : <Image size={12} />}
                    {f.type}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(f.path)}
                  style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(220,53,69,.9)', color: '#fff', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  );
}
