import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, MessageCircle } from 'lucide-react';
import { VARIETIES } from '../data/products';
import { useCmsResource } from '../api/cms';
import './Pages.css';

export default function Varieties() {
  const navigate = useNavigate();
  const cmsCategories = useCmsResource('/categories/', VARIETIES);
  const categories = cmsCategories.length <= 1 ? VARIETIES : cmsCategories;
  const varieties = categories
    .filter((item) => (typeof item === 'string' ? item !== 'All Products' : item.name !== 'All Products'))
    .map((item) => (typeof item === 'string'
      ? VARIETIES.find((variety) => variety.name === item) || { id: item, name: item, description: 'Crunchy, flavourful, and irresistible.', image: '/images/products/kushal_all_in_opne_namkeen.png' }
      : { id: item.id, name: item.name, description: item.description, image: item.image || '/images/products/kushal_all_in_opne_namkeen.png' }));
  return (
    <div>
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: 'url(/images/varitieshero.png)' }} />
        <div className="page-hero-content">
          <div className="breadcrumb"><Home size={13} /><a href="/">HOME</a><span>›</span><span>VARITIES</span></div>
          <h1>Our Snack Varieties</h1>
          <div className="hero-underline" />
          <p>Explore our wide range of authentic, mouth-watering snacks crafted to satisfy every mood.</p>
        </div>
      </div>

      {/* Varieties grid */}
      <section className="section" style={{ background: '#FFFDE7' }}>
        <div className="container">
          <div className="var-grid">
            {varieties.map((v, i) => (
              <div key={v.id} className={`var-card${i === 0 ? ' var-card--big' : i === 1 ? ' var-card--wide' : ''}`}
                onClick={() => navigate(`/products?cat=${encodeURIComponent(v.name)}`)}>
                <img src={v.image} alt={v.name} className="var-img" loading="lazy" decoding="async" />
                <div className="var-overlay" />
                <div className="var-content">
                  <h3 className="var-title">{v.name}</h3>
                  <p className="var-sub">{v.description}</p>
                  <button className="var-btn">Explore <ChevronRight size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured banner */}
      <section className="section">
        <div className="container">
          <div className="var-featured">
            <span className="var-feat-badge">Featured</span>
            <h2 className="var-feat-title">The Ultimate Crunchy Chips Experience</h2>
            <p className="var-feat-sub">Discover our best-selling instant chips. Perfect texture, bold flavours, ready to enjoy anytimes</p>
            <button className="btn-primary" style={{ borderRadius: 24, padding: '11px 28px' }} onClick={() => navigate('/products')}>
              View Collection →
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="var-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="var-cta-title">Not Sure What to Try?</h2>
          <p className="var-cta-sub">Explore our full catalog and discover a wide variety of snacks crafted for every taste.</p>
          <div className="var-cta-btns">
            <button className="var-btn-outline" onClick={() => navigate('/products')}>Explore all Products</button>
            <a href="https://wa.me/9779857021032" target="_blank" rel="noreferrer" className="var-btn-wa">
              <MessageCircle size={15} /> Chat on WhatsApp
            </a>
          </div>
          <div className="var-badges">
            {['🚚 Free Delivery', '🌿 Quality Ingredients', '⭐ Great Taste'].map(b => (
              <span key={b} className="var-badge">{b}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
