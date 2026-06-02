import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Upload } from 'lucide-react';
import { adminFetch, adminUpdate, adminUpload } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminContent() {
  const [form, setForm] = useState({
    badgeText: '', heroTitle: '', heroHighlight: '', heroSubtitle: '',
    primaryButtonText: '', secondaryButtonText: '',
    happyRetailers: '', productLines: '', districts: '',
    videoUrl: '', heroImages: [],
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    adminFetch('/admin/site-content/')
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => { showToast('Failed to load site content'); setLoading(false); });
  }, [showToast]);

  const handleSave = async () => {
    try {
      await adminUpdate('/admin/site-content/', form);
      showToast('Site content updated');
    } catch { showToast('Failed to save'); }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await adminUpload(file, 'videos');
      setForm(f => ({ ...f, videoUrl: result.url }));
      showToast('Video uploaded');
    } catch { showToast('Failed to upload video'); }
  };

  const handleHeroImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await adminUpload(file, 'products');
      setForm(f => {
        const imgs = [...f.heroImages];
        imgs[index] = { ...imgs[index], img: result.url };
        return { ...f, heroImages: imgs };
      });
      showToast('Image uploaded');
    } catch { showToast('Failed to upload image'); }
  };

  const addHeroImage = () => {
    setForm(f => ({ ...f, heroImages: [...f.heroImages, { img: '', bg: '#fff8f0', label: '' }] }));
  };

  const removeHeroImage = (index) => {
    setForm(f => ({ ...f, heroImages: f.heroImages.filter((_, i) => i !== index) }));
  };

  const updateHeroImage = (index, field, value) => {
    setForm(f => {
      const imgs = [...f.heroImages];
      imgs[index] = { ...imgs[index], [field]: value };
      return { ...f, heroImages: imgs };
    });
  };

  if (loading) return <AdminLayout title="Site Content"><p style={{ color: '#888' }}>Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Site Content">
      <div className="admin-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Homepage Hero Section</h2>

        <div className="form-row">
          <div className="admin-form-group">
            <label>Badge Text</label>
            <input value={form.badgeText} onChange={e => setForm(f => ({ ...f, badgeText: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Hero Highlight (word in red)</label>
            <input value={form.heroHighlight} onChange={e => setForm(f => ({ ...f, heroHighlight: e.target.value }))} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Hero Title</label>
          <input value={form.heroTitle} onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))} />
        </div>

        <div className="admin-form-group">
          <label>Hero Subtitle</label>
          <textarea value={form.heroSubtitle} onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))} />
        </div>

        <div className="form-row">
          <div className="admin-form-group">
            <label>Primary Button Text</label>
            <input value={form.primaryButtonText} onChange={e => setForm(f => ({ ...f, primaryButtonText: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Secondary Button Text</label>
            <input value={form.secondaryButtonText} onChange={e => setForm(f => ({ ...f, secondaryButtonText: e.target.value }))} />
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Stats Section</h2>

        <div className="form-row-3">
          <div className="admin-form-group">
            <label>Happy Retailers</label>
            <input value={form.happyRetailers} onChange={e => setForm(f => ({ ...f, happyRetailers: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Product Lines</label>
            <input value={form.productLines} onChange={e => setForm(f => ({ ...f, productLines: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Districts</label>
            <input value={form.districts} onChange={e => setForm(f => ({ ...f, districts: e.target.value }))} />
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Homepage Video</h2>

        <div className="admin-form-group">
          <label>Video URL</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))} style={{ flex: 1 }} />
            <input type="file" accept="video/*" ref={videoRef} onChange={handleVideoUpload} style={{ display: 'none' }} />
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => videoRef.current?.click()}>
              <Upload size={14} /> Upload
            </button>
          </div>
          {form.videoUrl && (
            <video src={form.videoUrl} style={{ width: '100%', maxHeight: 200, marginTop: 10, borderRadius: 8 }} controls />
          )}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Hero Images</h2>

        {form.heroImages.map((item, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div className="form-row">
              <div className="admin-form-group">
                <label>Image URL</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={item.img} onChange={e => updateHeroImage(i, 'img', e.target.value)} style={{ flex: 1 }} />
                  <input type="file" accept="image/*" onChange={e => handleHeroImageUpload(e, i)} style={{ display: 'none' }} id={`hero-img-${i}`} />
                  <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => document.getElementById(`hero-img-${i}`).click()}>
                    <Upload size={14} />
                  </button>
                </div>
                {item.img && <img src={item.img} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, marginTop: 8 }} />}
              </div>
              <div className="admin-form-group">
                <label>Background Color</label>
                <input value={item.bg} onChange={e => updateHeroImage(i, 'bg', e.target.value)} placeholder="#fff8f0" />
              </div>
            </div>
            <div className="form-row">
              <div className="admin-form-group">
                <label>Label</label>
                <input value={item.label} onChange={e => updateHeroImage(i, 'label', e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 16 }}>
                <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeHeroImage(i)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
        <button className="admin-btn admin-btn-outline" onClick={addHeroImage}>+ Add Hero Image</button>

        <div style={{ marginTop: 24 }}>
          <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  );
}
