import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { adminFetch, adminCreate, adminUpdate, adminDelete } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', notes: '', total: '', items: [] });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    try {
      setOrders(await adminFetch('/admin/orders/'));
    } catch { showToast('Failed to load orders'); }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const markDelivered = async (id) => {
    try {
      await adminUpdate(`/admin/orders/${id}/`, { status: 'delivered', deliveredAt: new Date().toISOString() });
      showToast(`Order #${id} marked as delivered`);
      load();
    } catch { showToast('Failed to update order'); }
  };

  const openCreate = () => {
    setForm({ fullName: '', phone: '', address: '', notes: '', total: '', items: [] });
    setModal('create');
  };

  const openEdit = (o) => {
    setForm({ fullName: o.fullName, phone: o.phone, address: o.address, notes: o.notes, total: o.total, items: o.items || [] });
    setModal({ type: 'edit', id: o.id });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete order #${id}?`)) return;
    try {
      await adminDelete(`/admin/orders/${id}/`);
      showToast(`Order #${id} deleted`);
      load();
    } catch { showToast('Failed to delete order'); }
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, total: Number(form.total) };
      if (modal === 'create') {
        await adminCreate('/admin/orders/', { ...payload, paymentMethod: 'whatsapp', status: 'pending' });
        showToast('Order created');
      } else {
        await adminUpdate(`/admin/orders/${modal.id}/`, payload);
        showToast('Order updated');
      }
      setModal(null);
      load();
    } catch { showToast('Failed to save order'); }
  };

  return (
    <AdminLayout title="Orders">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Orders ({orders.length})</h2>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Order
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Delivered At</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No orders yet</td></tr>
              )}
              {orders.map((o, i) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{i + 1}</td>
                  <td>{o.fullName}</td>
                  <td>{o.phone}</td>
                  <td>Rs. {o.total}</td>
                  <td style={{ textTransform: 'capitalize' }}>{o.paymentMethod}</td>
                  <td><span className={`status-pill ${o.status}`}>{o.status}</span></td>
                  <td style={{ fontSize: 12, color: '#888' }}>{o.deliveredAt ? new Date(o.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(o)}>
                        <Edit2 size={13} />
                      </button>
                      {o.status !== 'delivered' && o.status !== 'cancelled' ? (
                        <button className="admin-btn admin-btn-green admin-btn-sm" onClick={() => markDelivered(o.id)}>
                          Mark Delivered
                        </button>
                      ) : (
                        <span style={{ color: '#999', fontSize: 12 }}>{o.status === 'delivered' ? 'Delivered' : 'Cancelled'}</span>
                      )}
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(o.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
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
              <h2>{modal === 'create' ? 'Add Order' : 'Edit Order'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Full Name</label>
                  <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Address</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Total (Rs.)</label>
                <input type="number" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="admin-btn admin-btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>{modal === 'create' ? 'Create Order' : 'Update Order'}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </AdminLayout>
  );
}
