import React, { useEffect, useState } from 'react';
import { Package, Tags, ShoppingCart, Star } from 'lucide-react';
import { adminFetch } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, feedback: 0 });

  useEffect(() => {
    Promise.all([
      adminFetch('/admin/products/').then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      adminFetch('/admin/categories/').then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      adminFetch('/admin/orders/').then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
      adminFetch('/admin/feedback/').then(d => Array.isArray(d) ? d.length : 0).catch(() => 0),
    ]).then(([products, categories, orders, feedback]) => {
      setStats({ products, categories, orders, feedback });
    });
  }, []);

  const cards = [
    { icon: Package, label: 'Products', value: stats.products, color: '#C8102E', bg: '#FFF0F0' },
    { icon: Tags, label: 'Categories', value: stats.categories, color: '#1565C0', bg: '#E3F2FD' },
    { icon: ShoppingCart, label: 'Orders', value: stats.orders, color: '#2E7D32', bg: '#E8F5E9' },
    { icon: Star, label: 'Feedback', value: stats.feedback, color: '#7B1FA2', bg: '#F3E5F5' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-stats-grid">
        {cards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="admin-stat-card">
            <div className="stat-icon" style={{ background: bg, color }}>
              <Icon size={22} />
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
