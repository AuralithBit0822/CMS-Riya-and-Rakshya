import React, { useEffect, useState, useCallback } from 'react';
import { adminFetch, adminUpdate } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminContact() {
  const [form, setForm] = useState({
    customerSupportPhone: '', businessPhone: '', whatsappNumber: '',
    supportEmail: '', salesEmail: '', address: '', businessHours: '',
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    adminFetch('/admin/contact-info/')
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => { showToast('Failed to load contact info'); setLoading(false); });
  }, [showToast]);

  const handleSave = async () => {
    try {
      await adminUpdate('/admin/contact-info/', form);
      showToast('Contact info updated');
    } catch { showToast('Failed to save'); }
  };

  if (loading) return <AdminLayout title="Contact Info"><p style={{ color: '#888' }}>Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Contact Info">
      <div className="admin-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Contact Information</h2>

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#666' }}>Phone Numbers</h3>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Customer Support Phone</label>
            <input value={form.customerSupportPhone} onChange={e => setForm(f => ({ ...f, customerSupportPhone: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Business Phone</label>
            <input value={form.businessPhone} onChange={e => setForm(f => ({ ...f, businessPhone: e.target.value }))} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>WhatsApp Number</label>
          <input value={form.whatsappNumber} onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '20px 0 12px', color: '#666' }}>Email Addresses</h3>
        <div className="form-row">
          <div className="admin-form-group">
            <label>Support Email</label>
            <input type="email" value={form.supportEmail} onChange={e => setForm(f => ({ ...f, supportEmail: e.target.value }))} />
          </div>
          <div className="admin-form-group">
            <label>Sales Email</label>
            <input type="email" value={form.salesEmail} onChange={e => setForm(f => ({ ...f, salesEmail: e.target.value }))} />
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '20px 0 12px', color: '#666' }}>Location</h3>
        <div className="admin-form-group">
          <label>Address</label>
          <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        </div>
        <div className="admin-form-group">
          <label>Business Hours</label>
          <input value={form.businessHours} onChange={e => setForm(f => ({ ...f, businessHours: e.target.value }))} />
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  );
}
