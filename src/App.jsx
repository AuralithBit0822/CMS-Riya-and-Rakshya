import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Varieties from './pages/Varieties';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminAbout from './pages/admin/AdminAbout';
import AdminContent from './pages/admin/AdminContent';
import AdminContact from './pages/admin/AdminContact';
import AdminMedia from './pages/admin/AdminMedia';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminDepartmentMembers from './pages/admin/AdminDepartmentMembers';
import ChangePassword from './pages/admin/ChangePassword';
import ResetPassword from './pages/admin/ResetPassword';
import './styles/global.css';
import './styles/Admin.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
}

function getAppMode() {
  const host = window.location.hostname;
  if (host === 'rnrfood.com') return 'public';
  if (host === 'admin.rnrfood.com') return 'admin';
  return 'full';
}

// Updates <title> on every page for SEO
function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles = {
      '/':          'R&R Food Products | Riya & Rakshya — Nepal\'s No.1 Snacks',
      '/products':  'All Products | RNR Food Products Nepal',
      '/varieties': 'Snack Varieties | R&R Food Products',
      '/about':     'About Us | Riya & Rakshya Food Products Nepal',
      '/contact':   'Contact | RNR Food Products Bhairahwa Nepal',
      '/cart':      'Your Cart | R&R Food Products',
      '/wishlist':  'Wishlist | R&R Food Products',
      '/admin':     'Dashboard | R&R Admin',
    };
    document.title = titles[pathname] || 'R&R Food Products | Riya & Rakshya Nepal';
  }, [pathname]);
  return null;
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash, key]);

  return null;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  const mode = getAppMode();

  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        {mode === 'admin' ? (
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin/products" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
            <Route path="/admin/categories" element={<PrivateRoute><AdminCategories /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
            <Route path="/admin/feedback" element={<PrivateRoute><AdminFeedback /></PrivateRoute>} />
            <Route path="/admin/homecontent" element={<PrivateRoute><AdminContent /></PrivateRoute>} />
            <Route path="/admin/about" element={<PrivateRoute><AdminAbout /></PrivateRoute>} />
            <Route path="/admin/departments" element={<PrivateRoute><AdminDepartments /></PrivateRoute>} />
            <Route path="/admin/departments/:id/members" element={<PrivateRoute><AdminDepartmentMembers /></PrivateRoute>} />
            <Route path="/admin/contact" element={<PrivateRoute><AdminContact /></PrivateRoute>} />
            <Route path="/admin/media" element={<PrivateRoute><AdminMedia /></PrivateRoute>} />
            <Route path="/admin/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        ) : mode === 'public' ? (
          <Routes>
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/varieties" element={<Varieties />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                      <h1 style={{ fontSize: 60, fontWeight: 900, color: '#C8102E' }}>404</h1>
                      <h2>Page Not Found</h2>
                      <a href="/" style={{ color: '#C8102E', fontWeight: 600, display: 'block', marginTop: 20 }}>Go Home →</a>
                    </div>
                  } />
                </Routes>
                <PageTitle />
              </Layout>
            } />
          </Routes>
        ) : (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin/products" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
            <Route path="/admin/categories" element={<PrivateRoute><AdminCategories /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
            <Route path="/admin/feedback" element={<PrivateRoute><AdminFeedback /></PrivateRoute>} />
            <Route path="/admin/homecontent" element={<PrivateRoute><AdminContent /></PrivateRoute>} />
            <Route path="/admin/about" element={<PrivateRoute><AdminAbout /></PrivateRoute>} />
            <Route path="/admin/departments" element={<PrivateRoute><AdminDepartments /></PrivateRoute>} />
            <Route path="/admin/departments/:id/members" element={<PrivateRoute><AdminDepartmentMembers /></PrivateRoute>} />
            <Route path="/admin/contact" element={<PrivateRoute><AdminContact /></PrivateRoute>} />
            <Route path="/admin/media" element={<PrivateRoute><AdminMedia /></PrivateRoute>} />
            <Route path="/admin/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/varieties" element={<Varieties />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={
                    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                      <h1 style={{ fontSize: 60, fontWeight: 900, color: '#C8102E' }}>404</h1>
                      <h2>Page Not Found</h2>
                      <a href="/" style={{ color: '#C8102E', fontWeight: 600, display: 'block', marginTop: 20 }}>Go Home →</a>
                    </div>
                  } />
                </Routes>
                <PageTitle />
              </Layout>
            } />
          </Routes>
        )}
      </Router>
    </AppProvider>
  );
}
