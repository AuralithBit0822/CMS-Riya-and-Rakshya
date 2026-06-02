import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminFetch, adminCreate, adminUpdate, adminDelete } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '', isActive: true, sortOrder: 0 });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    try {
      setCategories(await adminFetch('/admin/categories/'));
    } catch { showToast('Failed to load categories'); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: '', description: '', image: '', isActive: true, sortOrder: 0 });
    setModal('create');
  };

  const openEdit = (c) => {
    setForm({ name: c.name, description: c.description || '', image: c.image || '', isActive: c.isActive, sortOrder: c.sortOrder || 0 });
    setModal({ type: 'edit', id: c.id });
  };

  const handleSave = async () => {
    try {
      if (modal === 'create' || modal.type === 'create') {
        await adminCreate('/admin/categories/', form);
        showToast('Category created');
      } else {
        await adminUpdate(`/admin/categories/${modal.id}/`, form);
        showToast('Category updated');
      }
      setModal(null);
      load();
    } catch { showToast('Failed to save category'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminDelete(`/admin/categories/${id}/`);
      showToast('Category deleted');
      load();
    } catch { showToast('Failed to delete category'); }
  };

  return (
    <AdminLayout title="Categories">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Categories ({categories.length})</h2>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Category
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Sort</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No categories yet</td></tr>
              )}
              {categories.map(c => (
                <tr key={c.id}>
                  <td style={{ color: '#999' }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: '#888', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</td>
                  <td>{c.sortOrder}</td>
                  <td><span className={`status-pill ${c.isActive ? 'active' : 'inactive'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="cell-actions">
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(c)}><Edit2 size={13} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={13} /></button>
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
              <h2>{modal === 'create' || modal.type === 'create' ? 'Add Category' : 'Edit Category'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="admin-form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Image URL</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="admin-form-group">
                  <label className="checkbox-label" style={{ marginTop: 24 }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                    Active
                  </label>
                </div>
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
