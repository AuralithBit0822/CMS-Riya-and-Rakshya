import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { adminFetch, adminCreate, adminUpdate, adminDelete } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ customerName: '', location: '', text: '', rating: 5, isVisible: true, sortOrder: 0 });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    try {
      setFeedback(await adminFetch('/admin/feedback/'));
    } catch { showToast('Failed to load feedback'); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ customerName: '', location: '', text: '', rating: 5, isVisible: true, sortOrder: 0 });
    setModal('create');
  };

  const openEdit = (f) => {
    setForm({ customerName: f.customerName, location: f.location || '', text: f.text, rating: f.rating, isVisible: f.isVisible, sortOrder: f.sortOrder || 0 });
    setModal({ type: 'edit', id: f.id });
  };

  const handleSave = async () => {
    try {
      if (modal === 'create') {
        await adminCreate('/admin/feedback/', form);
        showToast('Feedback created');
      } else {
        await adminUpdate(`/admin/feedback/${modal.id}/`, form);
        showToast('Feedback updated');
      }
      setModal(null);
      load();
    } catch { showToast('Failed to save feedback'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await adminDelete(`/admin/feedback/${id}/`);
      showToast('Feedback deleted');
      load();
    } catch { showToast('Failed to delete feedback'); }
  };

  return (
    <AdminLayout title="Feedback">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Feedback ({feedback.length})</h2>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Feedback
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Text</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedback.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No feedback yet</td></tr>
              )}
              {feedback.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600 }}>{f.customerName}</td>
                  <td>{f.location || '-'}</td>
                  <td>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#888' }}>{f.text}</td>
                  <td><span className={`status-pill ${f.isVisible ? 'yes' : 'no'}`}>{f.isVisible ? 'Yes' : 'No'}</span></td>
                  <td className="cell-actions">
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(f)}><Edit2 size={13} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(f.id)}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'create' ? 'Add Feedback' : 'Edit Feedback'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Customer Name</label>
                  <input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Feedback Text</label>
                <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} />
                </div>
                <div className="admin-form-group">
                  <label>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} />
                  Visible on site
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  );
}
