import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, MessageCircle, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { wishlist, cartCount, searchQuery, setSearchQuery } = useApp();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (p) => location.pathname === p;

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Shadow on scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
    }
  };

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/products',  label: 'Products' },
    { to: '/varieties', label: 'Varities' },
    { to: '/about',     label: 'About' },
    { to: '/contact',   label: 'Contact' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner">

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src="/images/Logo.png" alt="R&R" className="navbar__logo-img"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <span className="navbar__logo-fallback">R&R</span>
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">Riya &amp; Rakshya</span>
              <span className="navbar__logo-sub">Food products</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="navbar__links nav-desktop-links">
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={`navbar__link${isActive(l.to) ? ' navbar__link--active' : ''}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="navbar__right">
            {/* Search */}
            <form onSubmit={handleSearch} className="navbar__search nav-desktop-search">
              <input
                type="text" placeholder="Search items"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="navbar__search-input"
              />
              <button type="submit" className="navbar__search-btn" aria-label="Search">
                <Search size={15} color="#888" />
              </button>
            </form>

            {/* Wishlist */}
            <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
              <Heart size={20} color={wishlist.length ? '#C8102E' : '#555'} fill={wishlist.length ? '#C8102E' : 'none'} />
              {wishlist.length > 0 && <span className="navbar__badge">{wishlist.length}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="navbar__icon-btn" aria-label="Cart">
              <ShoppingCart size={20} color="#555" />
              {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
            </Link>

            {/* WhatsApp — desktop only */}
            <a href="https://wa.me/9779857021032" target="_blank" rel="noreferrer"
              className="navbar__wa-btn nav-desktop-wa">
              <MessageCircle size={15} /> WhatsApp
            </a>

            {/* Hamburger */}
            <button
              className="navbar__hamburger nav-hamburger-btn"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && <div className="navbar__overlay" onClick={() => setOpen(false)} />}

      {/* Mobile drawer */}
      <div className={`navbar__drawer${open ? ' navbar__drawer--open' : ''}`}>
        {/* Mobile search */}
        <form onSubmit={handleSearch} className="drawer__search">
          <input
            type="text" placeholder="Search products..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="drawer__search-input"
          />
          <button type="submit" className="drawer__search-btn"><Search size={16} color="#fff" /></button>
        </form>

        {/* Links */}
        <nav className="drawer__links">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`drawer__link${isActive(l.to) ? ' drawer__link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile icon row */}
        <div className="drawer__icons">
          <Link to="/wishlist" className="drawer__icon-btn" onClick={() => setOpen(false)}>
            <Heart size={18} color={wishlist.length ? '#C8102E' : '#555'} fill={wishlist.length ? '#C8102E' : 'none'} />
            <span>Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</span>
          </Link>
          <Link to="/cart" className="drawer__icon-btn" onClick={() => setOpen(false)}>
            <ShoppingCart size={18} color="#555" />
            <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
          </Link>
        </div>

        {/* WhatsApp CTA */}
        <a href="https://wa.me/9779857021032" target="_blank" rel="noreferrer"
          className="drawer__wa" onClick={() => setOpen(false)}>
          <MessageCircle size={17} /> Chat on WhatsApp
        </a>
      </div>
    </>
  );
}
