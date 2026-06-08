import React, { useEffect, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { adminFetch, adminUpdate, adminUpload } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminAbout() {
  const [form, setForm] = useState({
    heroImage: '', storyTitle: '', storyParagraphs: [],
    missionTitle: '', missionText: '', visionTitle: '', visionText: '',
    qualityTitle: '', qualityText: '',
    stats: [],
    whyChooseTitle: '', whyChooseItems: [],
    ctaLeftTitle: '', ctaLeftText: '', ctaRightTitle: '', ctaRightText: '',
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroRef, setHeroRef] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    adminFetch('/admin/about-content/')
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => { showToast('Failed to load about content'); setLoading(false); });
  }, [showToast]);

  const handleSave = async () => {
    try {
      await adminUpdate('/admin/about-content/', form);
      showToast('About content updated');
    } catch { showToast('Failed to save'); }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await adminUpload(file, 'products');
      setForm(f => ({ ...f, heroImage: result.url }));
      showToast('Image uploaded');
    } catch { showToast('Failed to upload image'); }
  };

  const addStat = () => {
    setForm(f => ({ ...f, stats: [...f.stats, { value: '', label: '' }] }));
  };

  const updateStat = (i, field, val) => {
    setForm(f => {
      const items = [...f.stats];
      items[i] = { ...items[i], [field]: val };
      return { ...f, stats: items };
    });
  };

  const removeStat = (i) => {
    setForm(f => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }));
  };

  const addWhyItem = () => {
    setForm(f => ({ ...f, whyChooseItems: [...f.whyChooseItems, { icon: '', title: '', description: '' }] }));
  };

  const updateWhyItem = (i, field, val) => {
    setForm(f => {
      const items = [...f.whyChooseItems];
      items[i] = { ...items[i], [field]: val };
      return { ...f, whyChooseItems: items };
    });
  };

  const removeWhyItem = (i) => {
    setForm(f => ({ ...f, whyChooseItems: f.whyChooseItems.filter((_, j) => j !== i) }));
  };

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  if (loading) return <AdminLayout title="About Page"><p style={{ color: '#888' }}>Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="About Page">
      <div className="admin-card" style={{ padding: 24 }}>

        {/* Hero Image */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Hero Image</h2>
        <div className="admin-form-group">
          <label>Hero Image URL</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input value={form.heroImage} onChange={e => update('heroImage', e.target.value)} style={{ flex: 1 }} />
            <input type="file" accept="image/*" ref={el => setHeroRef(el)} onChange={handleHeroUpload} style={{ display: 'none' }} />
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => heroRef?.click()}>
              <Upload size={14} /> Upload
            </button>
          </div>
        </div>

        {/* Story */}
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>The R&amp;R Story</h2>
        <div className="admin-form-group">
          <label>Story Title</label>
          <input value={form.storyTitle} onChange={e => update('storyTitle', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Story Paragraphs</label>
          <textarea value={(form.storyParagraphs || []).join('\n\n')} onChange={e => update('storyParagraphs', e.target.value.split('\n\n'))} rows={6} />
        </div>

        {/* Mission & Vision */}
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Mission &amp; Vision</h2>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Mission Title</label>
            <input value={form.missionTitle} onChange={e => update('missionTitle', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Vision Title</label>
            <input value={form.visionTitle} onChange={e => update('visionTitle', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Mission Text</label>
            <textarea value={form.missionText} onChange={e => update('missionText', e.target.value)} rows={4} />
          </div>
          <div className="admin-form-group">
            <label>Vision Text</label>
            <textarea value={form.visionText} onChange={e => update('visionText', e.target.value)} rows={4} />
          </div>
        </div>

        {/* Quality */}
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Quality &amp; Safety</h2>
        <div className="admin-form-group">
          <label>Quality Title</label>
          <input value={form.qualityTitle} onChange={e => update('qualityTitle', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Quality Text</label>
          <textarea value={form.qualityText} onChange={e => update('qualityText', e.target.value)} rows={4} />
        </div>

        {/* Stats */}
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Stats</h2>
        {form.stats.map((item, i) => (
          <div key={i} className="form-row" style={{ marginBottom: 8 }}>
            <div className="admin-form-group">
              <label>Value</label>
              <input value={item.value} onChange={e => updateStat(i, 'value', e.target.value)} placeholder="50+" />
            </div>
            <div className="admin-form-group">
              <label>Label</label>
              <input value={item.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Products Manufactured" />
            </div>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeStat(i)} style={{ alignSelf: 'flex-end', marginBottom: 2 }}>×</button>
          </div>
        ))}
        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={addStat}>+ Add Stat</button>

        {/* Why Choose */}
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Why Choose Us</h2>
        <div className="admin-form-group">
          <label>Section Title</label>
          <input value={form.whyChooseTitle} onChange={e => update('whyChooseTitle', e.target.value)} />
        </div>
        {form.whyChooseItems.map((item, i) => (
          <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <div className="form-row">
              <div className="admin-form-group">
                <label>Icon (emoji)</label>
                <input value={item.icon || ''} onChange={e => updateWhyItem(i, 'icon', e.target.value)} style={{ width: 80 }} />
              </div>
              <div className="admin-form-group" style={{ flex: 1 }}>
                <label>Title</label>
                <input value={item.title} onChange={e => updateWhyItem(i, 'title', e.target.value)} />
              </div>
              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => removeWhyItem(i)} style={{ alignSelf: 'flex-end' }}>×</button>
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea value={item.description} onChange={e => updateWhyItem(i, 'description', e.target.value)} rows={2} />
            </div>
          </div>
        ))}
        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={addWhyItem}>+ Add Item</button>

        {/* Bottom CTAs */}
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Bottom CTAs</h2>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Left CTA Title</label>
            <input value={form.ctaLeftTitle} onChange={e => update('ctaLeftTitle', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Right CTA Title</label>
            <input value={form.ctaRightTitle} onChange={e => update('ctaRightTitle', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Left CTA Text</label>
            <textarea value={form.ctaLeftText} onChange={e => update('ctaLeftText', e.target.value)} rows={3} />
          </div>
          <div className="admin-form-group">
            <label>Right CTA Text</label>
            <textarea value={form.ctaRightText} onChange={e => update('ctaRightText', e.target.value)} rows={3} />
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  );
}
