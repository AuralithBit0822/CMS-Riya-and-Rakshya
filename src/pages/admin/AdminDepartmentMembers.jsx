import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Upload, Mail } from 'lucide-react';
import { adminFetch, adminCreate, adminUpdate, adminDelete, adminUpload, adminSendMessage } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminDepartmentMembers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', bio: '', image: '' });
  const [toast, setToast] = useState(null);
  const [uploadRef, setUploadRef] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [composeModal, setComposeModal] = useState(null);
  const [composeForm, setComposeForm] = useState({ subject: '', message: '' });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadDepartment = useCallback(async () => {
    try {
      const all = await adminFetch('/admin/departments/');
      const dept = all.find(d => d.id === Number(id));
      setDepartment(dept || { name: 'Department' });
    } catch {}
  }, [id]);

  const loadMembers = useCallback(async () => {
    try {
      setMembers(await adminFetch(`/admin/departments/${id}/members/`));
    } catch { showToast('Failed to load members'); }
  }, [id, showToast]);

  useEffect(() => { loadDepartment(); loadMembers(); }, [loadDepartment, loadMembers]);

  const openCreate = () => {
    setForm({ name: '', email: '', phone: '', role: '', bio: '', image: '' });
    setModal('create');
  };

  const openEdit = (m) => {
    setForm({ name: m.name, email: m.email, phone: m.phone || '', role: m.role || '', bio: m.bio || '', image: m.image || '' });
    setModal({ type: 'edit', id: m.id });
  };

  const handleSave = async () => {
    try {
      if (modal === 'create') {
        await adminCreate(`/admin/departments/${id}/members/`, form);
        showToast('Member added & email sent');
      } else {
        await adminUpdate(`/admin/departments/${id}/members/${modal.id}/`, form);
        showToast('Member updated');
      }
      setModal(null);
      loadMembers();
    } catch { showToast('Failed to save member'); }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await adminDelete(`/admin/departments/${id}/members/${memberId}/`);
      showToast('Member removed');
      loadMembers();
    } catch { showToast('Failed to delete member'); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await adminUpload(file, 'members');
      setForm(f => ({ ...f, image: result.url }));
      showToast('Image uploaded');
    } catch { showToast('Failed to upload image'); }
  };

  const toggleSelect = (memberId) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId); else next.add(memberId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === members.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(members.map(m => m.id)));
    }
  };

  const openCompose = (targetMembers) => {
    setComposeForm({ subject: '', message: '' });
    setComposeModal(targetMembers);
  };

  const handleSend = async () => {
    const target = composeModal;
    if (!target || target.length === 0) return;
    try {
      await adminSendMessage(target.map(m => m.id), composeForm.subject, composeForm.message);
      showToast(`Message sent to ${target.length} member(s)`);
      setComposeModal(null);
      setSelected(new Set());
    } catch {
      showToast('Failed to send message');
    }
  };

  return (
    <AdminLayout title={department ? `${department.name} Members` : 'Department Members'}>
      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => navigate('/admin/departments')}>
              <ArrowLeft size={16} />
            </button>
            <h2>{department ? department.name : 'Department'} — Members ({members.length})</h2>
          </div>
          {selected.size > 0 ? (
            <button className="admin-btn admin-btn-primary" onClick={() => openCompose(members.filter(m => selected.has(m.id)))}>
              <Mail size={16} /> Send Message to {selected.size} member(s)
            </button>
          ) : (
            <button className="admin-btn admin-btn-primary" onClick={openCreate}>
              <Plus size={16} /> Add Member
            </button>
          )}
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={members.length > 0 && selected.size === members.length} onChange={toggleSelectAll} />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No members yet</td></tr>
              )}
              {members.map(m => (
                <tr key={m.id} style={{ background: selected.has(m.id) ? '#fff8f0' : undefined }}>
                  <td>
                    <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} />
                  </td>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>{m.email}</td>
                  <td style={{ color: '#888' }}>{m.phone || '—'}</td>
                  <td style={{ color: '#888' }}>{m.role || '—'}</td>
                  <td className="cell-actions">
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(m)}><Edit2 size={13} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(m.id)}><Trash2 size={13} /></button>
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openCompose([m])} style={{ gap: 4 }}>
                      <Mail size={13} /> Send
                    </button>
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
              <h2>{modal === 'create' ? 'Add Member' : 'Edit Member'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Role</label>
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Team Member" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} />
              </div>
              <div className="admin-form-group">
                <label>Image URL</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} style={{ flex: 1 }} />
                  <input type="file" accept="image/*" ref={el => setUploadRef(el)} onChange={handleUpload} style={{ display: 'none' }} />
                  <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => uploadRef?.click()}>
                    <Upload size={14} /> Upload
                  </button>
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

      {composeModal && (
        <div className="modal-overlay" onClick={() => setComposeModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Mail size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Send Message</h2>
              <button className="modal-close" onClick={() => setComposeModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="admin-form-group">
                <label>To</label>
                <div style={{ padding: '6px 0', color: '#666', fontSize: 14 }}>
                  {composeModal.map(m => m.name).join(', ')} ({composeModal.length} member{composeModal.length > 1 ? 's' : ''})
                </div>
              </div>
              <div className="admin-form-group">
                <label>Subject</label>
                <input value={composeForm.subject} onChange={e => setComposeForm(f => ({ ...f, subject: e.target.value }))} placeholder="Enter message subject" />
              </div>
              <div className="admin-form-group">
                <label>Message</label>
                <textarea value={composeForm.message} onChange={e => setComposeForm(f => ({ ...f, message: e.target.value }))} rows={5} placeholder="Write your message here..." style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setComposeModal(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSend} disabled={!composeForm.subject.trim() || !composeForm.message.trim()}>
                <Mail size={14} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  );
}
