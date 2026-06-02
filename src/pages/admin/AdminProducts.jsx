import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { adminFetch, adminCreate, adminUpdate, adminDelete, adminUpload } from '../../api/cms';
import AdminLayout from './AdminLayout';

const EMPTY = { name: '', categoryId: '', price: '', unit: '', description: '', image: '', sizeOptions: [], reviews: 0, rating: 5, ingredients: '', allergy: '', badge: '', isFeatured: false, featuredSortOrder: 0, isActive: true, sortOrder: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [toast, setToast] = useState(null);
  const imgRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([
        adminFetch('/admin/products/'),
        adminFetch('/admin/categories/'),
      ]);
      setProducts(p);
      setCategories(c);
    } catch {
      showToast('Failed to load data');
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ ...EMPTY, categoryId: categories[0]?.id || '' });
    setModal('create');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      categoryId: p.categoryId || '',
      price: p.price ?? '',
      unit: p.unit || '',
      description: p.description || '',
      image: p.image || '',
      sizeOptions: p.sizeOptions || [],
      reviews: p.reviews || 0,
      rating: p.rating || 5,
      ingredients: p.ingredients || '',
      allergy: p.allergy || '',
      badge: p.badge || '',
      isFeatured: p.isFeatured || false,
      featuredSortOrder: p.featuredSortOrder ?? 0,
      isActive: p.isActive !== false,
      sortOrder: p.sortOrder || 0,
    });
    setModal({ type: 'edit', id: p.id });
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, price: form.price === '' ? 0 : Number(form.price) };
      if (modal.type === 'create') {
        await adminCreate('/admin/products/', payload);
        showToast('Product created');
      } else {
        await adminUpdate(`/admin/products/${modal.id}/`, payload);
        showToast('Product updated');
      }
      setModal(null);
      load();
    } catch {
      showToast('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminDelete(`/admin/products/${id}/`);
      showToast('Product deleted');
      load();
    } catch {
      showToast('Failed to delete product');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await adminUpload(file, 'products');
      setForm(f => ({ ...f, image: result.url }));
      showToast('Image uploaded');
    } catch { showToast('Failed to upload image'); }
  };

  const addSizeOption = () => {
    setForm(f => ({ ...f, sizeOptions: [...f.sizeOptions, { size: '', price: 0 }] }));
  };

  const updateSizeOption = (i, field, value) => {
    setForm(f => {
      const opts = [...f.sizeOptions];
      opts[i] = { ...opts[i], [field]: field === 'price' ? Number(value) : value };
      return { ...f, sizeOptions: opts };
    });
  };

  const removeSizeOption = (i) => {
    setForm(f => ({ ...f, sizeOptions: f.sizeOptions.filter((_, idx) => idx !== i) }));
  };

  return (
    <AdminLayout title="Products">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Products ({products.length})</h2>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Product
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Feat. Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No products yet</td></tr>
              )}
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ color: '#999' }}>{p.id}</td>
                  <td>{p.image ? <img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '-'}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td>Rs. {p.price}</td>
                  <td><span className={`status-pill ${p.isFeatured ? 'yes' : 'no'}`}>{p.isFeatured ? 'Yes' : 'No'}</span></td>
                  <td>{p.featuredSortOrder ?? 0}</td>
                  <td><span className={`status-pill ${p.isActive ? 'active' : 'inactive'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="cell-actions">
                    <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => openEdit(p)}><Edit2 size={13} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
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
              <h2>{modal.type === 'create' ? 'Add Product' : 'Edit Product'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Price (Rs.)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Unit</label>
                  <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="e.g. 20g" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Image</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="/images/products/..." style={{ flex: 1 }} />
                  <input type="file" accept="image/*" ref={imgRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                  <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => imgRef.current?.click()}>
                    <Upload size={14} /> Upload
                  </button>
                </div>
                {form.image && <img src={form.image} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, marginTop: 8 }} />}
              </div>
              <div className="admin-form-group">
                <label>Size Options</label>
                {form.sizeOptions.map((opt, i) => (
                  <div key={i} className="size-option-row">
                    <input placeholder="Size (e.g. 20g)" value={opt.size} onChange={e => updateSizeOption(i, 'size', e.target.value)} />
                    <input type="number" placeholder="Price" value={opt.price} onChange={e => updateSizeOption(i, 'price', e.target.value)} />
                    <button onClick={() => removeSizeOption(i)}>×</button>
                  </div>
                ))}
                <button className="add-size-btn" onClick={addSizeOption}>+ Add Size</button>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label>Ingredients</label>
                  <textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Allergy Info</label>
                  <textarea value={form.allergy} onChange={e => setForm(f => ({ ...f, allergy: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-3">
                <div className="admin-form-group">
                  <label>Badge</label>
                  <input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. Bestseller" />
                </div>
                <div className="admin-form-group">
                  <label>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
                <div className="admin-form-group">
                  <label>Rating</label>
                  <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                    Featured Product
                  </label>
                </div>
                <div className="admin-form-group">
                  <label>Featured Sort Order</label>
                  <input type="number" min="0" value={form.featuredSortOrder} onChange={e => setForm(f => ({ ...f, featuredSortOrder: Number(e.target.value) }))} placeholder="0" />
                </div>
                <div className="admin-form-group">
                  <label className="checkbox-label">
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
