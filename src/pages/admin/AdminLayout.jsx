import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Star, Settings, Phone, Image, Lock, LogOut } from 'lucide-react';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/media', icon: Image, label: 'Media' },
  { to: '/admin/feedback', icon: Star, label: 'Feedback' },
  { to: '/admin/content', icon: Settings, label: 'Site Content' },
  { to: '/admin/contact', icon: Phone, label: 'Contact Info' },
  { to: '/admin/change-password', icon: Lock, label: 'Change Password' },
];

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const username = localStorage.getItem('admin_user') || 'Admin';

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <img
            src="/images/Logo.png"
            alt="R&R"
            className="admin-sidebar-logo"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="admin-sidebar-brand-text">
            <span className="admin-sidebar-brand-name">Riya &amp; Rakshya</span>
            <span className="admin-sidebar-brand-sub">Food products</span>
          </div>
        </div>
        <nav className="admin-sidebar-nav">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <h1>{title || 'Dashboard'}</h1>
          <div className="admin-header-right">
            <span>{username}</span>
            <button className="admin-btn-logout" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
