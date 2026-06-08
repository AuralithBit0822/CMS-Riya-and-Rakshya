import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminFetch, adminCreate, adminUpdate, adminDelete } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminDepartments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', sortOrder: 0, isActive: true });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    try {
      setDepartments(await adminFetch('/admin/departments/'));
    } catch { showToast('Failed to load departments'); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: '', description: '', sortOrder: 0, isActive: true });
    setModal('create');
  };

  const openEdit = (d) => {
    setForm({ name: d.name, description: d.description || '', sortOrder: d.sortOrder || 0, isActive: d.isActive });
    setModal({ type: 'edit', id: d.id });
  };

  const handleSave = async () => {
    try {
      if (modal === 'create') {
        await adminCreate('/admin/departments/', form);
        showToast('Department created');
      } else {
        await adminUpdate(`/admin/departments/${modal.id}/`, form);
        showToast('Department updated');
      }
      setModal(null);
      load();
    } catch { showToast('Failed to save department'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await adminDelete(`/admin/departments/${id}/`);
      showToast('Department deleted');
      load();
    } catch { showToast('Failed to delete department'); }
  };

  return (
    <AdminLayout title="Departments">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Departments ({departments.length})</h2>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Department
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Sort</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No departments yet</td></tr>
              )}
              {departments.map(d => (
                <tr key={d.id}>
                  <td style={{ color: '#999' }}>{d.id}</td>
                  <td>
                    <span
                      style={{ color: '#C8102E', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                      onClick={() => navigate(`/admin/departments/${d.id}/members`)}
                    >
                      {d.name}
                    </span>
                  </td>
                  <td style={{ color: '#888', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.description}</td>
                  <td>{d.memberCount}</td>
                  <td>{d.sortOrder}</td>
                  <td><span className={`status-pill ${d.isActive ? 'active' : 'inactive'}`}>{d.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="cell-actions">
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(d)}><Edit2 size={13} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(d.id)}><Trash2 size={13} /></button>
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
              <h2>{modal === 'create' ? 'Add Department' : 'Edit Department'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="admin-form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
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
